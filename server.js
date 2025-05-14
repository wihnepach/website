const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5501;

const db = new Database('base_arsen_markarian.db');

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

// СТАТИЧЕСКИЕ СТРАНИЦЫ
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/man', (req, res) => res.sendFile(path.join(__dirname, 'man.html')));
app.get('/woman', (req, res) => res.sendFile(path.join(__dirname, 'woman.html')));
app.get('/kids', (req, res) => res.sendFile(path.join(__dirname, 'kids.html')));
app.get('/sport', (req, res) => res.sendFile(path.join(__dirname, 'sport.html')));
app.get('/loto', (req, res) => res.sendFile(path.join(__dirname, 'loto.html')));

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

// СТАРТ СЕРВЕРА
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
