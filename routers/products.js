const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();

//alternative to handle promise with async and wait than .then and catch
router.get('/', async (req, res) => {
    const productList = await Product.find();

    if (!productList)
        res.status(500).json({ success: false });
    res.send(productList);
});

router.post('/', (req, res) => {
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

module.exports = router;