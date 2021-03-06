const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    //allow query parameters from url to filter products from categories ids
    //the query should be: ?categories=value1-value2-.... 
    let filter = {};
    if (req.query.categories)
        filter = { category: req.query.categories.split('-') };

    const productList = await Product.find(filter).populate('category');

    if (!productList)
        res.status(500).json({ success: false });

    res.send(productList);
});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('category');

    if (!product)
        return res.status(404).send('<b>Product ID not found!</b>');

    res.send(product);
});

router.post('/', async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category)
        return res.status(400).send('Invalid Category');

    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    //save it in the Database
    newProduct = await newProduct.save();

    if (!newProduct)
        return res.status(500).send('The product cannot be created');

    res.send(newProduct);
});

router.put('/:id', async (req, res) => {
    //how to cacth Invalid id without using promise then catch
    if (!mongoose.isValidObjectId(req.params.id))
        return res.status(404).send('Invalid Product ID');

    const category = await Category.findById(req.body.category);
    if (!category)
        return res.status(400).send('Invalid Category');

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        { new: true } //if true returns the updated if false returns before update
    );

    if (!product)
        return res.status(500).send('the product cannot be updated!');

    res.send(product);
});

router.delete('/:id', async (req, res) => {
    //how to cacth Invalid id without using promise then catch
    if (!mongoose.isValidObjectId(req.params.id))
        return res.status(404).send('Invalid Product ID');

    const product = await Product.findByIdAndDelete(req.params.id);
    if (product)
        return res.status(200).json({ success: true, message: "the product is deleted!" });
    else
        return res.status(404).json({ success: false, message: "product not found!" });

});

//Admin Statistics
//get All Products
router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments();

    if (!productCount)
        return res.status(500).json({ success: false });

    res.status(200).json({ productCount: productCount });
});
//get 5 featured products
router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);

    if (!products)
        return res.status(500).json({ success: false });

    res.status(200).send(products);
});

module.exports = router;