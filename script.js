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
      addToCartBtn.id = "add-To-Cart";
      //Cart Logic
      addToCartBtn.onclick = () => {
        const itemExists = document.getElementById(product.id) !== null;
        if (!itemExists) {
          const cartItemsContainer = document.getElementById(
            "cart-items-container"
          );
          const totalDiscountedPrice =
            product.price - (product.price * product.discountPercentage) / 100;
          const totalDiscountedPriceToFixed = Number(
            totalDiscountedPrice.toFixed(2)
          );
          const cartItemDiv = document.createElement("div");
          cartItemDiv.className = "cart-item";
          cartItemDiv.id = product.id;
          cartItemsContainer.appendChild(cartItemDiv);

          const cartProductImage = document.createElement("img");
          cartProductImage.src = product.thumbnail;
          cartProductImage.alt = product.title;
          cartProductImage.className = "cart-item-image";
          cartItemDiv.appendChild(cartProductImage);

          const cartItemDetailsDiv = document.createElement("div");
          cartItemDetailsDiv.className = "cart-item-details";
          cartItemDiv.appendChild(cartItemDetailsDiv);

          const cartItemTitle = document.createElement("p");
          cartItemTitle.className = "cart-item-title";
          cartItemTitle.innerHTML = product.title;
          cartItemDetailsDiv.appendChild(cartItemTitle);

          const cartItemPrice = document.createElement("p");
          cartItemPrice.className = "cart-item-price";
          cartItemPrice.innerHTML = "$" + product.price.toFixed(2);
          cartItemDetailsDiv.appendChild(cartItemPrice);

          const cartItemPriceDiscounted = document.createElement("p");
          cartItemPriceDiscounted.innerHTML = "$" + totalDiscountedPriceToFixed;
          cartItemPriceDiscounted.className = "cart-item-price-discounted";
          cartItemPriceDiscounted.id = "cart-item-price-discounted";
          cartItemDetailsDiv.appendChild(cartItemPriceDiscounted);

          const cartItemQuantityDiv = document.createElement("div");
          cartItemQuantityDiv.className = "cart-item-quantity";
          cartItemDetailsDiv.appendChild(cartItemQuantityDiv);

          const decreaseQuantityBtn = document.createElement("button");
          decreaseQuantityBtn.className = "quantity-btn decrease-quantity-btn";
          decreaseQuantityBtn.onclick = () => {
            const productIdToFind = document.getElementById(product.id);
            const quantitySpan = productIdToFind.querySelector(
              "#quantity" + product.id
            );
            let currentNumber = Number(quantitySpan.innerHTML);
            if (currentNumber > 1) {
              currentNumber--;
              calculateTotalDown(totalDiscountedPriceToFixed);
            }

            quantitySpan.innerHTML = currentNumber;
          };
          decreaseQuantityBtn.id = "quantity-btn decrease-quantity-btn";
          decreaseQuantityBtn.innerHTML = "-";
          cartItemQuantityDiv.appendChild(decreaseQuantityBtn);

          const quantitySpan = document.createElement("span");
          quantitySpan.className = "quantity";
          quantitySpan.id = "quantity" + product.id;
          quantitySpan.innerHTML = 1;
          cartItemQuantityDiv.appendChild(quantitySpan);

          const increaseQuantityBtn = document.createElement("button");
          increaseQuantityBtn.className = "quantity-btn increase-quantity-btn";
          increaseQuantityBtn.onclick = () => {
            const productIdToFind = document.getElementById(product.id);
            const quantitySpan = productIdToFind.querySelector(
              "#quantity" + product.id
            );
            let currentNumber = Number(quantitySpan.innerHTML);
            currentNumber++;
            quantitySpan.innerHTML = currentNumber;
            calculateTotalUp(Number(totalDiscountedPriceToFixed));
          };
          increaseQuantityBtn.id = "quantity-btn increase-quantity-btn";
          increaseQuantityBtn.innerHTML = "+";
          cartItemQuantityDiv.appendChild(increaseQuantityBtn);

          const removeItemBtn = document.createElement("button");
          removeItemBtn.className = "remove-item-btn";
          removeItemBtn.id = "remove-item-btn";
          removeItemBtn.innerHTML = "X";
          removeItemBtn.onclick = () =>
            removeItem(
              Number(quantitySpan.innerHTML),
              totalDiscountedPriceToFixed,
              product.id
            );
          cartItemDiv.appendChild(removeItemBtn);

          calculateTotalUp(totalDiscountedPriceToFixed);
        } else {
          const productIdToFind = document.getElementById(product.id);
          const quantitySpan = productIdToFind.querySelector(
            "#quantity" + product.id
          );
          let currentNumber = Number(quantitySpan.innerHTML);
          currentNumber++;
          quantitySpan.innerHTML = currentNumber;
          const productPriceElement = productIdToFind.querySelector(
            "#cart-item-price-discounted"
          ).innerHTML;
          const productPrice = productPriceElement.split("$").join("");
          calculateTotalUp(Number(productPrice));
        }
      };

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
let cartArr = [];
function calculateTotalUp(productPrice) {
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  cartArr.push(productPrice);
  const totalPrice = cartArr.reduce(
    (acc, currentValue) => Number(acc) + Number(currentValue),
    0
  );
  cartTotal.innerHTML = "$" + totalPrice.toFixed(2);
  cartCount.innerHTML++;
}

function calculateTotalDown(productPrice) {
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  let indexOfElement;
  cartArr.find((element, i, array) => {
    if ((element = productPrice)) {
      indexOfElement = array.indexOf(element);
    }
  });
  cartArr.splice(indexOfElement, 1);
  const totalPrice = cartArr.reduce(
    (acc, currentValue) => Number(acc) + Number(currentValue),
    0
  );
  cartCount.innerHTML--;
  cartTotal.innerHTML = "$" + totalPrice.toFixed(2);
}

function removeItem(numOfItems, productPrice, cartItemDivId) {
  const cartTotal = document.getElementById("cart-total");
  const cartTotalNum = Number(cartTotal.innerHTML.split("$").join(""));
  const cartCount = document.getElementById("cart-count");
  const cartItemDiv = document.getElementById(`${cartItemDivId}`);
  const totalToDeduct = productPrice * numOfItems;
  const newCartTotal = cartTotalNum - totalToDeduct;
  let indexOfElement;
  cartArr.find((element, i, array) => {
    if ((element = productPrice)) {
      cartArr.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      indexOfElement = array.indexOf(element);
    }
  });
  cartArr.splice(indexOfElement, numOfItems);

  cartTotal.innerHTML = "$" + newCartTotal.toFixed(2);
  cartCount.innerHTML -= numOfItems;
  cartItemDiv.remove();
}
