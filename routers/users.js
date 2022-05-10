const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//alternative to handle promise with async and wait than .then and catch
router.get('/', async (req, res) => {
    const userList = await User.find().select('name email phone isAdmin');

    if (!userList)
        res.status(500).json({ success: false });
    res.send(userList);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user)
        res.status(500).json({ message: "the user with the given ID was not found!" });

    res.send(user);
});

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });

    user = await user.save();
    if (!user)
        return res.status(404).send('the user cannot be created!');

    res.send(user);
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;

    if (!user)
        return res.status(400).send('User not found');

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        //create jsonwebtoken
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            { expiresIn: '1d' } //set expire duration 1d=1day 1w=1week
        )
        res.status(200).json({ user: user.email, token: token });
    } else
        res.status(400).send('wrong password');

});

router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });

    user = await user.save();
    if (!user)
        return res.status(404).send('the user cannot be created!');

    res.send(user);
});

router.put('/:id', async (req, res) => {

    const userExist = await User.findById(req.params.id);

    let newPassword;
    if (req.body.password)
        newPassword = bcrypt.hashSync(req.body.password);
    else
        newPassword = userExist.passwordHash;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        },
        { new: true }
    );

    if (!user)
        return res.status(500).send('the user cannot be updated!');

    res.send(user);
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndDelete(req.params.id).then(user => {
        if (user)
            return res.status(200).json({ success: true, message: "the user has been deleted!" });
        else
            return res.status(404).json({ success: false, message: "user not found!" });
    }).catch((err) => {
        //in case of any error occurs from client's side. Invalid categoryID
        return res.status(400).json({ success: false, error: err });
    });
});


//Admin Statistics
router.get('/get/count', async (req, res) => {
    const UserCount = await User.countDocuments();

    if (!UserCount)
        return res.status(500).json({ success: false });

    res.status(200).json({ userCount: UserCount });
});

module.exports = router;