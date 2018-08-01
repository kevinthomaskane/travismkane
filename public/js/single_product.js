let current_product = [];
let quantity = parseInt($(".single__product--quantity-count").text());
let items_in_cart;
let added_to_cart = false;

if (localStorage.getItem("itemIds")) {
  let array = [];
  let storage_array = JSON.parse(localStorage.getItem("itemIds"));
  for (let i = 0; i < storage_array.length; i++) {
    array.push(storage_array[i]);
  }
  items_in_cart = array;
} else {
  items_in_cart = [];
}

$(document).ready(function() {
  const product_id = window.location.href.split("single-product/")[1];
  $.get("/product-info/" + product_id).then(product => {
    current_product = product;
    displayInformation();
    getCartCount();
    checkItemInCart();
  });
});

function displayInformation() {
  $(".single__product--image").append(`
    <img class="single__product--image-image" src="${
      current_product[0].image.split("public")[1]
    }" />
    <img class="single__product--image-clone" src="${
      current_product[0].image.split("public")[1]
    }" />
  `);
  $(".single__product--description").append(`
    <div class="single__product--description-title">
      ${current_product[0].name} - $${current_product[0].cost}
    </div>
    <div class="single__product--description-description">
      ${current_product[0].description}
    </div>
  `);
}

function updateQuantity(num) {
  $(".single__product--quantity-count").text(num);
}

function imageToCart() {
  const clone = $(".single__product--image-clone");
  clone[0].style = "animation: imageSlide 2s; z-index: 2;";
}

function increaseCart() {
  let number_in_cart;
  const cart = $(".header__block--cart");
  if (localStorage.getItem("itemIds")) {
    let storage_array = JSON.parse(localStorage.getItem("itemIds"));
    number_in_cart = storage_array.length;
    cart.text(`Cart (${number_in_cart})`);
  } else {
    cart.text(`Cart`);
  }
}

function getCartCount() {
  let number_in_cart;
  const cart = $(".header__block--cart");
  if (localStorage.getItem("itemIds")) {
    let storage_array = JSON.parse(localStorage.getItem("itemIds"));
    number_in_cart = storage_array.length;
    cart.text(`Cart (${number_in_cart})`);
  } else {
    cart.text(`Cart`);
  }
}
function checkItemInCart() {
  let number_in_cart;
  const product_id = window.location.href.split("single-product/")[1];
  const cart = $(".header__block--cart");
  if (localStorage.getItem("itemIds")) {
    let storage_array = JSON.parse(localStorage.getItem("itemIds"));
    if (storage_array.indexOf(product_id) !== -1) {
      $(".single__product--add-to-cart").html(
        `<i class="fas fa-check"></i> Added to cart`
      );
    }
  }
}

function resetImage() {
  setTimeout(() => {
    const clone = $(".single__product--image-clone");
    increaseCart();
    checkItemInCart();
    clone[0].style =
      "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -51%) translateZ(0); width: 44rem; height: 59rem; backfaceVisibility: hidden; display: none; z-index: 2;";
  }, 2000);
}

$(".arrow-up").on("click", function() {
  quantity++;
  updateQuantity(quantity);
});

$(".arrow-down").on("click", function() {
  if (quantity > 0) {
    quantity--;
    updateQuantity(quantity);
  }
});

$(".single__product--add-to-cart").on("click", function() {
  for (let i = 1; i <= quantity; i++){
    items_in_cart.push(window.location.href.split("single-product/")[1]);
  }
  localStorage.setItem("itemIds", JSON.stringify(items_in_cart));
  imageToCart();
  resetImage();
});
