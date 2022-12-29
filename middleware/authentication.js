'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')

var secret = "mi-clave-secreta-123456"

//En este caso usaremos tres parametros por tratarse de un middleware, los parametros son: request, response y next, el next es para permitir que le proceso continue luego de que cumpla con las condiciones correspondientes.

exports.authenticated = function (req, res, next) {

        //Comprobar si llega autorizacion

        if (!req.headers.authorization) {

            return res.status(403).send({

                message:"La peticion no cuenta con la autorizacion correspondiente."
            })
            
        }

     //Limpiar el token y quitar comillar

     var token = req.headers.authorization.replace(/['"]+/g,'')

     try {
        //Decodificar el token
        var payload = jwt.decode(token,secret)

        //Comprobar si el token han expirado

        if (payload.exp <= moment().unix()) {

            return res.status(404).send({
                message:"El token ha expirado."
            })
            
        }
     } catch (error) {

         return res.status(404).send({
             message: "El token no es valido."
         })

        
     }

       //Adjuntar usuario identificado a la request

       req.user = payload;


    //Pasar a la accion

    next();



    
}