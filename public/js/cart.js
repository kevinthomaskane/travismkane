let items_in_cart;
let objectWithQuantities = {};

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
  getCartCount();
  const object = checkDuplicates(items_in_cart);
  objectWithQuantities = object;
  printItems(objectWithQuantities);
});

async function printItems(obj) {
  const length = Object.keys(obj).length;
  for (let prop in obj) {
    await $.get("/product-info/" + prop).then(product => {
      $(".cart__items-container").prepend(`
       <div class="cart__item border-top" data-id=${product[0]._id}>
          <div class="row">
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
              <div class="cart__image-container border-right">
              <img class="cart__image-container-image" src="${
                product[0].image
              }" />
              </div>
            </div>
            <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
              <div class="cart__description--container">
                <div class="cart__description--container-body">
                  <div class="cart__description--title">${product[0].name}</div>
                  <div class="cart__description--description">${
                    product[0].description
                  }</div>
                </div>
              </div>
            </div>
            <div class="col-xs-6 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <div class="cart__quantity-container border-left">
                <div class="cart__quantity">
                  QTY &#160;
                  <span class="cart__quantity-count" id=${product[0]._id}>${
        obj[prop]
      }</span>  
                </div>
                <div class="single__product--arrows">
                  <div class="single__product--arrows-container">
                    <span class="arrow-up" data-id=${product[0]._id}>
                      <img src="../uploads/up.png" />
                    </span>
                    <span class="arrow-down" data-id=${product[0]._id}>
                      <img src="../uploads/down.png" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xs-3 col-sm-4 col-md-3 col-lg-3 col-xl-2">
              <div class="cart__price border-left border-right" data-id=${
                product[0]._id
              } >
               $${obj[prop] * 33}
              </div>
            </div>
            <div class="col-xs-3 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <div class="cart__trash">
                <img data-id=${
                  product[0]._id
                } src="../uploads/trash.png" alt="">
              </div>
            </div>
          </div>
        </div>
      `);
    });
  }
  calculateTotal(obj);
}

function getCartCount() {
  let number_in_cart;
  const cart = $(".header__block--cart");
  const nothing_in_cart = $(".nothing-in-cart")[0];
  const cart_section = $(".cart")[0];
  if (
    localStorage.getItem("itemIds") &&
    localStorage.getItem("itemIds") !== "[]"
  ) {
    let storage_array = JSON.parse(localStorage.getItem("itemIds"));
    number_in_cart = storage_array.length;
    cart.html(
      `<a href="/cart"><img class="header-arrow" src="../uploads/arrow.png">CART (${number_in_cart})</a>`
    );
    nothing_in_cart.style = "display: none;";
    cart.style = "display: block;";
  } else {
    cart.html(
      `<a href="/cart"><img class="header-arrow" src="../uploads/arrow.png">CART</a>`
    );
    nothing_in_cart.style = "display: block;";
    cart_section.style = "display: none;";
  }
}

function calculateTotal(obj) {
  let total = 0;
  for (let prop in obj) {
    total += obj[prop] * 33;
  }
  $(".cart__total--price").html("$" + total);
}

function checkDuplicates(arr) {
  let obj = {};
  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i]]) {
      obj[arr[i]] = 1;
    } else {
      obj[arr[i]]++;
    }
  }
  return obj;
}

function showDropdown(id) {
  const dropdown = $(".remove__item-dropdown")[0];
  dropdown.style = "position: relative; animation: dropdown 2s;";
}

function resetDropdown() {
  const dropdown = $(".remove__item-dropdown")[0];
  dropdown.style = "display: none;";
}

$(document).on("click", ".arrow-up", function() {
  const id = $(this).attr("data-id");
  objectWithQuantities[id]++;
  items_in_cart.push(id);
  localStorage.setItem("itemIds", JSON.stringify(items_in_cart));
  getCartCount();
  calculateTotal(objectWithQuantities);
  let quantity = $(`#${id}`).text();
  quantity++;
  $(`#${id}`).text(quantity);
  $(`.cart__price[data-id=${id}]`).text("$" + quantity * 33);
});

$(document).on("click", ".arrow-down", function() {
  if (objectWithQuantities[$(this).attr("data-id")] > 1) {
    const id = $(this).attr("data-id");
    objectWithQuantities[id]--;
    items_in_cart.splice(items_in_cart.indexOf(id), 1);
    localStorage.setItem("itemIds", JSON.stringify(items_in_cart));
    getCartCount();
    calculateTotal(objectWithQuantities);
    let quantity = $(`#${id}`).text();
    quantity--;
    $(`#${id}`).text(quantity);
    $(`.cart__price[data-id=${id}]`).text("$" + quantity * 33);
  }
});

$(document).on("click", ".cart__trash img", function() {
  const id = $(this).attr("data-id");
  const local_storage_array = JSON.parse(localStorage.getItem("itemIds"));
  let newArray = local_storage_array.filter(elem => {
    return elem !== id;
  });
  localStorage.setItem("itemIds", JSON.stringify(newArray));
  showDropdown();
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
  setTimeout(() => {
    resetDropdown();
    getCartCount();
    delete objectWithQuantities[id];
    calculateTotal(objectWithQuantities);
    $(".cart__items-container").empty();
    printItems(objectWithQuantities);
  }, 2000);
});
