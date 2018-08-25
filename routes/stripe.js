module.exports = function(app, stripe) {
  app.post("/charge", (req, res) => {
    stripe.charges
      .create({
        amount: req.body.totalAmount,
        description: "Sample Charge",
        currency: "usd",
        source: req.body.stripeToken
      })
      .then(charge => {
        console.log("charge", charge);
        res.json(charge);
      })
      .catch(err => {
        throw err;
      });
  });
};
