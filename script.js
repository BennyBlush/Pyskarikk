let cart = [];

function addToCart(name, price) {
    // Ищем, есть ли уже такой товар в корзине
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    updateCartUI();
}

function updateCartUI() {
    // Обновляем счетчик на иконке
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;
    
    // Обновляем список в модальном окне
    const cartItemsDiv = document.getElementById('cart-items');
    const totalDiv = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Корзина пуста</p>';
        totalDiv.innerText = '';
        return;
    }
    
    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} (${item.quantity} шт.)</span>
            <span>${item.price * item.quantity} ₽</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalDiv.innerHTML = `<h3>Итого: ${total} ₽</h3>`;
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}

function sendToTelegram() {
    if (cart.length === 0) {
        alert("Корзина пуста!");
        return;
    }

    const username = "benny_nft"; // Твой ник в ТГ
    let message = "Здравствуйте! Хочу сделать заказ на ";
    
    // Формируем строку заказа
    const itemsText = cart.map(item => `${item.name} (${item.quantity} шт.)`).join(", ");
    message += itemsText + ".";

    // Кодируем сообщение для URL
    const encodedMessage = encodeURIComponent(message);
    const tgLink = `https://t.me/${username}?text=${encodedMessage}`;
    
    // Переходим по ссылке
    window.location.href = tgLink;
}

// Закрытие модалки при клике вне её
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
