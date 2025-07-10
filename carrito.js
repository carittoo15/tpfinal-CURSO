// carrito.js

// Variables globales
let cart = [];
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const emptyCartButton = document.getElementById('empty-cart');
const finalizePurchaseButton = document.getElementById('finalize-purchase');

// Inicialización del carrito
function initCart() {
    loadCart();
    renderCart();
    setupEventListeners();
}

// Cargar carrito desde localStorage
function loadCart() {
    const savedCart = localStorage.getItem('petlit-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('petlit-cart', JSON.stringify(cart));
}

// Renderizar el carrito
function renderCart() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center;">Tu carrito está vacío 🐾</p>';
        cartTotalElement.textContent = '$0';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>$${item.price} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button class="cart-btn decrease" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="cart-btn increase" data-id="${item.id}">+</button>
                <button class="cart-btn remove" data-id="${item.id}">×</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

function setupEventListeners() {
    // Vaciar carrito
    emptyCartButton.addEventListener('click', () => {
        if (confirm("¿Estás seguro que querés vaciar el carrito?")) {
            cart = [];
            saveCart();
            renderCart();
        }
    });

    // Finalizar compra
    finalizePurchaseButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        alert('¡Gracias por tu compra!');
        cart = [];
        saveCart();
        renderCart();
        window.location.href = 'index.html';
    });

    //para los controles del carrito
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (!target.classList.contains('cart-btn')) return;
        
        const id = parseInt(target.getAttribute('data-id'));
        const item = cart.find(item => item.id === id);
        
        if (target.classList.contains('increase')) {
            item.quantity++;
        } else if (target.classList.contains('decrease')) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(item => item.id !== id);
            }
        } else if (target.classList.contains('remove')) {
            cart = cart.filter(item => item.id !== id);
        }
        
        saveCart();
        renderCart();
    });
}

// para agregar un producto al carrito 
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1
        });
    }
    
    saveCart();
    renderCart();
    alert(`${product.title} ha sido añadido al carrito`);
}

// inciico el carrito cuando el DOM este listo
document.addEventListener('DOMContentLoaded', initCart);

export { addToCart, cart };