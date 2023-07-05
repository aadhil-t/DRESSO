const Cart = require("../models/cart-Model")
const User = require("../models/userModel")

const loadCheckout = async(req,res)=>{
    try {
        const session = req.session.user_id;
        const user = await User.findById(req.session.user_id)
        const userData = await User.findOne({ id: req.session.user_id });
        // const total =   
        res.render("userCheckout",{session,userData,user})
    } catch (error) {
        console.log(error.message);
    }
}


module.exports ={
    loadCheckout,
}