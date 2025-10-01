let cartArr = [];

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
});

function saveCart() {
  localStorage.setItem("shoppingCart", JSON.stringify(cartArr));
}

function loadCart() {
  const savedCart = localStorage.getItem("shoppingCart");
  if (savedCart) {
    cartArr = JSON.parse(savedCart);
    renderCart();
  }
}

function addItemToCart(product) {
  const existingProductIndex = cartArr.findIndex(
    (item) => item.id === product.id
  );
  const totalDiscountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  if (existingProductIndex > -1) {
    cartArr[existingProductIndex].quantity++;
  } else {
    cartArr.push({
      ...product,
      price: totalDiscountedPrice,
      quantity: 1,
    });
  }
  saveCart();
  renderCart();
}

function updateQuantity(productId, newQuantity) {
  const productIndex = cartArr.findIndex((item) => item.id === productId);
  if (productIndex > -1) {
    if (newQuantity > 0) {
      cartArr[productIndex].quantity = newQuantity;
    } else {
      cartArr.splice(productIndex, 1);
    }
    saveCart();
    renderCart();
  }
}

function removeItem(productId) {
  const productIndex = cartArr.findIndex((item) => item.id === productId);
  if (productIndex > -1) {
    cartArr.splice(productIndex, 1);
    saveCart();
    renderCart();
  }
}

function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  cartItemsContainer.innerHTML = "";
  let total = 0;
  let count = 0;

  cartArr.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    count += item.quantity;

    cartItemsContainer.innerHTML += `
      <div class="cart-item" id="${item.id}">
        <img src="${item.thumbnail}" alt="${
      item.title
    }" class="cart-item-image">
        <div class="cart-item-details">
          <p class="cart-item-title">${item.title}</p>
          <p class="cart-item-price-discounted">$${item.price.toFixed(2)}</p>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease-quantity-btn" onclick="updateQuantity(${
              item.id
            }, ${item.quantity - 1})">-</button>
            <span class="quantity" id="quantity${item.id}">${
      item.quantity
    }</span>
            <button class="quantity-btn increase-quantity-btn" onclick="updateQuantity(${
              item.id
            }, ${item.quantity + 1})">+</button>
          </div>
        </div>
        <button class="remove-item-btn" onclick="removeItem(${
          item.id
        })">X</button>
      </div>
    `;
  });

  cartTotal.innerHTML = `$${total.toFixed(2)}`;
  cartCount.innerHTML = count;
}

const cartIcon = document.querySelector(".cart-icon");
const cartSidebar = document.getElementById("shopping-cart");
const closeCartBtn = document.querySelector(".close-cart-btn");

cartIcon.addEventListener("click", (e) => {
  e.preventDefault();
  toggleCart(true);
});

closeCartBtn.addEventListener("click", () => {
  toggleCart(false);
});

function toggleCart(show) {
  if (show) {
    cartSidebar.classList.add("active");
  } else {
    cartSidebar.classList.remove("active");
  }
}
