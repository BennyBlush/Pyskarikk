let cart = [];

function addToCart(event, name, price) {
    // 1. Добавляем в массив корзины
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    // 2. Запускаем эффект летящих точек
    createParticles(event.clientX, event.clientY);
    
    // 3. Обновляем интерфейс
    setTimeout(() => {
        updateCartUI();
    }, 600); // Обновим цифру, когда точки "долетят"
}

function createParticles(x, y) {
    const cartIcon = document.querySelector('.cart-icon');
    const rect = cartIcon.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        document.body.appendChild(particle);

        // Начальная позиция (где кликнули)
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';

        // Анимация полета через Web Animations API
        particle.animate([
            { 
                transform: `translate(0, 0) scale(1)`, 
                opacity: 1 
            },
            { 
                transform: `translate(${(targetX - x)}px, ${(targetY - y)}px) scale(0)`, 
                opacity: 0.5 
            }
        ], {
            duration: 600 + (Math.random() * 200), // Случайная задержка для красоты
            easing: 'ease-in-out',
            fill: 'forwards'
        });

        // Удаляем элемент после завершения
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;
    
    const cartItemsDiv = document.getElementById('cart-items');
    const totalDiv = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Корзина пуста</p>';
        totalDiv.innerText = '';
        return;
    }
    
    cartItemsDiv.innerHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; margin:10px 0; border-bottom:1px solid #333;">
            <span>${item.name} x${item.quantity}</span>
            <span>${item.price * item.quantity} ₽</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalDiv.innerHTML = `<h3 style="margin-top:15px; color:#ff9f43;">Итого: ${total} ₽</h3>`;
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}

function sendToTelegram() {
    if (cart.length === 0) return;
    const username = "benny_nft"; 
    let message = "Здравствуйте! Хочу сделать заказ на ";
    const itemsText = cart.map(item => `${item.name} (${item.quantity} шт.)`).join(", ");
    message += itemsText + ".";
    window.location.href = `https://t.me/${username}?text=${encodeURIComponent(message)}`;
}
