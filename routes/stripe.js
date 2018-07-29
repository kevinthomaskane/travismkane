module.exports = function(app, stripe){
  app.post("/charge", (req, res) => {
    console.log(req.body)
    stripe.charges.create({
      amount: parseFloat(req.body.amount),
      currency: req.body.currency
    }, (err, charge) => {
      console.log(charge)
    })
    // stripe.customers
    //   .create({
    //     email: req.body.stripeEmail,
    //     source: req.body.stripeToken
    //   })
    //   .then(customer => {
    //     stripe.charges.create({
    //       amount,
    //       description: "Sample Charge",
    //       currency: "usd",
    //       customer: customer.id
    //     });
    //   })
    //   .then((charge) => {
    //     console.log("charge", charge)
    //     res.json("thank you for the payment")
    //   })
    //   .catch((err) => {throw err})
  });
}