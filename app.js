const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');

require("dotenv/config");

//enable cors for all domain orgins
app.use(cors());
app.options('*', cors());

//Midlewares
app.use(express.json()); //parse json data
app.use(morgan("tiny")); //log http requests

//Routers - use routers as Midleware
const api = process.env.API_URL;
const categoriesRouter = require('./routers/categories');
const productsRouter = require('./routers/products');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');
app.use(api + '/categories', categoriesRouter);
app.use(api + '/products', productsRouter);
app.use(api + '/users', usersRouter);
app.use(api + '/orders', ordersRouter);

//Database
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
