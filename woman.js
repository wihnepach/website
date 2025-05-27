document.addEventListener("DOMContentLoaded", async function () {
    console.log("Скрипт загружен!");

    const modal = document.getElementById('productModal');
    const descriptionElement = document.getElementById('productDescription');
    const productGrid = document.querySelector('.product-grid');

    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
//Если пользователь кликнет вне содержимого модального окна (на затемнённый фон — сам modal), тоже закрываем окно.
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

//Отправляем запрос на сервер, чтобы получить список продуктов.
//Ждём ответа и выводим HTTP статус ответа
    try {
        const response = await fetch('/api/created_products');
        console.log("Статус ответа:", response.status);

        const data = await response.json();
        console.log("Полученные данные:", data);

        if (!Array.isArray(data)) {
            throw new Error("Ошибка: данные не являются массивом!");
        }

        //Логируем полученные данные
        console.log("Контейнер найден:", productGrid);

        // Фильтрация по main_tag === "Женщинам"
        const filteredProducts = data.filter(product => product.main_tag === "Женщинам");

        //Для каждого отфильтрованного товара создаём карточку.
        filteredProducts.forEach(product => {
            //Создаём контейнер карточки товара и даём ему класс для стилей.
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            const productImage = document.createElement('img');
            productImage.src = `/img/${product.image}`;
            productImage.alt = product.name;
            productImage.classList.add('product-image');
            productCard.appendChild(productImage);

            const productName = document.createElement('div');
            productName.classList.add('product-name');
            productName.textContent = product.name;
            productCard.appendChild(productName);

            const productPrice = document.createElement('div');
            productPrice.classList.add('product-price');
            productPrice.textContent = `₽${product.price}`;
            productCard.appendChild(productPrice);

            const productInfo = document.createElement('button');
            productInfo.classList.add('info-btn');
            productInfo.textContent = 'Подробнее';
            productInfo.addEventListener('click', () => {
                descriptionElement.textContent = product.description;
                modal.style.display = 'flex';
            });
            productCard.appendChild(productInfo);

            const productBuy = document.createElement('button');
            productBuy.classList.add('buy-btn');
            productBuy.textContent = 'Купить';
            productBuy.addEventListener('click', () => {
                addToCart(product.name, product.price);
            });
            productCard.appendChild(productBuy);
//Добавляем готовую карточку товара в контейнер на странице.
            productGrid.appendChild(productCard);
        });

    } catch (error) {
        console.error("Ошибка загрузки:", error);
    }
});

async function filterItems(tag) {
    const modal = document.getElementById('productModal');
    const descriptionElement = document.getElementById('productDescription');
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';

    try {
        const response = await fetch('/api/created_products');
        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Ошибка: данные не являются массивом!");
        }

        const filteredProducts = data.filter(product =>
            product.main_tag === "Женщинам" &&
            product.secondary_tag &&
            product.secondary_tag.toLowerCase().includes(tag.toLowerCase())
        );

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            const productImage = document.createElement('img');
            productImage.src = `/img/${product.image}`;
            productImage.alt = product.name;
            productImage.classList.add('product-image');
            productCard.appendChild(productImage);

            const productName = document.createElement('div');
            productName.classList.add('product-name');
            productName.textContent = product.name;
            productCard.appendChild(productName);

            const productPrice = document.createElement('div');
            productPrice.classList.add('product-price');
            productPrice.textContent = `₽${product.price}`;
            productCard.appendChild(productPrice);

            const productInfo = document.createElement('button');
            productInfo.classList.add('info-btn');
            productInfo.textContent = 'Подробнее';
            productInfo.addEventListener('click', () => {
                descriptionElement.textContent = product.description;
                modal.style.display = 'flex';
            });
            productCard.appendChild(productInfo);

            const productBuy = document.createElement('button');
            productBuy.classList.add('buy-btn');
            productBuy.textContent = 'Купить';
            productBuy.addEventListener('click', () => {
                addToCart(product.name, product.price);
            });
            productCard.appendChild(productBuy);

            productGrid.appendChild(productCard);
        });

    } catch (error) {
        console.error("Ошибка загрузки:", error);
    }
}


