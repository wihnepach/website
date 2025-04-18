const express = require('express');
const path = require('path');

const app = express();
const PORT = 5500;

// Обслуживание всех статических файлов из текущей директории
app.use(express.static(path.join(__dirname)));

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
