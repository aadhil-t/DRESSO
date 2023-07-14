const express = require('express')
const adminRoutes = express()


// Admin Session //
const config = require('../configuration/configuration');
const session = require('express-session');
const auth = require('../middleware/adminAuth');
const adminController = require('../Controllers/admincontroller');
const categorycontroller = require('../Controllers/categorycontroller');
const prductController = require('../Controllers/productController');
const orderController = require('../Controllers/orderController')
const upload = require('../configuration/multerConfig');

adminRoutes.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:true,
}));



adminRoutes.set('view engine','ejs')
adminRoutes.set('views','./views/admin')




//----------------- ADMIN ROUTES ----------------------//
adminRoutes.get('/',auth.isLogout,adminController.loadLogin)
adminRoutes.post('/loginAdmin',adminController.verifyLogin)
adminRoutes.get('/userlist',auth.isLogin,adminController.loaduserlist)
adminRoutes.get('/dashboard',auth.isLogin,adminController.loadDashboard)
adminRoutes.get('/logout',adminController.adminLogout)
adminRoutes.get('/block',auth.isLogin,adminController.block)
adminRoutes.get('/unblock',auth.isLogin,adminController.unblock)

//----------------- CATEGORY ROUTES ----------------------//
adminRoutes.get('/categoryList',auth.isLogin,categorycontroller.loadCategory)
adminRoutes.post('/insert-category',categorycontroller.insertCategory)
adminRoutes.get('/deleteCategory',categorycontroller.deleteCategory)
adminRoutes.post('/editcategory',categorycontroller.updateCategory)

//----------------- PRODUCT ROUTES ----------------------//
adminRoutes.get('/productList',auth.isLogin,prductController.loadProduct)
adminRoutes.get('/addProduct',auth.isLogin,upload.upload.array('image',10),prductController.loadAddproduct)
adminRoutes.post('/addProduct',upload.upload.array('image',10),prductController.insertProduct)
adminRoutes.get('/editproduct/:id',auth.isLogin,prductController.loadEditProduct);
adminRoutes.post('/updateproduct/:id',prductController.updateProduct)
adminRoutes.get('/deleteProduct',auth.isLogin,prductController.deleteproduct)
adminRoutes.get("/deleteimg/:imageid/:productid", auth.isLogin, prductController.deleteimage);
adminRoutes.post('/updateimage/:id', upload.upload.array('image', 10), prductController.updateImage);


//----------------- PRODUCT ROUTES ----------------------//
adminRoutes.get("/adminOrderShow",auth.isLogin,orderController.adminOrderShowProfile)


module.exports = adminRoutes