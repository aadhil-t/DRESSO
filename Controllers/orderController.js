const User = require('../models/userModel');
const Product = require('../models/productModel')
const Cart = require('../models/cart-Model')
const Order = require('../models/orderModel');



const placeOrder = async(req,res)=>{
    try {
        console.log("kkdk");
        const userData = await User.findOne({_id: req.session.user_id});
        const address = req.body.address;
        const cartData = await Cart.findOne({userId:req.session.user_id});
        const products = cartData.products;
        console.log(address);
        const total = parseInt(req.body.Total)
        console.log(total);
        const paymentMethod = req.body.payment;

        const status = paymentMethod === 'COD' ? 'placed' : 'pending';
        
        const order = new Order({
            deliveryAddress: address,
            userId:req.session.user_id,
            userName:userData.name,
            paymentMethod: paymentMethod,
            products: products,
            totalAmount: total,
            status: status,
            date: new Date(),
        });

        const orderData = await order.save();

        const orderid = order._id

        if(orderData){
            // CASH ON DELIVERY
            if(order.status === 'placed'){
                await Cart.deleteOne({userId:req.session.user_id});
                for(let i=0; i< products.length; i++){
                    const pro = products[i].productid;
                    const count = products[i].countl;
                    await Product.findOneAndUpdate({ _id:pro},{$inc: {quantity: -count}});
                }
                res.json({ codsuccess: true, orderid})
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}


const orderSuccessPage = async(req,res)=>{
    try {
        const session = req.session.user_id
        const user = await User.findById(session)
        const id = req.params.id;
        const orderData = await Order.findOne({_id: id}).populate("products.productid");
        console.log(orderData);
        const orderDate = orderData.date;
        
        res.render('orderSuccessPage',{session,orders:orderData,user:user})

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    placeOrder,
    orderSuccessPage,
}

