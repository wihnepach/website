let main_tag = null;
let secondary_tag = null;

function add_tag_main(tagText) {
    const container = document.getElementById('selected-tags');

    // Создаем тег
    const tagElement = document.createElement('div');
    tagElement.className = 'tag';
    tagElement.dataset.tag = tagText;
    tagElement.innerHTML = `${tagText} <span class="remove-tag" onclick="remove_tag(this)">×</span>`;

    container.appendChild(tagElement);

    document.getElementById('tag_group_main').style.display = 'none';

    if(tagText === "Мужчинам"){
        document.getElementById('tag_group_man').style.display = 'flex';
        main_tag = "Мужчинам";
    }

    if(tagText === "Женщинам"){
        document.getElementById('tag_group_woman').style.display = 'flex';
        main_tag = "Женщинам";
    }

    if(tagText === "Детям"){
        document.getElementById('tag_group_kid').style.display = 'flex';
        main_tag = "Детям";
    }

    if(tagText === "Виды спорта"){
        document.getElementById('tag_group_sport').style.display = 'flex';
        main_tag = "Виды спорта";
    }

}

function add_tag_man(tagText) {
    const container = document.getElementById('selected-tags');

    // Создаем тег
    const tagElement = document.createElement('div');
    tagElement.className = 'tag';
    tagElement.dataset.tag = tagText;
    tagElement.innerHTML = `${tagText} <span class="remove-tag" onclick="remove_tag(this)">×</span>`;

    container.appendChild(tagElement);

    document.getElementById('tag_group_man').style.display = 'none';
    secondary_tag = tagText;
}

function add_tag_woman(tagText) {
    const container = document.getElementById('selected-tags');

    // Создаем тег
    const tagElement = document.createElement('div');
    tagElement.className = 'tag';
    tagElement.dataset.tag = tagText;
    tagElement.innerHTML = `${tagText} <span class="remove-tag" onclick="remove_tag(this)">×</span>`;

    container.appendChild(tagElement);

    document.getElementById('tag_group_woman').style.display = 'none';
    secondary_tag = tagText;
}

function add_tag_kid(tagText) {
    const container = document.getElementById('selected-tags');

    // Создаем тег
    const tagElement = document.createElement('div');
    tagElement.className = 'tag';
    tagElement.dataset.tag = tagText;
    tagElement.innerHTML = `${tagText} <span class="remove-tag" onclick="remove_tag(this)">×</span>`;

    container.appendChild(tagElement);

    document.getElementById('tag_group_kid').style.display = 'none';
    secondary_tag = tagText;
}

function add_tag_sport(tagText) {
    const container = document.getElementById('selected-tags');

    // Создаем тег
    const tagElement = document.createElement('div');
    tagElement.className = 'tag';
    tagElement.dataset.tag = tagText;
    tagElement.innerHTML = `${tagText} <span class="remove-tag" onclick="remove_tag(this)">×</span>`;

    container.appendChild(tagElement);

    document.getElementById('tag_group_sport').style.display = 'none';
    secondary_tag = tagText;
}

function remove_tag(closeButton) {
    const tag = closeButton.parentElement;
    const tagText = tag.textContent.trim().replace('×', '').trim(); // Удаляем × и пробелы
    tag.remove();
    if(document.getElementById('selected-tags').innerHTML.trim() === ''){
        document.getElementById('tag_group_main').style.display = 'flex';
        document.getElementById('tag_group_man').style.display = 'none';
        document.getElementById('tag_group_woman').style.display = 'none';
        document.getElementById('tag_group_kid').style.display = 'none';
        document.getElementById('tag_group_sport').style.display = 'none';
    }else{
        if(tagText === "Мужчинам" || tagText === "Женщинам" || tagText === "Детям" || tagText === "Виды спорта"){

        }
        if(main_tag === "Мужчинам" && tagText !== "Мужчинам"){
            document.getElementById('tag_group_man').style.display = 'flex';
        }
        if(main_tag === "Женщинам" && tagText !== "Женщинам"){
            document.getElementById('tag_group_woman').style.display = 'flex';
        }
        if(main_tag === "Детям" && tagText !== "Детям"){
            document.getElementById('tag_group_kid').style.display = 'flex';
        }
        if(main_tag === "Виды спорта" && tagText !== "Виды спорта"){
            document.getElementById('tag_group_sport').style.display = 'flex';
        }
    }
    

}

function create_product(event) {
    event.preventDefault();

    // Получаем значения из формы
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = document.getElementById('productPrice').value;
    const image = document.getElementById('productImage').files[0];

    if (!name || !description || !price || !image) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }

    if (!main_tag || !secondary_tag) {
        alert("Пожалуйста, выберите теги!");
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('main_tag', main_tag);
    formData.append('secondary_tag', secondary_tag);

    fetch('/create-product', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            alert("Товар успешно создан!");
            window.location.href = '/';
        } else {
            alert("Ошибка: " + data.error);
        }
    })
    .catch(err => {
        console.error('Ошибка:', err);
        alert("Произошла ошибка при отправке данных.");
    });
}

document.getElementById('createProductForm').addEventListener('submit', create_product);

function go_main(){
  window.location.href = '/';
}
