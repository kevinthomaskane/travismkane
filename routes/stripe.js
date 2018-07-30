module.exports = function(app, stripe) {
  app.post("/charge", (req, res) => {
    console.log(req.body);
    stripe.charges
      .create({
        amount: 2000,
        description: "Sample Charge",
        currency: "usd",
        source: req.body.stripeToken
      })
      .then(charge => {
        console.log("charge", charge);
        res.json("thank you for the payment");
      })
      .catch(err => {
        throw err;
      });
  });
};
