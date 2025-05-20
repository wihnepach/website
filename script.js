document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const registrationForm = document.getElementById("registration-form");
    const formContainer = document.getElementById("form-container");
    const loginButton = document.getElementById("login-button");

    function updateLoginButton() {
        const loggedInUser = localStorage.getItem("loggedInUser");

        if (loggedInUser) {
            loginButton.textContent = "выйти";
            loginButton.onclick = function () {
                localStorage.removeItem("loggedInUser");
                loginButton.textContent = "войти";
                loginButton.onclick = toggleForm;
                alert("Вы вышли из аккаунта.");
            };
        } else {
            loginButton.textContent = "войти";
            loginButton.onclick = toggleForm;
        }
    }

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

    registrationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Пароли не совпадают!");
        return;
    }

    try {
        const res = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        // Явная проверка JSON-ответа
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            throw new Error(text || "Неверный формат ответа сервера");
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ошибка регистрации");

        alert("Регистрация успешна!");
        
        // Сохраняем email и дополнительные данные
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", data.name || name);
        localStorage.setItem("userId", data.id || "");
        localStorage.setItem("loggedInUser", email);

        updateLoginButton();
        toggleForm();
    } catch (err) {
        console.error("Ошибка регистрации:", err);
        alert("Ошибка регистрации: " + (err.message || "Попробуйте позже"));
    }
});

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        // Проверка типа ответа
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            throw new Error(text || "Неверный формат ответа сервера");
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ошибка входа");

        alert("Добро пожаловать, " + (data.name || "пользователь"));
        
        // Сохраняем все полученные данные
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", data.name || "");
        localStorage.setItem("userId", data.id || "");
        localStorage.setItem("loggedInUser", email);
  
        updateLoginButton();
        toggleForm();
    } catch (err) {
        console.error("Ошибка входа:", err);
        alert("Ошибка входа: " + (err.message || "Попробуйте позже"));
    }
});
    updateLoginButton();
});
// корзина — массив { name, price }
let cart = JSON.parse(localStorage.getItem('cart')) || [];



function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart)); // Сохраняем корзину в localStorage
    console.log("Сохранение корзины:", cart); // Проверьте, что данные верные
}

function addToCart(name, price) {
    cart.push({ name, price });
    saveCartToStorage();
    console.log("addToCart");
    updateCartUI();
}

async function findUserIdByEmail(email) {
  try {
    const response = await fetch('http://localhost:3000/api/find-user-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Request failed');
    }

    const data = await response.json();
    return data.userId;
    
  } catch (error) {
    console.error('Error finding user ID:', error);
    return null;
  }
}

function updateCartUI() {
    const cartList = document.getElementById('cart-items');
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
    localStorage.setItem('cart', JSON.stringify(cart));
    
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

                

                const randomIndex = Math.floor(Math.random() * products.length);
                const randomProduct = products[randomIndex];

                if (!randomProduct || !randomProduct.name || !randomProduct.price) {
                    
                    return;
                }

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
        image: "img/opa.jpg",
        description: "Классическая хлопковая футболка."
      },
      {
        name: "Кроссовки Adidas",
        price: 5999,
        image: "img/boti.jpg",
        description: "Лёгкие и удобные кроссовки."
      },
      {
        name: "Кепка Puma",
        price: 1299,
        image: "img/kaska.jpg",
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
  
function go_tomain(){
  window.location.href = '/';
}

  
  

