let items_in_cart;
let array_with_info = [];
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
      const image = product[0].image.split("public")[1];
      $(".cart").prepend(`
       <div class="cart__item border-top" data-id=${product[0]._id}>
          <div class="row">
            <div class="col-md-3">
              <div class="cart__image-container border-right">
              <img class="cart__image-container-image" src="${image}" />
              </div>
            </div>
            <div class="col-md-4">
              <div class="cart__description--container">
                <div class="cart__description--container-body">
                  <div class="cart__description--title">${product[0].name}</div>
                  <div class="cart__description--description">${
                    product[0].description
                  }</div>
                </div>
              </div>
            </div>
            <div class="col-md-2">
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
            <div class="col-md-2">
              <div class="cart__price border-left border-right" data-id=${
                product[0]._id
              } >
               $${obj[prop] * 33}
              </div>
            </div>
            <div class="col-md-1">
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
  if (localStorage.getItem("itemIds")) {
    let storage_array = JSON.parse(localStorage.getItem("itemIds"));
    number_in_cart = storage_array.length;
    cart.text(`Cart (${number_in_cart})`);
  } else {
    cart.text(`Cart`);
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
  if (objectWithQuantities[$(this).attr("data-id")] > 0) {
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
  const local_storage_array =  JSON.parse(localStorage.getItem("itemIds"));
  let newArray = local_storage_array.filter((elem) => {
    return elem !== id 
  });
  console.log(newArray)
  localStorage.setItem("itemIds", JSON.stringify(newArray));
  getCartCount();
  delete objectWithQuantities[id];
  calculateTotal(objectWithQuantities);
  $(`.cart__item[data-id=${id}]`).empty();
  console.log(objectWithQuantities);
});
