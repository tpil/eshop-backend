const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

//alternative to handle promise with async and wait than .then and catch
router.get('/', async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList)
        res.status(500).json({ success: false });
    res.send(categoryList);
});

module.exports = router;