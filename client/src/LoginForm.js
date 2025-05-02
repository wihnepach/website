import React, { useState } from 'react';

function LoginForm({ showRegistrationForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("loggedInUser", email);
      alert("Вы успешно вошли!");
    } else {
      alert("Неверный email или пароль!");
    }
  };

  return (
    <form id="login-form" onSubmit={handleSubmit}>
      <h2>Войти</h2>
      <label htmlFor="login-email">Email:</label>
      <div className="input-container">
        <i className="bx bxs-envelope"></i>
        <input type="email" id="login-email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>

      <label htmlFor="login-password">Пароль:</label>
      <div className="input-container">
        <i className="bx bxs-lock-alt"></i>
        <input type="password" id="login-password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>

      <button type="submit">Войти</button>
      <button type="button" onClick={showRegistrationForm}>Зарегистрироваться</button>
    </form>
  );
}

export default LoginForm;
