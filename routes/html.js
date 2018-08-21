module.exports = function(app, express, path) {
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/shop.html"));
  });

  app.get("/admin/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/admin_login.html"));
  });

  app.get("/single-product/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/single_product.html"));
  });

  app.get("/cart", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/cart.html"));
  });

  app.get("/info", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/info.html"));
  });

  app.get("/checkout", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/checkout.html"));
  });
};
