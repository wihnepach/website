document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const registrationForm = document.getElementById("registration-form");
    const formContainer = document.getElementById("form-container");
    const loginButton = document.getElementById("login-button");

    // Функция для проверки существующего пользователя
    function isUserRegistered(email) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        return users.some(user => user.email === email);
    }

    // Функция обновления кнопки входа/профиля
    function updateLoginButton() {
        const loggedInUser = localStorage.getItem("loggedInUser");
        if (loggedInUser) {
            loginButton.textContent = "Профиль";
        } else {
            loginButton.textContent = "Регистрация/Войти";
        }
    }

    // Функция переключения форм
    window.showRegistrationForm = function () {
        loginForm.style.display = "none";
        registrationForm.style.display = "block";
    };

    window.showLoginForm = function () {
        registrationForm.style.display = "none";
        loginForm.style.display = "block";
    };

    window.toggleForm = function () {
        if (formContainer.style.display === "block") {
            formContainer.style.display = "none";
        } else {
            formContainer.style.display = "block";
            showLoginForm();
        }
    };

    // Обработка регистрации
    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        }

        // Проверяем, зарегистрирован ли пользователь
        if (isUserRegistered(email)) {
            alert("Этот email уже зарегистрирован!");
            return;
        }

        // Получаем текущий список пользователей
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.push({ name, email, password });

        // Сохраняем обновленный список пользователей
        localStorage.setItem("users", JSON.stringify(users));

        alert("Регистрация успешна! Теперь войдите в аккаунт.");
        toggleForm();
    });

    // Обработка входа
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(user => user.email === email && user.password === password);

        if (!user) {
            alert("Неверный email или пароль!");
            return;
        }

        // Сохраняем данные о входе
        localStorage.setItem("loggedInUser", email);

        alert("Вы успешно вошли!");
        updateLoginButton();
        toggleForm();
    });

    // Проверка при загрузке
    updateLoginButton();
});
