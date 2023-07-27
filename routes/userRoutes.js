const express = require('express')
const userRoutes = express()

const userController = require('../Controllers/usercontroller');
const cartController = require('../Controllers/cart-controller');
const wishlistController = require("../Controllers/wishlistController")
const checkoutController = require("../Controllers/checkoutController")
const addressController = require('../Controllers/addressController')
const orderController = require('../Controllers/orderController')
const couponController = require('../Controllers/couponController')

const auth = require('../middleware/userAuth');
const errorHandler = require('../middleware/errorHandller')

const { isLogin } = require('../middleware/adminAuth');


userRoutes.use(express.json());
userRoutes.use(express.urlencoded({extended:true}))



//------------- view engine -------------//
userRoutes.set('view engine','ejs')
userRoutes.set('views','./views/user')


// ---------------- USER ROUTES --------------------//
userRoutes.get('/',userController.loadhome)
userRoutes.get('/login',auth.isLogout,userController.loadLogin)
userRoutes.get('/logout',userController.userLogout)
userRoutes.post('/login',userController.verifylogin)
userRoutes.get('/registration',userController.loadRegister)
userRoutes.post('/registration',userController.insertuser)

userRoutes.get('/userProfile',auth.isLogin,userController.userProfile)

userRoutes.get('/verification',userController.verificationLoad)
userRoutes.post('/verifyEmail',userController.verifyEmail)
userRoutes.get("/forgotPassword", userController.forgotPassword);
userRoutes.post('/forgotPassword',userController.forgotVerifyMail)
userRoutes.post('/verifyForgot',userController.verifyForgotMail)
userRoutes.post('/resubmitPassword',userController.resubmitPassword)
 

// ---------------- SHOP ROUTES --------------------//
 userRoutes.get('/shoppage',userController.loadShop)
 userRoutes.get('/singleproduct/:id',userController.SingleProduct)


// ---------------- CART ROUTES --------------------//
userRoutes.get("/cartPage", auth.isLogin, cartController.loadCart);
userRoutes.post("/addtocart", auth.isLogin, cartController.addtoCart);
userRoutes.post('/changeQuantity',auth.isLogin,cartController.changeProductCount);
userRoutes.post('/deletecart',auth.isLogin,cartController.deleteCart);


// ---------------- WISHLIST ROUTES --------------------//
userRoutes.get('/wishlist',auth.isLogin,wishlistController.loadWishlist)
userRoutes.post('/addtoWishlist',wishlistController.addToWishlist)
userRoutes.get('/deleteSingleWishlist/:id',auth.isLogin,wishlistController.deleteSingleWishlist)


// ---------------- CHECKOUTC ROUTES --------------------//
userRoutes.get('/checkoutPage',auth.isLogin,checkoutController.loadCheckout)


// ---------------- ORDER ROUTES --------------------//
userRoutes.post('/checkoutPage',auth.isLogin,orderController.placeOrder)
userRoutes.get('/orderSuccess/:id',auth.isLogin,orderController.orderSuccessPage)

userRoutes.get('/orderProfileShow',auth.isLogin,orderController.orderShowProfile)
userRoutes.get('/singleOrderShow/:id',auth.isLogin,orderController.singleOrderProfileShow)
userRoutes.post('/returnOrder',orderController.returnOrder);
userRoutes.post('/cancelOrder',orderController.cancelOrder)
userRoutes.post('/verify-payment',auth.isLogin,orderController.verifyPayment)


// ---------------- ADDRESS ROUTES --------------------//
userRoutes.get('/addAddress',auth.isLogin,addressController.loadUserAddress)
userRoutes.post('/addAddress',auth.isLogin,addressController.inserUserAddress)
userRoutes.get('/editaddress',auth.isLogin,addressController.editUserAddress)
userRoutes.post('/editaddress',auth.isLogin,addressController.updatedAddress)
userRoutes.post('/deleteaddress',auth.isLogin,addressController.deleteAddress)
userRoutes.get('/profileAddress',auth.isLogin,addressController.showAddress)

userRoutes.post('/addProfileAddress',addressController.inserprofileAddress)
userRoutes.get('/addProfileAddress',auth.isLogin,addressController.loadprofileAddress)
userRoutes.get('/editProfileaddress',auth.isLogin,addressController.editProfileAddress)
userRoutes.post('/editProfileaddress',addressController.updatedprofileAddress)

userRoutes.post('/applyCoupon',couponController.applyCoupon)


userRoutes.use(errorHandler)
module.exports = userRoutes;

