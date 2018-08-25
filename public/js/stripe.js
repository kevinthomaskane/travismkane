// initialize stripe with scripts in index.html
const item_ids_in_cart = JSON.parse(localStorage.getItem("itemIds"));
let printful_file_ids = [];
let printful_order_id;
const total_value = calculateTotal(item_ids_in_cart);
$(".section__payment--total-value").text(`$${total_value}`);

function calculateTotal(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += 33;
  }
  return total;
}
const stripe = Stripe("pk_test_n6OWTMc1mV6eJqiuhGEv4ypN");
const elements = stripe.elements();
const style = {
  base: {
    color: "white",
    lineHeight: "18px",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};
const card = elements.create("card", { style: style });
card.mount("#card-element");

card.addEventListener("change", function(event) {
  const displayError = document.getElementById("card-errors");
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = "";
  }
});

const form = document.getElementById("payment-form");

function calculateTotalCost(arr) {
  return parseInt(arr.length) * 3300;
}

async function retrieve_printful_ids(arr) {
  for (let i = 0; i < arr.length; i++) {
    await $.get("/product-info/" + arr[i]).then(product => {
      printful_file_ids.push({
        variant_id: 1,
        name: product[0].name,
        retail_price: "33",
        quanity: 1,
        files: [{ id: product[0].file_id }]
      });
    });
  }
}

retrieve_printful_ids(item_ids_in_cart);
form.addEventListener("submit", function(event) {
  let valid = true;
  event.preventDefault();
  stripe.createToken(card).then(function(result) {
    if (result.error) {
      let errorElement = document.getElementById("card-errors");
      errorElement.textContent = result.error.message;
    } else {
      const customer_name = $("#name").val();
      const customer_address1 = $("#address1").val();
      const customer_address2 = $("#address2").val();
      const customer_city = $("#city").val();
      const customer_state = $("#state").val();
      const customer_zipcode = $("#zipcode").val();
      const customer_order_object = {
        name: customer_name,
        address: customer_address1 + " " + customer_address2,
        city: customer_city,
        state: customer_state,
        zipcode: customer_zipcode,
        items: printful_file_ids
      };

      for (let prop in customer_order_object) {
        if (customer_order_object[prop].length < 1) {
          valid = false;
          alert("Please fill out all fields");
          break;
        }
      }
      if (valid) {
        $.post("/printful-create-order", customer_order_object).then(res => {
          if (res.id) {
            printful_order_id = res.id;
            stripeTokenHandler(result.token);
          }
        });
      }
    }
  });
});

function stripeTokenHandler(token) {
  var form = document.getElementById("payment-form");
  var hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("type", "hidden");
  hiddenInput.setAttribute("name", "stripeToken");
  hiddenInput.setAttribute("value", token.id);

  var totalAmount = document.createElement("input");
  totalAmount.setAttribute("type", "hidden");
  totalAmount.setAttribute("name", "totalAmount");
  totalAmount.setAttribute("value", calculateTotalCost(item_ids_in_cart));
  form.appendChild(hiddenInput);
  form.appendChild(totalAmount);

  var formData = JSON.stringify({
    stripeToken: token.id,
    totalAmount: totalAmount.value
  });

  $.ajax({
    type: "POST",
    url: "/charge",
    data: formData,
    success: function() {
      $.post("/printful-confirm-order/" + printful_order_id).then(order => {
        console.log(order);
      });
    },
    dataType: "json",
    contentType: "application/json"
  });
  // form.submit();
}
