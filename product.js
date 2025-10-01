document.addEventListener("DOMContentLoaded", () => {
  async function init() {
    try {
      const response = await fetch("./db.json");
      const data = await response.json();
      const params = new URLSearchParams(window.location.search);
      const urlProductId = params.get("id");
      const productIDsArr = data.products.map((element) => {
        return element;
      });

      productIDsArr.forEach((element) => {
        if (element.id == urlProductId) {
          displayProductById(element);
        }
      });
    } catch (error) {
      console.error("Couldn't load Data due to", error);
    }
  }
  init();
});

function displayProductById(product) {
  const productSection = document.getElementById("product-detail");

  const imageDiv = document.createElement("div");
  imageDiv.classList.add("product-image-gallery");
  productSection.appendChild(imageDiv);

  const mainThumbnailImg = document.createElement("img");
  mainThumbnailImg.src = product.thumbnail;
  mainThumbnailImg.alt = product.title;
  mainThumbnailImg.classList.add("main-product-image");

  imageDiv.appendChild(mainThumbnailImg);

  const thumbnailGalleryDiv = document.createElement("div");
  thumbnailGalleryDiv.classList.add("thumbnail-gallery");
  imageDiv.appendChild(thumbnailGalleryDiv);

  const thumbnailGalleryImgArr = product.images;
  thumbnailGalleryImgArr.forEach((image) => {
    const thumbnailImage = document.createElement("img");
    thumbnailImage.src = image;
    thumbnailImage.alt = product.title;
    thumbnailImage.classList.add("thumbnail-image");

    thumbnailGalleryDiv.appendChild(thumbnailImage);
  });

  const productInfoDiv = document.createElement("div");
  productInfoDiv.classList.add("product-info-details");
  productSection.appendChild(productInfoDiv);

  const productTitle = document.createElement("h2");
  productTitle.innerHTML = product.title;
  productTitle.classList.add("product-title");
  productInfoDiv.appendChild(productTitle);

  const productRating = document.createElement("div");
  productRating.classList.add("product-rating");
  productRating.innerHTML = `Rating: ${product.rating}/5`;
  productInfoDiv.appendChild(productRating);

  const productBrand = document.createElement("div");
  productBrand.classList.add("product-brand");
  productBrand.innerHTML = `Brand: ${product.brand}`;
  productInfoDiv.appendChild(productBrand);

  const productDescription = document.createElement("p");
  productDescription.classList.add("product-full-description");
  productDescription.innerHTML = product.description;
  productInfoDiv.appendChild(productDescription);

  const productPrice = document.createElement("div");
  productPrice.classList.add("product-price-large");
  productPrice.innerHTML = `$${product.price.toFixed(2)}`;
  productInfoDiv.appendChild(productPrice);

  const productStock = document.createElement("div");
  productStock.classList.add("product-stock");
  productStock.innerHTML = `In Stock:${product.stock}`;
  productInfoDiv.appendChild(productStock);

  const productActions = document.createElement("div");
  productActions.classList.add("product-actions-details");
  productInfoDiv.appendChild(productActions);

  const addToCartBtn = document.createElement("button");
  addToCartBtn.classList.add("add-to-cart-btn");
  addToCartBtn.innerHTML = "Add to Cart";
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
}
