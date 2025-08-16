document.addEventListener("DOMContentLoaded", () => {
  const productListContainer = document.getElementById("product-list");
  const maxProductsPerLoad = 3;
  let nextProductIndex = 0;
  let allProducts = [];

  async function init() {
    try {
      const response = await fetch("./db.json");
      const data = await response.json();
      allProducts = data.products;

      if (!allProducts || allProducts.length === 0) {
        productListContainer.innerHTML = "<p>No products found.</p>";
        return;
      }

      loadMoreProducts();

      setupIntersectionObserver();
    } catch (error) {
      console.error("Error fetching or processing product data:", error);
    }
  }

  // ===  CORE LAZY LOADING LOGIC ===

  function loadMoreProducts() {
    const endIndex = nextProductIndex + maxProductsPerLoad;

    const productsToDisplay = allProducts.slice(nextProductIndex, endIndex);

    displayProducts(productsToDisplay);

    nextProductIndex = endIndex;
  }

  function displayProducts(productsToDisplay) {
    productsToDisplay.forEach((product) => {
      const productCardDiv = document.createElement("div");
      productCardDiv.classList.add("product-card");

      const productImg = document.createElement("img");
      productImg.classList.add("product-image");
      productImg.src = product.thumbnail;
      productImg.alt = product.title;
      productCardDiv.appendChild(productImg);

      const productInfoDiv = document.createElement("div");
      productInfoDiv.classList.add("product-info");

      const productTitle = document.createElement("h3");
      productTitle.classList.add("product-title");
      productTitle.innerHTML = product.title;
      productInfoDiv.appendChild(productTitle);

      const productDescription = document.createElement("p");
      productDescription.classList.add("product-description");
      productDescription.innerHTML = product.description;
      productInfoDiv.appendChild(productDescription);

      const productPrice = document.createElement("div");
      productPrice.classList.add("product-price");
      productPrice.innerHTML = `$${product.price.toFixed(2)}`;
      productInfoDiv.appendChild(productPrice);

      const productActions = document.createElement("div");
      productActions.classList.add("product-actions");

      const addToCartBtn = document.createElement("button");
      addToCartBtn.classList.add("add-to-cart-btn");
      addToCartBtn.innerHTML = "Add to Cart";
      addToCartBtn.setAttribute("data-product-id", product.id);
      productActions.appendChild(addToCartBtn);

      const addToWishListBtn = document.createElement("button");
      addToWishListBtn.classList.add("add-to-wishlist-btn");
      addToWishListBtn.innerHTML = "❤️";
      productActions.appendChild(addToWishListBtn);

      productInfoDiv.appendChild(productActions);
      productCardDiv.appendChild(productInfoDiv);

      productListContainer.appendChild(productCardDiv);
    });
  }

  // === INTERSECTION OBSERVER LOGIC (lazy loading) ===

  function setupIntersectionObserver() {
    const lastProductCard = productListContainer.lastElementChild;

    if (lastProductCard) {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              observer.unobserve(entry.target);

              // Only load more if there are still products left to load
              if (nextProductIndex < allProducts.length) {
                loadMoreProducts();
              }

              // Set up the observer for the new last element, if one exists
              if (nextProductIndex < allProducts.length) {
                setTimeout(() => {
                  setupIntersectionObserver();
                }, 200);
              }
            }
          });
        },
        {
          rootMargin: "0px 0px 200px 0px",
        }
      );

      observer.observe(lastProductCard);
    }
  }

  init();

  // === SHOPPING CART SIDEBAR LOGIC ===
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
});
