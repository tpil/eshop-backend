const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

//alternative to handle promise with async and wait than .then and catch
router.get('/', async (req, res) => {
    const userList = await User.find();

    if (!userList)
        res.status(500).json({ success: false });
    res.send(userList);
});

module.exports = router;