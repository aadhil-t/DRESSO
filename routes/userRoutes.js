const express = require('express')
const userRoutes = express()

const userController = require('../Controllers/usercontroller');
const cartController = require('../Controllers/cart-controller');
const wishlistController = require("../Controllers/wishlistController")
const checkoutController = require("../Controllers/checkoutController")
const addressController = require('../Controllers/addressController')
const auth = require('../middleware/userAuth');


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
 

// ---------------- SHOP ROUTES --------------------//
 userRoutes.get('/shoppage',userController.loadShop)
 userRoutes.get('/singleproduct/:id',userController.SingleProduct)



// ---------------- CART ROUTES --------------------//
userRoutes.get("/cartPage", auth.isLogin, cartController.loadCart);
userRoutes.post("/addtocart", auth.isLogin, cartController.addtoCart);
userRoutes.post('/changeQuantity',auth.isLogin,cartController.changeProductCount);

// ---------------- WISHLIST ROUTES --------------------//
userRoutes.get('/wishlist',auth.isLogin,wishlistController.loadWishlist)
userRoutes.post('/addtoWishlist',wishlistController.addToWishlist)
userRoutes.get('/deleteSingleWishlist/:id',auth.isLogin,wishlistController.deleteSingleWishlist)


// ---------------- CHECKOUT ROUTES --------------------//
userRoutes.get('/checkoutPage',auth.isLogin,checkoutController.loadCheckout)


// ---------------- ADDRESS ROUTES --------------------//
userRoutes.get('/addAddress',auth.isLogin,addressController.loadUserAddress)
userRoutes.post('/addAddress',auth.isLogin,addressController.inserUserAddress)
userRoutes.get('/editaddress',auth.isLogin,addressController.editUserAddress)
userRoutes.post('/editaddress',auth.isLogin,addressController.updatedAddress)

module.exports = userRoutes;