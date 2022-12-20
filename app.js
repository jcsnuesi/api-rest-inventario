'use strict'

var express = require('express')
var bodyparser = require('body-parser')

var app = express();

//Cargar archivos de rutas
var user_routes =  require('./routes/user')
var products_routes = require('./routes/products')

//Middlewares
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//CORS
app.use((req, res, next) => {
    
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Rquested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
})

// app.get('/', (req, res)=>{
//    return res.status(200).send({
//     "status":"Very good!"
//    })
// })
//Reescribir rutas
app.use('/api', user_routes)
app.use('/api', products_routes)

module.exports = app;