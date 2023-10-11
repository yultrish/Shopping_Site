const Order = require('../model/order')
const Product = require('../model/product')

exports.getOrder = async (req, res) => { // get Order
}

exports.getOrders = async (req, res) => {
    try { // get Orders
        const {customer_id} = req.body;

        if (!customer_id) {
            return res.status(409).json({message: 'request must have have customer_id '})
        }
        const order = await Order.query().where('customer_id', customer_id).orderBy('id');

        if (! order) {
            throw new Error('customer id deosnt exit')
        }
        res.status(200).json({message: 'orders from customer', order});

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error'); // error
    }

}


exports.CreateOrder = async (req, res) => { // create
    try {
        const {product_id, customer_id} = req.body;

        if (product_id != '' || customer_id != '') {

            if (typeof(product_id == Number) || typeof(customer_id == Number)) { // getting the price
                const product = await Product.query().findById(product_id);
                console.log(product)

                if (product.price) { // check if order is already inserted
                    const productId = await Order.query().where({product_id: product_id, customer_id: customer_id}).first();
                    if (productId) {
                        return res.status(409).json({message: "product already added to cart"})
                    }

                    // product.id while false
                    // create
                    const order = await Order.query().insertGraph({product_id: product_id, customer_id: customer_id, price: product.price});
                    if (! order) {
                        throw new Error("check db connection, order table doesn't exit")
                    }
                    return res.status(200).json(order)
                }

            }

        } // if condition ends here

        return res.status(409).json({message: "cannot create order without customer id or product id"})

    } catch (error) {
        console.error(error); // Log the error message
        res.status(500).json({error: 'Server error'});
    }
}

exports.getOrderWithCustomerId = async (req, res) => {
    const {customer_id} = req.body;
    const orders = await Order.query().where('customer_id', customer_id).withGraphFetched('products').orderBy('id')
    return res.status(200).json(orders)

}

exports.deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id; // Use route parameter for order ID

        if (! orderId) {
            return res.status(400).json({message: "Order ID is required"});
        }

        const order = await Order.query().findById(orderId);

        if (! order) {
            return res.status(404).json({message: "Order not found"});
        }

        const deletedOrder = await Order.query().deleteById(orderId);

        if (! deletedOrder) {
            throw new Error("Failed to delete order");
        }

        return res.status(200).json({message: "Order deleted"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};


exports.updateOrder = async (req, res) => {}

