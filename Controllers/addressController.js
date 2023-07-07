const User = require("../models/userModel")
const Product = require('../models/productModel')
const Address = require('../models/addressModel')

const loadUserAddress = async(req,res)=>{
    try {
        const session = req.session.user_id;
        const userData = await User.findById({_id: session});
        const addressData = await Address.findOne({user_id: session})

        if(session){
            if(addressData){
                const address = addressData.Addresses
                res.render('userAddress',{user:userData, session, address:address})
            }else{
                res.render('emptyUserAddress',{user:userData,  session})
            }
        }else{
            res.render('/',{user:userData, session})
        }
    } catch (error) {
        console.log(error.message);
    }
}

const inserUserAddress = async(req,res)=>{
    try {
        const addressDetails = await Address.findOne({userId: req.session.user_id})
        if(addressDetails){
            const updateOne = await Address.updateOne({userId:req.session.user_id},{$push: {Addresses:{
                username:req.body.userName,
                mobile:req.body.mobile,
                alternativemob:req.body.alternativeMob,
                housename:req.body.housename,
                city:req.body.city,
                state:req.body.state,
                pincode:req.body.pincode,
                landmark:req.body.landmark
            }}});
            if(updateOne){
                res.redirect('')
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}