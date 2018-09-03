const Admin = require("../models/Admin");
const Product = require("../models/Product");
const express = require("express");
const app = express();


module.exports = function(app, username, password) {
  app.post("/admin-login", (req, res) => {
    if (req.body.username === username && req.body.password === password){
      res.json({ status: "success" });
    } else {
      res.end();
    }
  });

  app.get("/all_products", (req, res) => {
    Product.find({}).then(data => res.send(data));
  });

  app.post("/edit-product/:id", (req, res) => {
    Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          cost: req.body.cost
        }
      },
      { new: true }
    ).then(product => {
      res.send(product)});
  });

  app.post("/add-product", (req, res) => {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      cost: req.body.cost,
      image: req.body.image,
      file_id: req.body.file_id
    });

    newProduct.save().then((product) => {
      res.send("product add")
    })
  })

  app.post("/delete-product/:id", (req, res) => {
    Product.findOneAndRemove({_id : req.params.id}).then((product) => {
      res.send("removed")
    })
  })
};
