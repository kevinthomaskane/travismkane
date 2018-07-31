const Admin = require("../models/Admin");
const Product = require("../models/Product");
const express = require("express");
const app = express();
const multer = require("multer")
const storage = multer.diskStorage({
  destination: function(req, res, cb){
    cb(null, "public/uploads/")
  },
  filename: function(req, res, cb){
    cb(null, res.originalname)
  }
})
const upload = multer({ storage: storage });

app.use(multer({dest:'./public/uploads/'}).any());

module.exports = function(app) {
  app.post("/admin-login", (req, res) => {
    console.log(req.body);
    Admin.findOne({
      username: req.body.username,
      password: req.body.password
    })
      .then(admin => {
        res.json({ status: "success" });
      })
      .catch(err => res.json(err));
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

  app.post("/add-product", upload.single("image"), (req, res) => {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      cost: req.body.cost,
      image: req.file.path,
      file_id: req.body.file_id
    });

    newProduct.save().then((product) => {
      console.log(product)
    })
  })

  app.post("/delete-product/:id", (req, res) => {
    Product.findOneAndRemove({_id : req.params.id}).then((product) => {
      res.send("removed")
    })
  })
};
