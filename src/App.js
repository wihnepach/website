import React, { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import TopBar from './TopBar';
import Catalog from './Catalog';
import Reclama from './Reclama';

function App() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);

  const toggleForm = () => setFormVisible(!isFormVisible);
  const showRegistrationForm = () => {
    setIsRegistration(true);
    setFormVisible(true);
  };
  const showLoginForm = () => {
    setIsRegistration(false);
    setFormVisible(true);
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setFormVisible(false); // Скрыть форму, если пользователь вошел
    }
  }, []);

  return (
    <div className="App">
      <TopBar toggleForm={toggleForm} />
      {isFormVisible && (
        isRegistration ? (
          <RegistrationForm showLoginForm={showLoginForm} />
        ) : (
          <LoginForm showRegistrationForm={showRegistrationForm} />
        )
      )}
      <Catalog />
      <Reclama />
    </div>
  );
}

export default App;
