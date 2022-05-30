const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');
const express = require('express');
const router = express.Router();

//alternative to handle promise with async and wait than .then and catch
router.get('/', async (req, res) => {
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

    if (!orderList)
        res.status(500).json({ success: false });
    res.send(orderList);
});

router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({ 
            path: 'orderItems', 
            populate: { 
                path: 'product', 
                populate: 'category' 
            } 
        });

    if (!order)
        res.status(500).json({ success: false });
    res.send(order);
});

router.post('/', async (req, res) => {
    //the map() will return a promise for each item. Promise.all() will merge them to 1
    const orderItemsIds = Promise.all(req.body.orderItems.map(async item => {
        let newOrderItem = new OrderItem({
            quantity: item.quantity,
            product: item.product
        });

        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }));

    //resolve the promise to a strings array
    const orderItemsIdsResolved = await orderItemsIds;
    console.log('ORDER ITEMS IDS:',orderItemsIdsResolved);

    let totalPrices = await Promise.all(orderItemsIdsResolved.map(async orderItemID => {
        const orderItem = await OrderItem.findById(orderItemID).populate('product', 'price');
        const totalPrice = orderItem.quantity * orderItem.product.price;
        return totalPrice;
    }));

    totalPrices = totalPrices.reduce((a, b) => a + b, 0);

    console.log(totalPrices);
    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrices,
        user: req.body.user
    });

    order = await order.save();
    if (!order)
        return res.status(404).send('the order cannot be created!');

    res.send(order);
});

router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true }
    );

     if (!order)
        return res.status(500).send('the order cannot be updated!');

    res.send(order);
});

router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.forEach(async item => {
                await OrderItem.findByIdAndRemove(item);
            });

            return res.status(200).json({ success: true, message: "the order has been deleted!" });
        } else
            return res.status(404).json({ success: false, message: "order not found!" });
    }).catch((err) => {
        //in case of any error occurs from client's side. Invalid orderID
        return res.status(400).json({ success: false, error: err });
    });
});

//Admin Statistics
router.get('/get/totalsales', async (req, res) => {
    //aggregate join tables in one
    const totalSales = await Order.aggregate([
        // group the table. Mongoose requires _id to rerun an object. We sum each order totalPrice
        { $group: {_id: null, totalSales: { $sum: '$totalPrice'}}}
    ]);

    if (!totalSales)
        return res.status(400).send('The order sales cannot be generated!!');

    res.send({ totalSales: totalSales });
});

router.get('/get/count', async (req, res) => {
    const orderCount = await Order.countDocuments();

    if (!orderCount)
        return res.status(500).json({ success: false });

    res.status(200).json({ orderCount: orderCount });
});

router.get('/get/userorders/:userid', async (req, res) => {
    const userOrderList = await Order.find({ user: req.params.userid })
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category' }
        }).sort({ 'dateOrdered': -1 });

    if (!userOrderList)
        res.status(500).json({ success: false });
    res.send(userOrderList);
});

module.exports = router;