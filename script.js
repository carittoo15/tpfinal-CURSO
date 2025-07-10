//variables globales
let cart = [];
const productsContainer = document.getElementById('products-container');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');
const cartIcon = document.querySelector('.cart-icon');
const API_URL = 'https://dummyjson.com/products';
let apiProducts = [];

//datos locales para fallback
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
  },
  {
    id: 3,
    title: "Hueso de Goma Duradero",
    price: 9800,
    image: "https://m.media-amazon.com/images/I/51Z2YFF35KS._UF1000,1000_QL80_.jpgs/hueso-juguete.jpg",
    category: "juguetes",
    description: "Juguete dental de goma resistente."
  },
  {
    id: 4,
    title: "Arnés Ajustable con Correa",
    price: 23000,
    image: "https://http2.mlstatic.com/D_NQ_NP_777740-MLA84032418367_042025-O.webp",
    category: "accesorios",
    description: "Arnés ergonómico con correa incluida."
  },
  {
    id: 5,
    title: "Cama Ortopédica para Perros",
    price: 86000,
    image: "https://m.media-amazon.com/images/I/71uui9jFmkL._AC_SL1500_.jpg",
    category: "camas",
    description: "Cama con memory foam, lavable y antideslizante."
  },
  {
    id: 6,
    title: "Comedero Elevado Anti-voracidad",
    price: 15000,
    image: "https://www.tiendanimal.es/dw/image/v2/BDLQ_PRD/on/demandware.static/-/Sites-kiwoko-master-catalog/default/dw6af58868/images/Marketplace/Comedero_Antisalpicaduras_para_perros_MRK000224254.png?sw=780&sh=780&sm=fit&q=85",
    category: "accesorios",
    description: "Comedero elevado para mejorar la postura al comer."
  },
  {
    id: 7,
    title: "Cepillo Masajeador",
    price: 12000,
    image: "https://http2.mlstatic.com/D_NQ_NP_862096-MLA76694819480_062024-O.webp",
    category: "higiene",
    description: "Cepillo para masaje y remoción de pelo suelto."
  },
  {
    id: 8,
    title: "Correa Retráctil 5m",
    price: 25000,
    image: "https://http2.mlstatic.com/D_NQ_NP_977529-MLA78337746242_082024-O.webp",
    category: "accesorios",
    description: "Correa retráctil con bloqueo de seguridad."
  }
];

// Fetch desde la API externa 
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    apiProducts = data.products.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.thumbnail,
      category: product.category.replace('-', ' '),
      description: product.description
    }));
    return apiProducts;
  } catch (error) {
    console.error("Error al cargar productos de la API:", error);
    return petProducts;
  }
}

//muestra productos en la pag principal
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

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
  });
}

// Mostrar productos destacados en el carrusel (Swiper)
function displayFeaturedProducts(products) {
  const swiperContainer = document.getElementById('swiper-products');
  if (!swiperContainer) return;

  const trending = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5);

  swiperContainer.innerHTML = '';
  trending.forEach(product => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-info">
          <h3>${product.title}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <button class="add-to-cart" data-id="${product.id}">Añadir al carrito</button>
        </div>
      </div>
    `;
    swiperContainer.appendChild(slide);
  });

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
  });

  new Swiper(".mySwiper", {
    loop: true,
    spaceBetween: 20,
    slidesPerView: 1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    breakpoints: {
      640: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 }
    }
  });
}

function setupCategoryFilters() {
  document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function () {
      document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const category = this.getAttribute('data-category');
      const baseProducts = apiProducts.length > 0 ? apiProducts : petProducts;
      const filtered = category === 'all' ? baseProducts : baseProducts.filter(p => p.category === category);
      displayProducts(filtered);
    });
  });
}

//para actualizar el contador del carrito
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = count;
}

//para añadir productos al carrito!
function addToCart(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const product = petProducts.find(p => p.id === id) || apiProducts.find(p => p.id === id);
    if (!product) return;

    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ 
            id: product.id, 
            title: product.title, 
            price: product.price, 
            image: product.image, 
            quantity: 1 
        });
    }

    localStorage.setItem('petlit-cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.title} ha sido añadido al carrito`);
}

//valido contacto
function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      alert('Por favor completa todos los campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    })
      .then(response => {
        if (response.ok) {
          alert('Mensaje enviado con éxito');
          contactForm.reset();
        } else {
          throw new Error('Error al enviar');
        }
      })
      .catch(error => {
        alert('Error al enviar. Intentalo más tarde.');
        console.error(error);
      });
  });
}

function init() {
  //cargo carrito desde localStorage
  const saved = localStorage.getItem('petlit-cart');
  if (saved) {
    cart = JSON.parse(saved);
    updateCartCount();
  }

  displayProducts(petProducts);
  displayFeaturedProducts(petProducts.slice(0, 5));
  setupCategoryFilters();
  setupContactForm();

  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      window.location.href = 'carrito.html';
    });
    checkoutButton?.addEventListener('click', () => {
      window.location.href = 'carrito.html';
    });
  }
}
document.addEventListener('DOMContentLoaded', init);
