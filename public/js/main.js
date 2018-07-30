const items = [1, 2, 3];
localStorage.setItem("itemIds", JSON.stringify(items));

// initialize stripe with scripts in index.html
const stripe = Stripe("pk_test_n6OWTMc1mV6eJqiuhGEv4ypN");
const elements = stripe.elements();
const style = {
  base: {
    color: "#32325d",
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
form.addEventListener("submit", function(event) {
  event.preventDefault();
  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
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
        address: customer_address1 + customer_address2,
        city: customer_city,
        state: customer_state,
        zipcode: customer_zipcode,
        items: []
      };
      $.post("/customer-info", customer_order_object).then(res => {
        console.log(res)
        if (res.status === "success") {
          stripeTokenHandler(result.token);
        }
      });
    }
  });
});

function stripeTokenHandler(token) {
  var form = document.getElementById("payment-form");
  var hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("type", "hidden");
  hiddenInput.setAttribute("name", "stripeToken");
  hiddenInput.setAttribute("value", token.id);
  form.appendChild(hiddenInput);
  form.submit();
}

$(document).ready(function() {
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

// function calculateCostInCart(arr) {
//   let total_cost_in_cart = 0;
//   for (let i = 0; i < arr.length; i++) {
//     $.get("/products/" + arr[i]).then(product => {
//       total_cost_in_cart += product.price;
//     });
//   }
//   return total_cost_in_cart;
// }

// function checkChartForCost(){
//   const items_in_cart = JSON.parse(localStorage.getItem("itemIds"));
//   const total_cost_in_cart = calculateCostInCart(items_in_cart);
//   $("#button-pay").text(total_cost_in_cart);
// }
