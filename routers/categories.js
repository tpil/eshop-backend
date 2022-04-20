const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

//alternative to handle promise with async and wait than .then and catch
router.get('/', async (req, res) => {
    //select specific columns, exclude
    const categoryList = await Category.find().select('name icon -_id');

    if (!categoryList)
        res.status(500).json({ success: false });
    res.send(categoryList);
});

router.get('/:id', async (req, res) => {
    const categoryItem = await Category.findById(req.params.id);

    if (!categoryItem)
        res.status(500).json({ message: "the category with the given ID was not found!" });
    res.send(categoryItem);
});

router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });

    category = await category.save();
    if (!category)
        return res.status(404).send('the category cannot be created!');

    res.send(category);
});

router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        { new: true }
    );

     if (!category)
        return res.status(500).send('the category cannot be updated!');

    res.send(category);
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndDelete(req.params.id).then(category => {
        if (category)
            return res.status(200).json({ success: true, message: "the category has been deleted!" });
        else
            return res.status(404).json({ success: false, message: "category not found!" });
    }).catch((err) => {
        //in case of any error occurs from client's side. Invalid categoryID
        return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;