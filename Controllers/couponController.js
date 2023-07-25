const User = require('../models/userModel')
const Product = require('../models/productModel');
const Order = require('../models/orderModel')
const Coupon = require('../models/couponModel');
const { adminLogout } = require('./admincontroller');


       // ------------ LOAD COUPON ------------//
const loadCoupon = async(req,res)=>{
    try {
        const adminData = req.session.auser_id
        const coupon = await Coupon.find({})
        if(coupon){
            res.render("couponPage",{admin:adminData,coupons:coupon});
        }else{
            res.render("couponPage",{admin:adminData,coupons:[]})
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
    loadCoupon,
}