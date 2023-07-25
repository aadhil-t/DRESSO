const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    user:{
        type:Array,
        ref:'user'
    },
    couponName:{
        type:String,
        required:true,
    },
    couponCode:{
        type:String,
        required:true,
    },
    discountPercentage:{
        type:Number,
        required:true,
    },
    criteria:{
        type:String,
        require:true,
    },
    startDate:{
        type:Date,
        required:true,
    },
    expiryDate:{
        type:Date,
        required:true,
    },

})
const couponModel = mongoose.model("coupon",couponSchema);
module.exports = couponModel