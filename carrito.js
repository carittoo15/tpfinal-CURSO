// carrito.js
import { cart, loadCart, saveCart, updateCartCount } from './cartModule.js';

// Variables globales específicas de la página del carrito
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const emptyCartButton = document.getElementById('empty-cart');
const finalizePurchaseButton = document.getElementById('finalize-purchase');

// Inicialización del carrito
function initCartPage() {
    loadCart(); // Carga el carrito usando la función del módulo
    renderCart();
    setupEventListeners();
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
                <p>$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button class="cart-btn decrease" data-id="${item.id}" aria-label="Disminuir cantidad de ${item.title}">-</button>
                <span>${item.quantity}</span>
                <button class="cart-btn increase" data-id="${item.id}" aria-label="Aumentar cantidad de ${item.title}">+</button>
                <button class="cart-btn remove" data-id="${item.id}" aria-label="Eliminar ${item.title} del carrito">×</button>
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
            cart.length = 0; // Vacía el array del carrito
            saveCart(); // Guarda el carrito vacío
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
        cart.length = 0; // Vacía el array del carrito
        saveCart(); // Guarda el carrito vacío
        renderCart();
        window.location.href = 'index.html';
    });

    // para los controles del carrito (aumentar, disminuir, eliminar)
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
                // Si la cantidad es 1 y se disminuye, o si se hace clic en "remove"
                // Filtra el item para eliminarlo del carrito
                cart = cart.filter(item => item.id !== id);
            }
        } else if (target.classList.contains('remove')) {
            cart = cart.filter(item => item.id !== id);
        }
        
        saveCart();
        renderCart();
    });
}

// inciico el carrito cuando el DOM este listo
document.addEventListener('DOMContentLoaded', initCartPage);
