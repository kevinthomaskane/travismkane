// initialize stripe with scripts in index.html
const item_ids_in_cart = JSON.parse(localStorage.getItem("itemIds"));
let printful_file_ids = [];
let printful_order_id;
let state_required = true;
const states_required = ["US", "CA", "AU"];
const total_value = calculateTotal(item_ids_in_cart);
const spinner = document.querySelector("#spinner");
const dropdown = document.querySelector(".country-dropdown");
const state_container = document.querySelector(".state__container");
dropdown.style.display = "none";
$(".section__payment--total-value").text(`$${total_value}`);

$(document).ready(() => {
  let united_states;
  let united_kingdom;
  $.get("/country-codes").then(codes => {
    for (let prop in codes) {
      if (prop !== "US" && prop !== "GB") {
        let dropdownItem = document.createElement("div");
        dropdownItem.className = "country-dropdown-item";
        dropdownItem.setAttribute("data-code", prop);
        dropdownItem.innerHTML = codes[prop] + ", " + prop;
        dropdown.appendChild(dropdownItem);
      } else {
        if (prop === "US") {
          let united_states = document.createElement("div");
          united_states.className = "country-dropdown-item";
          united_states.setAttribute("data-code", prop);
          united_states.innerHTML = codes[prop] + ", " + prop;
          dropdown.prepend(united_states);
        } else {
          let united_kingdom = document.createElement("div");
          united_kingdom.className = "country-dropdown-item";
          united_kingdom.setAttribute("data-code", prop);
          united_kingdom.innerHTML = codes[prop] + ", " + prop;
          dropdown.prepend(united_kingdom);
        }
      }
    }
  });
});

$(document).on("click", ".country-dropdown-item", function() {
  $("#country").attr("disabled", false);
  $("#country").val($(this).attr("data-code"));
  dropdown.style.display = "none";
  checkStateRequirement($("#country").val());
});

$("#country").on("click", function() {
  $(this).attr("disabled", true);
  dropdown.style.display = "block";
});

$("#country").on("change", function(){
  if ($(this).val().length > 2){
    $(this).val("")
  }
})

function calculateTotal(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += 33;
  }
  return total;
}
const stripe = Stripe("pk_live_fA9g8eTjdCXwBdl9cRzc4tP6");
const elements = stripe.elements();
const style = {
  base: {
    color: "white",
    lineHeight: "24px",
    fontSmoothing: "antialiased",
    fontSize: "18px",
    "::placeholder": {
      color: "gray"
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

function checkStateRequirement(code) {
  if (states_required.indexOf(code) === -1) {
    state_container.style.display = "none";
    state_required = false;
  } else {
    state_container.style.display = "block";
  }
}

async function retrieve_printful_ids(arr) {
  for (let i = 0; i < arr.length; i++) {
    await $.get("/product-info/" + arr[i]).then(product => {
      printful_file_ids.push({
        variant_id: 1,
        name: product[0].name,
        retail_price: "33",
        quanity: 1,
        files: [{ id: parseInt(product[0].file_id) }]
      });
    });
  }
}

retrieve_printful_ids(item_ids_in_cart);
form.addEventListener("submit", function(event) {
  let valid = true;
  spinner.style.opacity = "1";
  event.preventDefault();
  stripe.createToken(card).then(function(result) {
    if (result.error) {
      let errorElement = document.getElementById("card-errors");
      errorElement.textContent = result.error.message;
      spinner.style.opacity = "0";
    } else {
      if (state_required) {
        const customer_name = $("#name").val();
        const customer_address1 = $("#address1").val();
        const customer_address2 = $("#address2").val();
        const customer_city = $("#city").val();
        const customer_state = $("#state").val();
        const customer_zipcode = $("#zipcode").val();
        const customer_country = $("#country").val();
        const customer_order_object = {
          name: customer_name,
          address: customer_address1 + " " + customer_address2,
          city: customer_city,
          state: customer_state,
          zipcode: customer_zipcode,
          country: customer_country,
          items: printful_file_ids
        };

        for (let prop in customer_order_object) {
          if (customer_order_object[prop].length < 1) {
            valid = false;
            alert("Please fill out all fields");
            spinner.style.opacity = "0";
            break;
          }
        }
        if (customer_state.length < 2) {
          valid = false;
          alert("Please fill out all fields");
          spinner.style.opacity = "0";
        }
        if (valid) {
          $.post("/printful-create-order", customer_order_object).then(res => {
            if (res.id) {
              printful_order_id = res.id;
              stripeTokenHandler(result.token);
            } else {
              alert("something went wrong, please try again");
              spinner.style.opacity = "0";
            }
          });
        }
      } else {
        const customer_name_int = $("#name").val();
        const customer_address1_int = $("#address1").val();
        const customer_address2_int = $("#address2").val();
        const customer_city_int = $("#city").val();
        const customer_zipcode_int = $("#zipcode").val();
        const customer_country_int = $("#country").val();
        const customer_order_object_int = {
          name: customer_name_int,
          address: customer_address1_int + " " + customer_address2_int,
          city: customer_city_int,
          zipcode: customer_zipcode_int,
          country: customer_country_int,
          items: printful_file_ids
        };

        for (let prop in customer_order_object_int) {
          if (customer_order_object_int[prop].length < 1) {
            valid = false;
            alert("Please fill out all fields");
            spinner.style.opacity = "0";
            break;
          }
        }
        if (valid) {
          $.post("/printful-create-order-int", customer_order_object_int).then(res => {
            if (res.id) {
              printful_order_id = res.id;
              stripeTokenHandler(result.token);
            } else {
              alert("something went wrong, please try again");
              spinner.style.opacity = "0";
            }
          });
        }
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
        localStorage.removeItem("itemIds");
        spinner.style.opacity = "0";
        window.location.href = "/complete";
      });
    },
    error: function(xhr, textStatus, error) {
      spinner.style.opacity = "0";
      alert(
        "something went wrong with your payment, please check your card information"
      );
    },
    dataType: "json",
    contentType: "application/json"
  });
  // form.submit();
}
