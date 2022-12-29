'use strict' 

var express = require('express')
var ProdController = require('../controllers/products')
var md_auth =  require('../middleware/authentication')

var multiparty = require('connect-multiparty');
var md_load = multiparty({ uploadDir: './uploads/users/products' })


var router = express.Router()

//RUTAS GET 


router.get('/probadora', ProdController.probador)
router.get('/codeupc/:id', md_auth.authenticated, ProdController.getupc)
router.get('/find-prod/:prod', ProdController.search)
router.get('/get-products', ProdController.getProducts)
router.get('/prod-img/:img', ProdController.getProductsImg);
router.get('/ebay-search/:findig', ProdController.ebaySearch);
router.get('/prod-page/:page', ProdController.getPagination);


//RUTAS POST

router.post('/additem',[md_auth.authenticated, md_load], ProdController.addItem )
router.post('/update-img', [md_auth.authenticated, md_load], ProdController.updateImage)
router.post('/item-img', [md_auth.authenticated, md_load], ProdController.itemPic)

//RUTAS PUT

router.put('/update-item',md_auth.authenticated, ProdController.updateItem)
 
//RUTAS DELETE

router.delete('/delete/:id', md_auth.authenticated, ProdController.deleteItem)

module.exports = router