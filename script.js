// Variables globales
let cart = [];
const productsContainer = document.getElementById('products-container');
const cartCount = document.getElementById('cart-count');
const API_URL = 'https://dummyjson.com/products';
let apiProducts = [];

// Datos locales para fallback
const petProducts = [
  {
    id: 1,
    title: "Chaleco Impermeable para Perro",
    price: 60000,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxIVlatSZPWljLKKYaQkbY0sQHfzn-Jzz2SQ&s",
    category: "ropa",
    description: "Impermeable resistente al agua con capucha."
  },
  {
    id: 2,
    title: "Collar Reflectante con Chapita",
    price: 19500,
    image: "https://http2.mlstatic.com/D_Q_NP_763620-MLA82998249615_032025-O.webprro.jpg",
    category: "collares",
    description: "Collar ajustable con material reflectante."
  }
];

// Función para mostrar productos
function displayProducts(products) {
  productsContainer.innerHTML = '';
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}">
        <span class="product-badge" data-category="${product.category}">${product.category.toUpperCase()}</span>
      </div>
      <div class="product-info">
        <h3>${product.title}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <p>${product.description}</p>
        <button class="add-to-cart" data-id="${product.id}">Añadir al carrito</button>
      </div>
    `;
    productsContainer.appendChild(productCard);
  });
}
