const Product = require("../models/Product");

module.exports = function(app){
  app.get("/product-info/:id", (req, res) => {
    const product_id = req.params.id;
    Product.find({
      _id: product_id
    }).then((product) => {
      res.send(product)
    })
  })
}