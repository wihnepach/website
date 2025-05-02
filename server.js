const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = 5501;

// Инициализируем базу
const db = new Database('base_arsen_markarian.db');

// Обслуживаем статику
app.use(express.static(path.join(__dirname)));

// Роуты
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/man', (req, res) => {
    res.sendFile(path.join(__dirname, 'man.html'));
});

app.get('/woman', (req, res) => {
    res.sendFile(path.join(__dirname, 'woman.html'));
});

app.get('/kids', (req, res) => {
    res.sendFile(path.join(__dirname, 'kids.html'));
});

app.get('/sport', (req, res) => {
    res.sendFile(path.join(__dirname, 'sport.html'));
});

app.get('/loto', (req, res) => {
    res.sendFile(path.join(__dirname, 'loto.html'));
});

// Пример API-запроса — можно использовать для получения данных из базы
app.get('/api/products', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM products'); // предполагается, что у тебя есть таблица "products"
        const products = stmt.all();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при получении данных из базы.' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
