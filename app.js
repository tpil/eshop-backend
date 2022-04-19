const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

require("dotenv/config");
const api = process.env.API_URL;

//Midlewares
app.use(express.json()); //parse json data
app.use(morgan("tiny")); //log http requests

//Schemas / Models
const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true
  },
});

const Product = mongoose.model("Product", productSchema);

//alternative to handle promise with async and wait than .then and catch
app.get(api + "/products", async (req, res) => {
  const productList = await Product.find();

  if (!productList)
    res.status(500).json({ success: false });
  res.send(productList);
});

app.post(api + "/products", (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  //save it in the Database
  newProduct.save()
    .then((newProduct) => {
      res.status(201).json(newProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
  console.log(newProduct);
});

mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("DataBase connection is ready");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log(api);
  console.log("server is running http://localhost:3000");
});
