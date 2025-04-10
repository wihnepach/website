const express = require('express');
const path = require('path');

const app = express();
const PORT = 5500;

// Обслуживание всех статических файлов из текущей директории
app.use(express.static(path.join(__dirname)));

// Логирование на успешный запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log('Сервер работает!');
});
