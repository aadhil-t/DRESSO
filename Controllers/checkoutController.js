const Cart = require("../models/cart-Model")
const User = require("../models/userModel")
const Address = require('../models/addressModel')

const loadCheckout = async(req,res)=>{
    try {
        const session = req.session.user_id;
        const user = await User.findById(req.session.user_id)
        const userData = await User.findOne({ id: req.session.user_id });
        const addressData = await Address.findOne({userid: req.session.user_id})
        console.log(addressData);
        // const total =   
        res.render("userCheckout",{session,userData,user,address:addressData})
    } catch (error) {
        console.log(error.message);
    }
}



module.exports ={
    loadCheckout,
}