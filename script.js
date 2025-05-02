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
// корзина — массив { name, price }
let cart = [];

// назначаем фильтрацию
function filterItems(category) {
  document.querySelectorAll('.catalog .item').forEach(item => {
    item.style.display = (category === 'all' || item.classList.contains(category)) 
      ? 'block' : 'none';
  });
}

// вешаем обработчики на все кнопки «В корзину»
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.item');
      const name = item.querySelector('h3').textContent;
      // извлекаем число из текста «1200₽»
      const priceText = item.querySelector('.price').textContent;
      const price = parseInt(priceText.replace(/\D/g, ''), 10);
      addToCart(name, price);
    });
  });
  updateCartUI();
});

function addToCart(name, price) {
  cart.push({ name, price });
  updateCartUI();
}

function updateCartUI() {
  const cartList  = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  cartList.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} — ${item.price}₽`;
    cartList.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = total;
}

function checkout() {
  if (cart.length === 0) {
    alert('Корзина пуста');
    return;
  }
  alert('Заказ оформлен! Спасибо за покупку.');
  cart = [];
  updateCartUI();
}

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
  }

  function filterItems(category) {
    const items = document.querySelectorAll('#catalog .item');
    items.forEach(item => {
      item.style.display = (category === 'all' || item.classList.contains(category)) 
        ? 'block' 
        : 'none';
    });
  }
  const detailsBtns = document.querySelectorAll('.details-btn');

detailsBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const description = this.nextElementSibling;
    if (description.style.display === 'none' || description.style.display === '') {
      description.style.display = 'block';
    } else {
      description.style.display = 'none';
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const lotoButton = document.getElementById("loto-button");
  
    if (lotoButton) {
      lotoButton.addEventListener("click", async () => {
        try {
          const res = await fetch('/api/products');
          const products = await res.json();
          if (!products || products.length === 0) {
            alert("Нет доступных товаров.");
            return;
          }
  
          const randomProduct = products[Math.floor(Math.random() * products.length)];
          addToCart(randomProduct.name, parseInt(randomProduct.price));
  
          const itemDiv = document.getElementById("random-item");
          if (itemDiv) {
            itemDiv.innerHTML = `
              <img src="${randomProduct.image}" alt="${randomProduct.name}">
              <h3>${randomProduct.name}</h3>
              <p>${randomProduct.price}₽</p>
              <p>${randomProduct.description}</p>
            `;
            itemDiv.classList.remove("hidden");
          }
        } catch (err) {
          alert("Ошибка при получении товара.");
          console.error(err);
        }
      });
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const lotoButton = document.getElementById("loto-button");
  
    const products = [
      {
        name: "Футболка Nike",
        price: 1999,
        image: "https://via.placeholder.com/120",
        description: "Классическая хлопковая футболка."
      },
      {
        name: "Кроссовки Adidas",
        price: 5999,
        image: "https://via.placeholder.com/120",
        description: "Лёгкие и удобные кроссовки."
      },
      {
        name: "Кепка Puma",
        price: 1299,
        image: "https://via.placeholder.com/120",
        description: "Спортивная кепка для жаркой погоды."
      }
    ];
  
    if (lotoButton) {
      lotoButton.addEventListener("click", () => {
        if (products.length === 0) {
          alert("Нет доступных товаров!");
          return;
        }
  
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        addToCart(randomProduct.name, randomProduct.price);
  
        const itemDiv = document.getElementById("random-item");
        if (itemDiv) {
          itemDiv.innerHTML = `
            <img src="${randomProduct.image}" alt="${randomProduct.name}" style="max-width: 120px; border-radius: 8px;">
            <h3>${randomProduct.name}</h3>
            <p><strong>${randomProduct.price}₽</strong></p>
            <p>${randomProduct.description}</p>
          `;
          itemDiv.classList.remove("hidden");
        }
  
        alert(`Вы получили: ${randomProduct.name}! Он добавлен в корзину.`);
      });
    }
  });
  
  

