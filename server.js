const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const sqlite3 = require('sqlite3').verbose();  // Подключаем SQLite
const bodyParser = require('body-parser'); //читать JSON из POST
const multer = require('multer');

const app = express();
const PORT = 5501;



app.use(express.static(path.join(__dirname))); //отправка стат файлов
app.use(bodyParser.json());

const db = new sqlite3.Database('base_arsen_markarian.db', (err) => {
    if (err) {
        console.error('❌ Ошибка при подключении к базе данных:', err.message);
        process.exit(1); // Завершаем выполнение программы с ошибкой
    } else {
        console.log('✅ База данных успешно подключена.');
    }
});

// СТАТИЧЕСКИЕ СТРАНИЦЫ ЗАПРОСЫ НА HTML ФАЙЛЫ
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

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Ошибка запроса:', err);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }

        if (row) {
            // email найден
            return res.status(400).json({ error: 'Email уже зарегистрирован' });
        }

        // Email не найден, вставляем нового пользователя
        const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        stmt.run(name, email, password, function(err) {
            if (err) {
                console.error('Ошибка вставки:', err);
                return res.status(500).json({ error: 'Ошибка сервера при регистрации' });
            }

            res.status(200).json({
                id: this.lastID,
                name,
                email
            });
        });
        stmt.finalize();
    });
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

//СОЗДАНИЕ НОВОГО ПРОДУКТА ID ПОЛУЧАЕМ ПО EMAIL
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
//ДОБАВЛЕНИЕ ПРОДУКТА В БАЗУ ДАННЫХ/ПРОВЕРКА ИЗОБРАЖЕНИЯ/ПОЛЕЙ
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
//ФИЛЬТРАЦИЯ ПО MAIN_TAG
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
//ИЩЕМ ПОЛЬЗОВАТЕЛЯ ПО EMAIL
app.post('/api/get_username_by_email', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email не передан' });
    }

    const query = `SELECT name FROM users WHERE email = ?`;

    db.get(query, [email], (err, row) => {
        if (err) {
            console.error("Ошибка запроса к БД:", err);
            return res.status(500).json({ error: 'Ошибка сервера' });
        } 

        if (row) {
            res.json({ username: row.name });
        } else {
            res.status(404).json({ error: 'Пользователь не найден' });
        }
    });
});


// СТАРТ СЕРВЕРА
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
