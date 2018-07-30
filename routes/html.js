module.exports = function(app, express, path) {
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/index.html"));
  });
  app.get("/admin/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/admin_login.html"));
  });

  app.get("/charge", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/charge.html"));
  });
};
