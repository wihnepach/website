import React, { useState } from 'react';
import TopBar from './components/TopBar';

const App = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
      <TopBar onLoginClick={toggleForm} />

      <div className="form-container" id="form-container">
        {showLogin ? (
          <form id="login-form">
            <h2>Войти</h2>

            <label htmlFor="login-email">Email:</label>
            <div className="input-container">
              <i className="bx bxs-envelope"></i>
              <input type="email" id="login-email" required />
            </div>

            <label htmlFor="login-password">Пароль:</label>
            <div className="input-container">
              <i className="bx bxs-lock-alt"></i>
              <input type="password" id="login-password" required />
            </div>

            <button type="submit">Войти</button>
            <button type="button" onClick={() => setShowLogin(false)}>Зарегистрироваться</button>
          </form>
        ) : (
          <form id="registration-form">
            <h2>Регистрация</h2>

            <label htmlFor="name">Имя:</label>
            <div className="input-container">
              <i className="bx bx-user-circle"></i>
              <input type="text" id="name" required />
            </div>

            <label htmlFor="reg-email">Email:</label>
            <div className="input-container">
              <i className="bx bxs-envelope"></i>
              <input type="email" id="reg-email" required />
            </div>

            <label htmlFor="reg-password">Пароль:</label>
            <div className="input-container">
              <i className="bx bxs-lock-alt"></i>
              <input type="password" id="reg-password" required />
            </div>

            <label htmlFor="confirm-password">Подтвердите пароль:</label>
            <div className="input-container">
              <i className="bx bxs-lock-alt"></i>
              <input type="password" id="confirm-password" required />
            </div>

            <button type="submit">Зарегистрироваться</button>
            <button type="button" onClick={() => setShowLogin(true)}>Назад</button>
          </form>
        )}
      </div>

      <div className="catalog">
        <a href="/man" className="man-button">Мужчинам</a>
        <a href="/woman" className="woman-button">Женщинам</a>
        <a href="/kids" className="kids-button">Детям</a>
        <a href="/sport" className="sport-button">Виды спорта</a>
        <a href="/loto" className="loto-button">Лото</a>
      </div>

      <p className="advertisement-text">
        Данная акция действует до 30.05.2025.
        <span className="new-line">Успей привести своего друга и получить приз!</span>
      </p>

      <div className="reclama">
        <img src="img/rec.jpg" alt="реклама моего товара" className="img-left" />

        <div className="text-column">
          <p>Спорт — это одна из важнейших составляющих культуры и общества, тесно связанная с физической активностью.</p>
          <p>Существует множество видов спорта, которые можно разделить на несколько категорий:</p>
          <p>1. Командные виды спорта: футбол, баскетбол, волейбол и хоккей.</p>
          <p>2. Индивидуальные виды спорта: легкая атлетика, плавание, теннис.</p>
          <p>3. Экстремальные виды спорта: скейтбординг, серфинг, альпинизм.</p>
          <p>4. Силовые виды спорта: тяжёлая атлетика, бодибилдинг.</p>
          <p>Спорт оказывает множество положительных эффектов на здоровье и психоэмоциональное состояние человека:</p>
          <ul>
            <li>Физическое здоровье: регулярные занятия спортом способствуют.</li>
            <li>Психологическое здоровье: физическая активность помогает.</li>
            <li>Социальные связи: спорт способствует установлению.</li>
          </ul>
          <p>Спорт — это не только конкуренция, но и важный аспект личного роста.</p>
        </div>
      </div>

      <div id="overlay"></div>
    </>
  );
};

export default App;
