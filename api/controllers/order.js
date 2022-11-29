import Order from '../models/order.js';

export const createOrder = async (req, res) => {
    const neworder = new Order(req.body);

    try {
        const savedorder = await neworder.save();
        res.status(200).json(savedorder);
    } catch (err) {
        res.status(500).json(err);
    }
}
export const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
}
export const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('order has been deleted');
    } catch (err) {
        res.status(500).json(err);
    }
}
export const getOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ userId: req.params.userId })
            .populate({ path: 'products.productId', select: 'title price image categories' })

        // format date and send it together with other order detail
        const date = order.createdAt.toLocaleString("en-US");
        const { products, amount, _id } = order;

        res.status(200).json({ products, amount, _id, date });
    } catch (err) {
        res.status(500).json(err);
    }
}
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate({ path: 'products.productId', select: 'title price image categories' })
        //curate order and format date
        const curatedOrders = orders.map(i => {
            const _id = i._id
            const products = i.products
            const amount = i.amount
            const address = i.address
            const userId = i.userId
            const createdAt = i.createdAt
            const date = createdAt.toLocaleString("en-US");

            const details = {
                _id, products, amount, userId, address, date
            }

            return details
        })

        res.status(200).json(curatedOrders);
    } catch (err) {
        res.status(500).json(err);
    }
}
// development ***
export const getIncome = async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date().setMonth(lastMonth.getMonth() - 1);

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: '$createdAt' },
                    sales: '$amount'
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: '$sales' },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }

}