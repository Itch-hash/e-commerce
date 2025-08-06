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

  //Handling Products

  fetch("./db.json")
    .then((reponse) => {
      return reponse.json();
    })
    .then((data) => {
      const products = data.products;
      const productList = document.getElementById("product-list");
      products.forEach((product) => {
        const productCardDiv = document.createElement("div");
        const productImg = document.createElement("img");
        const productInfoDiv = document.createElement("div");
        const productTitle = document.createElement("h3");
        const productDescription = document.createElement("p");
        const productPrice = document.createElement("div");
        const productActions = document.createElement("div");
        const addToCartBtn = document.createElement("button");
        const addToWishListBtn = document.createElement("button");

        productCardDiv.classList.add("product-card");
        productList.appendChild(productCardDiv);
        productImg.classList.add("product-image");
        productImg.src = product.thumbnail;
        productImg.alt = product.title;
        productCardDiv.appendChild(productImg);
        productCardDiv.appendChild(productInfoDiv);
        productInfoDiv.classList.add("product-info");
        productInfoDiv.appendChild(productTitle);
        productTitle.innerHTML = product.title;
        productTitle.classList.add("product-title");
        productInfoDiv.appendChild(productDescription);
        productDescription.innerHTML = product.description;
        productDescription.classList.add("product-description");
        productInfoDiv.appendChild(productPrice);
        productPrice.innerHTML = `$${product.price.toFixed(2)}`;
        productPrice.classList.add("product-price");
        productInfoDiv.appendChild(productActions);
        productActions.classList.add("product-actions");
        productActions.appendChild(addToCartBtn);
        addToCartBtn.classList.add("add-to-cart-btn");
        addToCartBtn.innerHTML = "Add to Cart";
        productActions.appendChild(addToWishListBtn);
        addToWishListBtn.classList.add("add-to-wishlist-btn");
        addToWishListBtn.innerHTML = "❤️";
      });
    });
});
