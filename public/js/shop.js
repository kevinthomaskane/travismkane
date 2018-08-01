$(document).ready(function() {
  getProducts();
  getCartCount();
  // checkChartForCost();
  $("#button-pay").on("click", function() {
    const amount = $(this).text();
    const item_in_cart = localStorage.getItem("itemId");
    const charge_object = {
      amount: 500,
      currency: "usd"
    };
    // $.post("/charge", charge_object).then(response => {
    //   console.log(response)
    // })
  });
});

function calculateCostInCart(arr) {
  let total_cost_in_cart = 0;
  for (let i = 0; i < arr.length; i++) {
    $.get("/products/" + arr[i]).then(product => {
      total_cost_in_cart += product.price;
    });
  }
  return total_cost_in_cart;
}

function checkChartForCost() {
  const items_in_cart = JSON.parse(localStorage.getItem("itemIds"));
  const total_cost_in_cart = calculateCostInCart(items_in_cart);
  $("#button-pay").text(total_cost_in_cart);
}

function getCartCount() {
  let number_in_cart;
  const cart = $(".header__block--cart");
  if (localStorage.getItem("itemIds")) {
    let storage_array = JSON.parse(localStorage.getItem("itemIds"));
    number_in_cart = storage_array.length;
    cart.html(`<a href="/cart">CART (${number_in_cart})</a>`);
  } else {
    cart.text(`CART`);
  }
}

function getProducts() {
  $.get("/all_products").then(products => {
    for (let i = 0; i < products.length; i++) {
      let imageUrl = products[i].image.split("public")[1];
      if (i < products.length - 3) {
        $(".products__container").prepend(`
        <div class="col-md-4">
          <div class="products__container--product">
            <div class="products__container--image">
              <a href="/single-product/${products[i]._id}">
                <img src="${imageUrl}" />
              </a>
              <div class="products__container--overlay">
                <div class="products__container--overlay-body">
                  <div class="products__container--title">
                    ${products[i].name}
                  </div>
                  <div class="products__container--cost">
                    ${products[i].cost}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);
      } else {
        $(".products__container").prepend(`
        <div class="col-md-4">
          <div class="products__container--product">
            <div class="products__container--image">
              <a href="/single-product/${products[i]._id}">
                <img src="${imageUrl}" />
              </a>
              <div class="products__container--overlay">
                <div class="products__container--overlay-body">
                  <div class="products__container--title">
                    ${products[i].name}
                  </div>
                  <div class="products__container--cost">
                    ${products[i].cost}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);
      }
    }
    while ((products.length + 1) % 3 !== 0) {
      console.log("heleloo")
      $(".products__container").append(`
        <div class="col-md-4 no-border-bottom hidden-sm hidden-xs">
          <div class="products__container--product">
          </div>
        </div>
        `);
      products.length++;
    }
  });
}

$(document).on("mouseover", ".products__container--image", function() {
  let childElement = $(this).children(".products__container--overlay")[0];
  childElement.style.opacity = "1";
});
$(document).on("mouseleave", ".products__container--image", function() {
  let childElement = $(this).children(".products__container--overlay")[0];
  childElement.style.opacity = "0";
});
