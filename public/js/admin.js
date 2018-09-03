const login_button = document.getElementById("admin_login_button");
const fd = new FormData();

login_button.addEventListener("click", () => {
  const admin_username = document.getElementById("admin_username").value;
  const admin_password = document.getElementById("admin_password").value;
  const admin_object = {
    username: admin_username,
    password: admin_password
  };
  $.post("/admin-login", admin_object).then(res => {
    console.log(res)
    if (res.status === "success") {
      localStorage.setItem("loggedIn", true);
      newProductFields();
      getAllProducts();
    }
  });
});

if (localStorage.getItem("loggedIn")) {
  $("#admin_username").css({ display: "none" });
  $("#admin_password").css({ display: "none" });
  login_button.style = "display: none;";
  newProductFields();
  getAllProducts();
}

function newProductFields() {
  $(".add-new-product-fields").append(`
  <div class="admin-page--new-product">
    <label for="new_product_name">New Product Name</label>
    <input type="text" id="new_product_name">
    <label for="new_product_description">New Product Description</label>
    <textarea id="new_product_description"></textarea>
    <label for="new_product_cost">New Product Cost</label>
    <input type="text" id="new_product_cost">
    <label for="new_product_printful_file_id">Printful File Id</label>
    <input type="text" id="new_product_printful_file_id">
    <label for="picture-upload">Printful URL</label>
    <input id="picture-upload" type="text" name="picture" className="custom-file-input"/>
    <button id="new_product_submit">submit information</button>
  </div>
`);
}

// $("#picture-upload").on("change", function(e) {
//   const image_upload = e.target.files[0];
//   fd.append("image", image_upload, image_upload.name);
// });

$("#new_product_submit").on("click", function() {
  fd.append("name", $("#new_product_name").val());
  fd.append("description", $("#new_product_description").val());
  fd.append("cost", $("#new_product_cost").val());
  fd.append("file_id", $("#new_product_printful_file_id").val());
  fd.append("image", $("#picture-upload").val());

  $.ajax({
    url: "/add-product",
    type: "POST",
    processData: false,
    contentType: false,
    dataType: "json",
    data: fd
  }).then((product) => {
    window.location.href = window.location.href;
  })
});

function getAllProducts() {
  $.get("/all_products").then(res => {
    if (localStorage.getItem("loggedIn")) {
      for (let i = 0; i < res.length; i++) {
        // let img_path = res[i].image.split("public")[1];
        $(".current-product-fields").append(`
        <div class="current-product">
            <label for="new_product_name">Product Name</label>
            <input type="text" class="${res[i]._id}" value="${res[i].name}">
            <label for="new_product_description">Product Description</label>
            <textarea class="${res[i]._id}" value="">${
              res[i].description
            }</textarea>
            <label for="new_product_cost">Product Cost</label>
            <input type="text" class="${res[i]._id}" value="${res[i].cost}">
            <label>Printful File Id</label>
            <input type="text" class="${res[i]._id}" value="${res[i].file_id}"/>
            <button class="edit_product_submit" id="${
              res[i]._id
            }">submit edits</button>
            <img class="current-product--image" src="${res[i].image}" >
            <button class="delete_product_submit" id="${
              res[i]._id
            }">delete product</button>
        </div>
      `);
      }
    }
  });
}

$(document).on("click", ".edit_product_submit", function() {
  const id = $(this).attr("id");
  const array_of_inputs = $("." + id);
  const product_object = {
    name: array_of_inputs[0].value,
    description: array_of_inputs[1].value,
    cost: array_of_inputs[2].value,
    file_id: array_of_inputs[3].value
  };
  $.post("/edit-product/" + id, product_object).then(res => {
    window.location.href = window.location.href;
  });
});

$(document).on("click", ".delete_product_submit", function() {
  const id = $(this).attr("id");
  $.post("/delete-product/" + id).then(res => {
    window.location.href = window.location.href;
  });
});
