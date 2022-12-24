'use strict'

let validator =  require('validator');
let bcrypt = require('bcrypt');
let saltRounds = 10;
let User = require('../models/user');
let jwtoken = require('../services/jwt')
let fs = require('fs')
var path = require('path');

var controller = {


    probar: function(req, res){

        return res.status(200).send({
            message: "Test passed!"
        })
    },

    register: function(req, res){

        //Recoger los datos
        var param = req.body
      
        //Validar no falten datos
        try {

           var val_name = !validator.isEmpty(param.name)
           var val_surname = !validator.isEmpty(param.surname)
           var val_email = validator.isEmail(param.email)
           var val_pass = !validator.isEmpty(param.password)
       

            
        } catch (error) {

            //Devolver respuesta
            return res.status(500).send({
                message: "La validacion fue incorrecta"

            });
           
            
        }

        if (val_name && val_surname && val_email && val_pass) {
            
            //Crear el objecto de usuario
            var new_user = new User();

            //Asignar valores a nuevo usuario
            new_user.name = param.name
            new_user.surname = param.surname
            new_user.user = param.user
            new_user.email = param.email
            new_user.role = param.role || 'USER_ROLE'
            new_user.avatar = null;

            //Comprobar que no existe en la BD.
            User.findOne({email:param.email}, (err, user) =>{

                if (err) {
                    return res.status(500).send({
                        status:'error',
                        message:'Error al crear usuario'
                    })
                }

                if (user) {

                    return res.status(500).send({
                        status: 'error',
                        message: 'Usuario registrado'
                    })

                    
                }

                if (!user) {

                //Cifrar la clave

                bcrypt.hash(param.password, saltRounds, (err, hash) => {
                new_user.password = hash

                    if (err) {
                        
                        return res.status(500).send({
                            status: 'error',
                            message: 'No se realizo la encryptacion.'
                        })
                    }

                    new_user.save((err, newUser) => {

                        if (err) {
                            return res.status(500).send({
                                message: "Error al guardar el usuario."
                            });
                        }

                        if (!newUser) {
                            return res.status(400).send({
                                message: "El usuario no se ha guardado."
                            });
                        }

                        //Devolver respuesta(nuevo usuario)
                        return res.status(200).send({
                            status: 'success',
                            user: newUser
                        });


                    })



                })


                }

            })

                
        }else{

            //Devolver respuesta
            return res.status(500).send({
                message: "La validacion fue incorrecta"

            });
        }
        

      
    },
    login: function(req, res) {

        var param =  req.body;
   
        try {
            var val_email = validator.isEmail(param.email)
            var val_password = !validator.isEmpty(param.password)

        } catch (error) {
            return res.status(500).send({
                message: "La validacion fue incorrecta"

            });
        }

        if (!val_email || !val_password) {

            return res.status(200).send({
                message: "Datos suministrados de manera incorrecta!!"
            });

        }

        //Buscar usuarios que coincidan con el email
        User.findOne({email:param.email}, (err, login) => {

            if (err) {

                return res.status(500).send({
                    status:'error',
                    message: 'Error en la BD usuario'   
                })
                
            }

            if (!login){

                return res.status(500).send({
                    status: 'error',
                    message: 'Usuario no existe en la BD.'
                })

            }

            bcrypt.compare(param.password, login.password, (err, verified)=>{

                //Si es correcto
                if (verified) {

                     //Generar token jwt y devolverlo
                     if (param.gettoken) {
                        return res.status(200).send({
                            token: jwtoken.createToken(login)

                        })
                        
                     } else {
                         //Limpiar el objeto para que no se muestre el resultado de la password
                         login.password = undefined;
                         //Devolver datos
                         return res.status(200).send({

                             login

                         });
                     }
                    
                }else{

                    return res.status(200).send({
                        message: "Las credenciales no son correctas."
                    });
                }
            })


        })


    },
    update: function(req, res){

        var param = req.body;
        
        try {
           var val_user = !validator.isEmpty(req.user.sub)
           var val_pass = !validator.isEmpty(param.password)
           var val_email = validator.isEmail(param.email)
        } catch (error) {

            return res.status(500).send({
                status: 'error',
                message:'Validacion corrompida.'
            })
            
        }

        //Eliminar propiedades innecesarias
        delete param.password

        var userId = req.user.sub

        // Comprobar si el email es unico

        if (req.user.email != param.email) {

            User.findOne({ email: param.email.toLowerCase() }, (err,user) => {

                if (!user) {
                    
                    return res.status(500).send({
                        message: "Email no existe, no se puede actualizar."
                    });
                }else{

                    if (err) {

                        return res.status(500).send({
                            message: "Error de autenticacion."
                        });
                        
                    }

                    if (user && user.email == param.email) {
                        
                        return res.status(500).send({
                            message: "El email no puede ser modificado."

                        });
                    }
                }


            })
            
        }else{

        //Buscar y actualizar documento
        // User.findOneAndUpdate(condicion, datos a actualizar, opciones, callback)

        User.findOneAndUpdate({_id: userId}, param, {new:true}, (err,userUpdated) => {
            
            if (err) {

                return res.status(500).send({
                    status: 'error',
                    message: 'Error al actualizar usuario'
                });
                
            }

            if (!userUpdated) {

                return res.status(500).send({
                    status: 'error',
                    message: 'Usuario no actualizado'
                });
                
            }

            //Devolver respuesta
            return res.status(200).send({
                status: 'success',
                user: userUpdated
            });
        })

        }

    },

    uploadAvatar: function(req, res){

        var fileName = 'Avano no subido...'

        if (!req.files.file0.originalFilename) {

            return res.status(404).send({
                status:'error',
                message:fileName
            })
            
        }
         //Conseguir el nombre y la extension del archivo subido

        var filePath = req.files.file0.path;
        var fileSplit = filePath.split('\\');

        var fileName = fileSplit[2];
       
        //Extension del archivo ***OJO se poner  split('\.') con la diagonal invertida para indicar que vamos a salir luego del signo siguiente a esta.

        var expSplit = fileName.split('\.');
        var fileExt = expSplit[1]

        if (fileExt != 'png' && fileExt != 'jpg' && fileExt != 'jpeg' && fileExt != 'gif') {

            fs.unlink(filePath, (err) => {

                return res.status(400).send({

                    status:'Failed',
                    message:err
                })
            })


            
        }else{
     //Sacar el id del usuario identificado

     var userId =  req.user.sub
            
     User.findOneAndUpdate({_id: userId}, {avatar:fileName}, {new:true}, (err,userUp) => {
         
         if (err || !userUp) {

             return res.status(500).send({
                 status: 'error',
                 mesage: 'Error al subir la imagen'

             });
            
        }

         //Devolver respuesta
         return res.status(200).send({
             status: 'success',
             user: userUp

         });
     } )


        }



    },
    getavatar: function(req, res){

        var filename = req.params.filename
        var pathfile = './uploads/users/'+filename

        fs.exists(pathfile, (exists) =>{

            if (exists) {
                return res.sendFile(path.resolve(pathfile))
            }else{

                return res.status(404).send({
                    message:"Imagen no existe."
                })
            }
           
        })
    },

    getUsers:function(req, res){

        
        User.find().exec((err,users) => {
            console.log(users)
            if (err || !users) {
                return res.status(404).send({
                    status:'error',
                    message:'No hay usuarios para mostrar'
                })
            }

            return res.status(200).send({
                status:'succes',
                users: users
            })
        })
        

    },
    getUserById: function (req, res) {

        var userId = req.params.id;

        User.findOne({ _id: userId }).exec((err, users) => {
            if (err || !users) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay usuarios para mostrar'
                })
            }

            return res.status(200).send({
                status: 'succes',
                users: users
            })
        })


    }




}

module.exports = controller