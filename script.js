document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const registrationForm = document.getElementById("registration-form");
    const formContainer = document.getElementById("form-container");
    const loginButton = document.getElementById("login-button");

    // Функция обновления кнопки входа/профиля
    function updateLoginButton() {
        const loggedInUser = localStorage.getItem("loggedInUser");
    
        if (loggedInUser && loggedInUser.trim() !== "") {
            loginButton.textContent = "выйти";
            loginButton.onclick = function () {
                localStorage.removeItem("loggedInUser");
                loginButton.textContent = "войти";
                loginButton.onclick = toggleForm; // вернём исходное поведение
                alert("Вы вышли из аккаунта.");
            };
        } else {
            loginButton.textContent = "войти";
            loginButton.onclick = toggleForm;
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
            document.getElementById("overlay").style.display = "none";
        } else {
            formContainer.style.display = "block";
            document.getElementById("overlay").style.display = "block";
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

        let users = JSON.parse(localStorage.getItem("users")) || [];
        
        // Проверяем, зарегистрирован ли пользователь
        if (users.some(user => user.email === email)) {
            alert("Этот email уже зарегистрирован!");
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem("users", JSON.stringify(users));

        // Сразу авторизуем пользователя после регистрации
        localStorage.setItem("loggedInUser", email);

        alert("Регистрация успешна! Вы вошли в аккаунт.");
        
        updateLoginButton(); // Обновляем текст кнопки
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

        updateLoginButton(); // Меняем кнопку на "Профиль"
        toggleForm();
    });

    // Проверяем пользователя при загрузке страницы
    updateLoginButton();
});
