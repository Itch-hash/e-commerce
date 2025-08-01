document.addEventListener("DOMContentLoaded", () => {
  // 1. Select the necessary elements
  const cartIcon = document.querySelector(".cart-icon");
  const cartSidebar = document.getElementById("shopping-cart");
  const closeCartBtn = document.querySelector(".close-cart-btn");

  // 2. Add event listeners
  cartIcon.addEventListener("click", (e) => {
    // Prevent the default link behavior
    e.preventDefault();

    // Show the cart sidebar
    toggleCart(true);
  });

  closeCartBtn.addEventListener("click", () => {
    // Hide the cart sidebar
    toggleCart(false);
  });

  // 3. Define the function to toggle the cart's visibility
  function toggleCart(show) {
    if (show) {
      cartSidebar.classList.add("active");
    } else {
      cartSidebar.classList.remove("active");
    }
  }
});
