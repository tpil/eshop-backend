const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv/config");
const api = process.env.API_URL;
const categoriesRouter = require('./routers/categories');
const productsRouter = require('./routers/products');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');

//Midlewares
app.use(express.json()); //parse json data
app.use(morgan("tiny")); //log http requests

//Routers - use routers as Midleware
app.use(api + '/categories', categoriesRouter);
app.use(api + '/products', productsRouter);
app.use(api + '/users', usersRouter);
app.use(api + '/orders', ordersRouter);

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
