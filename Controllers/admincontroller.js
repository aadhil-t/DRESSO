const User = require('../models/userModel')
const bcrypt = require('bcrypt')


//---------  LOADING LOGIN ---------//
const loadLogin = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}

//--------- VERIFY LOGIN ---------//
const verifyLogin = async(req,res)=>{
    try {
        const emailAdmin = req.body.email
        console.log(emailAdmin);
        const password = req.body.password
        const userData = await User.findOne({email:emailAdmin})
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password)
            if(passwordMatch){
                console.log(passwordMatch);

                if(userData.is_admin === 0){
                    res.render('login',{message:"Email and Password is Incorrect!!"})
                }
                else{
                   req.session.auser_id = userData._id;
                    res.redirect('/admin/dashboard')
                }
            }
            else{
                res.render('login',{message:"Email and Password is Incorrect"})
            }
        }
        else{
            message="Email and Password is Incorrect"
            res.render('login');
        }
    } catch (error) {
        console.log(error.message);
    }
}

//--------- ADMIN LOGOUT ---------//
const adminLogout = async(req,res)=>{
    try {
        req.session.destroy()

        res.redirect('/admin')
    } catch (error) {
        console.log(error.message);
    }
}

//---------  LOADING HOME ---------//
const loadhome = async(req,res)=>{
    try {
        res.render('/admin/dashboard')
    } catch (error) {
        console.log(error);
    }
}

//---------  LOADING USERLIST ---------//
const loaduserlist = async(req,res)=>{
    try {
        const userData = await User.find({})
        res.render('userlist',{user:userData})
    } catch (error) {
        console.log(error.message);
    }
}

//---------  LOADING DASHBOARD ---------//
const loadDashboard = async(req,res)=>{
    try {
        res.render('dashboard')
    } catch (error) {
        console.log(error.message);
    }
}


//--------- BLOCKING USER  ---------//
const block = async(req,res)=>{
    try {
        console.log(req.query.id);
        const userData = await User.findByIdAndUpdate(req.query.id,{$set:{is_block:true}});
        req.session.user_id = null
        res.redirect('/admin/userlist')
    } catch (error) {
        console.log(error.message);
    }
}


//--------- UNBLOCKING USER  ---------//
const unblock = async(req,res)=>{
    try {
        const userData = await User.findByIdAndUpdate(req.query.id,{$set:{is_block:false}});
        res.redirect('/admin/userlist')
    } catch (error) {
        console.log(error.message);
    }
}




module.exports ={
    loadhome,
    loaduserlist,
    loadLogin,
    adminLogout,
    verifyLogin,
    loadDashboard,
    block,
    unblock,
}