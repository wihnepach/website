import React, { useState } from 'react';

function RegistrationForm({ showLoginForm }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.email === email)) {
      alert("Этот email уже зарегистрирован!");
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", email);
    alert("Регистрация успешна! Вы вошли в аккаунт.");
  };

  return (
    <form id="registration-form" onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
      <label htmlFor="name">Имя:</label>
      <div className="input-container">
        <i className="bx bx-user-circle"></i>
        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required />
      </div>

      <label htmlFor="reg-email">Email:</label>
      <div className="input-container">
        <i className="bx bxs-envelope"></i>
        <input type="email" id="reg-email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>

      <label htmlFor="reg-password">Пароль:</label>
      <div className="input-container">
        <i className="bx bxs-lock-alt"></i>
        <input type="password" id="reg-password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>

      <label htmlFor="confirm-password">Подтвердите пароль:</label>
      <div className="input-container">
        <i className="bx bxs-lock-alt"></i>
        <input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
      </div>

      <button type="submit">Зарегистрироваться</button>
      <button type="button" onClick={showLoginForm}>Назад</button>
    </form>
  );
}

export default RegistrationForm;
