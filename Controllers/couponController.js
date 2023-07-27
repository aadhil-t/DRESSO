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
            res.render("couponPage",{admin:adminData,coupon:coupon});
        }else{
            res.render("couponPage",{admin:adminData,coupon:[]})
        }
    } catch (error) {
        console.log(error.message);
    }
}


       // ------------ INSERT COUPON ------------//
const addCoupon = async(req,res)=>{
    try {
        const coupon = new Coupon({
            couponName: req.body.couponName,
            couponCode: req.body.couponCode,
            discountPercentage: req.body.discountPercentage,
            criteria: req.body.criteria,
            startDate: req.body.startDate,
            expiryDate: req.body.expiryDate
        })
        const couponData = await coupon.save()
        if(couponData){
            res.redirect('/admin/couponLoad')
        }else{
            res.redirect('/admin/couponLoad')
        }
    } catch (error) {
        console.log(error.message);
    }
}


       // ------------ EDIT COUPON ------------//
const editCoupon = async(req,res)=>{
    try {
        const id = req.params.id
        const editCoupon = await Coupon.findByIdAndUpdate({_id:id},{$set:{
            couponName: req.body.couponName,
            couponCode: req.body.couponCode,
            discountPercentage: req.body.discountPercentage,
            criteria: req.body.criteria,
            startDate: req.body.startDate,
            expiryDate: req.body.expiryDate
        }})
        if(editCoupon){
            res.redirect('/admin/couponLoad')
        }else{
            res.redirect('/admin/couponLoad')
        }
    } catch (error) {
        console.log(error.message);
    }
}

       // ------------ DELETE COUPON ------------//
const deleteCoupon = async(req,res)=>{
    try {
        const id = req.body.id
        const deleteCoupon = await Coupon.findByIdAndDelete(id)
        if(deleteCoupon){
            res.redirect('/admin/couponLoad')
        }else{
            res.redirect('/admin/couponLoad')
        }
    } catch (error) {
        console.log(error.message);
    }
}

            //--------- USER SIDE--------//
       // ------------ APPLY COUPON ------------//
const applyCoupon = async(req,res,next)=>{
    try {
        const code = req.body.code;
     
        const amount = Number(req.body.amount)
        const userExist = await Coupon.findOne({couponCode:code,user:{$in:[req.session.user_id]}})
        if(userExist){
          return res.json({user:true})
        }else{
          const coupondata = await Coupon.findOne({couponCode:code})
          if(coupondata){
              if(coupondata.expiryDate <= new Date()){
                  return res.json({date:true})
              }else{
                  if(amount < coupondata.criteria){
                     return res.json({notEligible:true})
                  }else{
                  await Coupon.findOneAndUpdate({_id:coupondata._id},{$push:{user:req.session.user_id}}) 
                  const perAmount = Math.round((amount * coupondata.discountPercentage)/100 )
                  const disTotal = Math.round(amount - perAmount)
                  return res.json({amountOkey:true,disAmount:perAmount,disTotal})
              }
              }
          }
        }
        return res.json({invalid:true})
    } catch (error) {
        next(error);
    }
}


const addOffer = async(req,res)=>{
    try {
        const id = req.body.id
        const offName = req.body.offName
        console.log(offName);
        const offPercentage = req.body.offPercentage  
        console.log(offPercentage);
        const productdata = await Product.findById(id)
        const price = productdata.productPrice
        const offAmount = Math.round(price * offPercentage/100)
        console.log(offAmount);
        const offPrice = price - offAmount
        const offAdd =  await Product.findByIdAndUpdate(id,{$set:{
            offName: offName,
            offPercentage: offPercentage,
            offPrice: offPrice
        }})
        if(offAdd){
            res.redirect('/admin/productList')
        }else{
            res.redirect('/admin/productList')
        }
    } catch (error) {
        console.log(error.message);
    }
}
 

module.exports ={
    loadCoupon,
    addCoupon,
    editCoupon,
    deleteCoupon,
    applyCoupon, 
    addOffer
}