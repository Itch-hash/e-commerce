document.addEventListener("DOMContentLoaded", () => {
  const productListContainer = document.getElementById("product-list");
  const categoryFilter = document.getElementById("category-filter");

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

  categoryFilter.onchange = async function init() {
    try {
      const response = await fetch("./db.json");
      const data = await response.json();
      const toFilterData = data.products;
      const filteredData = toFilterData.filter((element) => {
        if (element.category === categoryFilter.value) {
          return true;
        } else if (categoryFilter.value === "all-categories") {
          return true;
        }
      });

      allProducts = filteredData;

      if (!allProducts || allProducts.length === 0) {
        productListContainer.innerHTML = "<p>No products found.</p>";
        return;
      }
      productListContainer.innerHTML = "";
      nextProductIndex = 0;
      loadMoreProducts();

      setupIntersectionObserver();
    } catch (error) {
      console.error("Error fetching or processing product data:", error);
    }
  };

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

      const productInfoDiv = document.createElement("a");
      productInfoDiv.href = `product-card.html?id=${product.id}`;
      productInfoDiv.style.textDecoration = "none";
      productInfoDiv.classList.add("product-info");

      const productTitle = document.createElement("h3");
      productTitle.classList.add("product-title");
      productTitle.innerHTML = product.title;
      productTitle.id = product.category;
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
      addToCartBtn.onclick = () => addItemToCart(product);

      productActions.appendChild(addToCartBtn);

      const addToWishListBtn = document.createElement("button");
      addToWishListBtn.classList.add("add-to-wishlist-btn");
      addToWishListBtn.innerHTML = "❤️";
      productActions.appendChild(addToWishListBtn);

      productCardDiv.appendChild(productInfoDiv);
      productCardDiv.appendChild(productActions);

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
});
