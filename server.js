const dotenv = require("dotenv");

const envfile =
  process.env.NODE_ENV === "production"
    ? ".env" // production
    : ".dev.env"; // development
dotenv.config({
  silent: true,
  path: `${__dirname}/${envfile}`
});

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const printfulKey = process.env.PRINTFUL_API_KEY;
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const stripe = require("stripe")(keySecret);
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;


app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(express.static("./public"));

// DB Config
const db = process.env.MONGO_DEV;

//connect to mongodb
mongoose
  .connect(db)
  .then(() => console.log("mongo connected"))
  .catch(error => console.log(error));

require("./routes/html")(app, express, path);
require("./routes/stripe")(app, stripe);
require("./routes/printful")(app);
require("./routes/admin")(app);

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(db);
}

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
