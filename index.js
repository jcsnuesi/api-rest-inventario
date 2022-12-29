'use strict'

const mongoose = require('mongoose');
var app = require('./app')
var port = process.env.PORT || 3990

mongoose.Promise = global.Promise

//Importar variable de entorno locales
require('dotenv').config({ path:'variables.env'})

//Leer localhost de variables y puerto
const host = process.env.HOST || '0.0.0.0'

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true})
        .then(() => {
            console.log('Conectado a la BD!')

            app.listen(port, host, ()=>{
                console.log('Servidor corriendo.')
            })
        }).catch(error => console.log(error))