const mongoose = require("mongoose");

//Schemes and models
const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    },
});

exports.Product = mongoose.model("Product", productSchema);
