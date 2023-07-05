const User = require('../models/userModel')
const nodeMailer = require('nodemailer')
const bcrypt = require('bcrypt')
const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const session = require('express-session')
const wishlist = require('../models/wishlistModel')
// const config = require()
let email
let otp
let name


//--------- LOADING HOME ---------//
const loadhome = async(req,res)=>{
    try{
        const session = req.session.user_id
        const userData = await User.findById(req.session.user_id)
      res.render('home',{user:userData,session})
    }
    catch(error){
        console.log(error);
    }
}

//--------- LOADING LOGIN ---------//
const loadLogin=async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error);
    }
}

// --------- USER LOGOUT ---------//
const userLogout = async(req,res)=>{
    try {
        req.session.destroy()
        res.redirect("/")
    } catch (error) {
        console.log(error.message);
    }
}


//--------- VERIFY LOGIN ---------//
const verifylogin = async(req,res)=>{
    try {
        const emailUser = req.body.Email
        const password = req.body.Password
        const userData = await User.findOne({email:emailUser}) 
        const passwordMatch = await bcrypt.compare(password,userData.password)
        if(passwordMatch){
            req.session.user_id = userData._id
            res.redirect('/')
        }
        else{
            res.render('login',{session,message:"Email is wrong !!"})
        }
    } catch (error) {
        console.log(error.message);
    }

    
}

//--------- LOADING REGISTER ---------//
const loadRegister = async(req,res)=>{
    try {
        const session = req.session.user_id
        res.render('registration',{session})
    } catch (error) {
        console.log(error);
    }
}

//--------- SECURE PASSWORD ---------//
const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}

//--------- INSERT USER ---------//
const insertuser = async(req,res)=>{
    try {
        
        // ----- password security-----//
        const spassword = await securePassword(req.body.password);

        const user = new User({
          name: req.body.name,
          email: req.body.email,
          contact: req.body.contact,
          password: spassword,
          is_admin:0,
    });
      
        const userData = await user.save();
        email = userData.email
        name = userData.name
        if(userData){
            randomnumber = Math.floor(Math.random() * 9000) + 1000;
            otp = randomnumber;
             sendverifyMail(name, req.body.email, randomnumber);
             res.redirect("/verification");
           
        }
        else{
            res.render('registration',{message:'your registration has been failed '})
        }

     } catch(error){
            console.log(error.message);
        }
    }


    //--------- SEND VERIFY MAIL  ---------//
    const sendverifyMail = async(name,email,otp)=>{
        try {
            const transporter = nodeMailer.createTransport({
                service: "gmail",
                auth: {
                  user:process.env.Mymail,
                  pass:process.env.googlepass,
                },
              });
              const mailOptions = {
                from:process.env.Mymail,
                to: email,
                subject: "verification Email",
                html: `<p>Hi ${name}, please click <a href="http://localhost:3001/otp">here</a> to verify and enter your verification email.This${otp}</p> `,
              };
              console.log(otp);
              const info = await transporter.sendMail(mailOptions);
            
        } catch (error) {
            console.log(error.message);
        }
    }


    //--------- VERIFY EMAIL ---------//
    const verifyEmail = async (req, res,next) => {
        const otp2 = req.body.otp;
        console.log(otp2 + email + otp);
        try {
          if (otp2 == otp) {
            const userData = await User.findOneAndUpdate(
              { email: email },
              { $set: { is_verified: true } }
            );
            console.log(userData);
            if (userData) {
             req.session.user_id =userData._id
              res.redirect("/");
            } else {
              res.render("verification",{ message: "please check the otp again" });
            }
          } else {
            res.render("verification", { message: "please check the otp again" });
          }
        } catch (error) {
          next(error)
        }
      };
      

      
  //--------- VERIFICATION LOAD ---------//
   const verificationLoad = async(req,res)=>{
    try {
        const session = req.session.user_id
        res.render('verification',{session})
    } catch (error) {
        console.log(error.message);
    }
   }


     //--------- LOAD SHOP ---------//
   const loadShop = async(req,res)=>{
    try {
        const productdata = await Product.find({is_delete:false})
        const categorydata = await Category.find({})
        const session = req.session.user_id
        const userData = await User.findById(session)
        res.render('shopPage',{
            session,
            productData:productdata,
            categoryData:categorydata,
            user:userData,
        });
    } catch (error) {
        console.log(error.message);
    }
   }


  //--------- VIEW SINGLE PRODUCT ---------//
  const SingleProduct = async(req,res,next)=>{
    try {
        const id = req.params.id
        const productData = await Product.findById(id)
        const session = req.session.user_id
        const userData = await User.findById(session)
        const Wishlist = await wishlist.find({
            userid: session,
            "products.productid":id
        });
        console.log(Wishlist);


        let checkWishlist = -1;

        if(Wishlist.length > 0){
            checkWishlist = Wishlist[0].products.findIndex(
                (wish)=> wish.productid == id
            );
        }
        console.log(checkWishlist);
        res.render('singleproduct',{
            session,
            user:userData,
            product:productData,
            wishlist:checkWishlist,
        })
    } catch (error) {
        console.log(error.message);
    }
  }


  const userProfile = async(req,res)=>{
    try {
        const session = req.session.user_id;
        const userData = await User.findById({ _id: req.session.user_id,session});
        res.render("userprofile", { user:userData, session });
    } catch (error) {
        console.log(error.message);
    }
  }


module.exports = {
    loadhome,
    loadLogin,
    userLogout,
    loadRegister,
    insertuser,
    verifylogin,
    verificationLoad,
    verifyEmail,
    loadShop,
    SingleProduct,
    userProfile,
}