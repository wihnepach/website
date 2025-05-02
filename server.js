const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); 

const app = express();
const PORT = 5501;

// Обслуживание всех статических файлов из текущей директории
app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database('base_arsen_markarian.db'); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // Отдаем main.html из текущей директории
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

app.get('/brand', (req, res) => {
    res.sendFile(path.join(__dirname, 'brand.html'));  
});

// Логирование на успешный запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log('Сервер работает!');
});
