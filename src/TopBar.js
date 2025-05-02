import React from 'react';

function TopBar({ toggleForm }) {
  return (
    <div className="top-bar">
      <div className="welcome-text">
        <i className="bx bx-accessibility"></i> SportFaster
      </div>
      <button id="login-button" className="login-button" onClick={toggleForm}>
        Войти
      </button>
      <div className="contact-info">
        <p><strong>Почта:</strong> mr8jaki@gmail.com</p>
        <p><strong>Телефон:</strong> +375 (44) 740 21 23</p>
        <p><strong>Адрес:</strong> ул.Московская, 267/2, 414/2</p>
      </div>
    </div>
  );
}

export default TopBar;
