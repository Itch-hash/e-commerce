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
