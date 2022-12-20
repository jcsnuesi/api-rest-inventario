'use strict'

const mongoose = require('mongoose');
var app = require('./app')
var port = process.env.PORT || 3990

mongoose.Promise = global.Promise

mongoose.connect('mongodb://127.0.0.1:27017/api-inv', {useNewUrlParser: true})
        .then(() => {
            console.log('Conectado a la BD!')

            app.listen(port, ()=>{
                console.log('Servidor corriendo.')
            })
        }).catch(error => console.log(error))