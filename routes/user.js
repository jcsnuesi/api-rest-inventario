'use strict'
 
//Creamos el router de express
var express = require('express');
var userController = require('../controllers/user')
var md_auth = require('../middleware/authentication')

var multiparty = require('connect-multiparty');
const controller = require('../controllers/user');
var md_load = multiparty({uploadDir:'./uploads/users'})

var router = express.Router()

router.get('/prueba', userController.probar)
router.get('/avatar/:filename', controller.getavatar)
router.get('/users', userController.getUsers)
router.get('/user/:id', userController.getUserById)


// RUTAS ***POST


router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/upload-avatar',[md_load, md_auth.authenticated], userController.uploadAvatar)


// RUTAS ***PUT

router.put('/update_user', md_auth.authenticated, userController.update)


//Exportamos todas las rutas

module.exports = router