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
  productActions.appendChild(addToCartBtn);

  const addToWishListBtn = document.createElement("button");
  addToWishListBtn.classList.add("add-to-wishlist-btn");
  addToWishListBtn.innerHTML = "❤️";
  productActions.appendChild(addToWishListBtn);
}
