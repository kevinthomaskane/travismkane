const items = [1, 2, 3];
localStorage.setItem("itemIds", JSON.stringify(items));
const stripe = Stripe('pk_test_n6OWTMc1mV6eJqiuhGEv4ypN');

const elements = stripe.elements();

const style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

const card = elements.create('card', {style: style});

card.mount('#card-element');

card.addEventListener('change', function(event) {
  const displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

const form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  console.log(event)
  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  });
});

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
