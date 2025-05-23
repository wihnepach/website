const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const sqlite3 = require('sqlite3').verbose();  // Подключаем SQLite
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = 5501;



app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

const db = new sqlite3.Database('base_arsen_markarian.db', (err) => {
    if (err) {
        console.error('❌ Ошибка при подключении к базе данных:', err.message);
        process.exit(1); // Завершаем выполнение программы с ошибкой
    } else {
        console.log('✅ База данных успешно подключена.');
    }
});

// СТАТИЧЕСКИЕ СТРАНИЦЫ
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/man', (req, res) => res.sendFile(path.join(__dirname, 'man.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, 'profile.html')));
app.get('/woman', (req, res) => res.sendFile(path.join(__dirname, 'woman.html')));
app.get('/kids', (req, res) => res.sendFile(path.join(__dirname, 'kids.html')));
app.get('/sport', (req, res) => res.sendFile(path.join(__dirname, 'sport.html')));
app.get('/loto', (req, res) => res.sendFile(path.join(__dirname, 'loto.html')));
app.get('/create_product', (req, res) => res.sendFile(path.join(__dirname, 'create_product.html')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './img/'); // Папка для хранения изображений
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Генерация уникального имени файла
    }
});

// API ДЛЯ ПРОДУКТОВ
app.get('/api/products', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM products');
        const products = stmt.all();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при получении данных из базы.' });
    }
});

// РЕГИСТРАЦИЯ
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    try {
        const checkStmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const existing = checkStmt.get(email);

        if (existing) {
            return res.status(400).json({ message: 'Email уже зарегистрирован' });
        }

        const insertStmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        insertStmt.run(name, email, password);

        res.status(200).send('OK');
    } catch (err) {
        res.status(500).json({ message: 'Ошибка регистрации' });
    }
});

// ВХОД
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    try {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
        const user = stmt.get(email, password);

        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        res.status(200).json({ name: user.name });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка входа' });
    }
});

// ОФОРМЛЕНИЕ ЗАКАЗА
app.post('/checkout', (req, res) => {
    const { email, cart } = req.body;

    if (!email || !cart || !Array.isArray(cart)) {
        return res.status(400).json({ message: 'Некорректные данные для заказа' });
    }

    const orderDate = new Date().toISOString(); // текущая дата и время
    const transaction = db.transaction((items) => {
        items.forEach(item => {
            const totalPrice = item.price * item.quantity; // общая цена для товара

            // Вставляем товар в таблицу заказов
            const insert = db.prepare('INSERT INTO orders (user_email, item_name, item_price, quantity, total_price, order_date) VALUES (?, ?, ?, ?, ?, ?)');
            insert.run(email, item.name, item.price, item.quantity, totalPrice, orderDate);
        });
    });

    try {
        transaction(cart);
        res.status(200).json({ message: 'Заказ успешно оформлен!' });
    } catch (err) {
        console.error('Ошибка при сохранении заказа:', err);
        res.status(500).json({ message: 'Ошибка при оформлении заказа' });
    }
});

app.post('/api/find-user-id', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  db.get(
    'SELECT id FROM users WHERE email = ?',
    [email],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ 
        success: true,
        userId: row.id 
      });
    }
  );
});

const upload = multer({ storage: storage });

app.post('/create-product', upload.single('image'), (req, res) => {
    console.log('POST /create-product вызван');
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    const { name, description, price, main_tag, secondary_tag } = req.body; // теперь tags
    const image = req.file ? req.file.filename : null;

    if (!name || !description || !price || !image) {
        return res.json({ success: false, error: 'Пожалуйста, заполните все поля!' });
    }

    db.run(
        'INSERT INTO created_products (name, description, price, image, main_tag, secondary_tag) VALUES (?, ?, ?, ?, ?, ?)', 
        [name, description, price, image, main_tag, secondary_tag],
        function(err) {
            if (err) {
                console.error('Ошибка при добавлении товара:', err.message);
                return res.status(500).json({ success: false, error: 'Ошибка при добавлении товара' });
            }

            res.json({ success: true, productId: this.lastID });
        }
    );
});

app.get('/api/created_products', (req, res) => {
    // Запрос в базу данных для получения всех товаров
    const query = 'SELECT id, name, description, price, image, main_tag, secondary_tag FROM created_products';

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Отправляем данные о товарах в формате JSON
        res.json(rows);
    });
});

app.get('/api/created_products', (req, res) => {
    const { main_tag } = req.query;

    let query = 'SELECT id, name, description, price, image, main_tag, secondary_tag FROM created_products';
    const params = [];

    if (main_tag) {
        query += ' WHERE main_tag = ?';
        params.push(main_tag);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// СТАРТ СЕРВЕРА
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
