'use strict'

var validator = require('validator')
var path = require('path')
var Prod = require('../models/products')
const fetch = require('node-fetch')
const fs = require('fs')
const cheerio = require('cheerio')
var items = []

var prod_controller = {

    probador: function(req, res){

        return res.status(200).send({messange:"It WORKS!"})
    }, 
   
    getupc:async function(req, res){
       
        var code = req.params.id  
        var method = ['search?s=','lookup?upc=']     //https://api.upcitemdb.com/prod/trial/search?s=
      
        const fetch_prod = await fetch(`https://api.upcitemdb.com/prod/trial/${method} ${code}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {return data})
        .catch(err => console.log(err))

        
        Prod.findOne({upc: code}, (err, itemFound) => {

            if (err) {

                return res.status(500).send({
                    status:'error',
                    message: err
                })
                
            }

            if (itemFound) {

                return res.status(200).send({
                    status: 'success',
                    message: itemFound
                })
                
            }

            if (!itemFound) {

                console.log(fetch_prod.code)

                if (fetch_prod.code != "INVALID_UPC" && fetch_prod.code != 'NOT_FOUND') {

                    var prods = new Prod();

                    prods.userId = req.user.sub
                    prods.companyName = fetch_prod.items[0].brand
                    prods.descriptions = fetch_prod.items[0].title
                    prods.qty = 0
                    prods.expDate = new Date()
                    prods.mfd = ""
                    prods.upc = code
                    prods.itemWeight = !validator.isEmpty(fetch_prod.items[0].weight) ? fetch_prod.items[0].weight : 0
                    prods.price = 0.0
                    prods.image = !validator.isEmpty(fetch_prod.items[0].weight) ? fetch_prod.items[0].weight : " "

                    prods.save((err, newItem) => {

                        if (err) {

                            return res.status(500).send({
                                status: 'error',
                                message: err
                            })

                        }

                        if (newItem) {
                            return res.status(200).send({
                                status: 'success',
                                item: newItem
                            })
                        }

                    })
                    
                }else{

                    return res.status(500).send({
                        status: 'error',
                        message: 'Item is not in our records'
                    })
                }
                

            }
        })
        
      
      
    },
    addItem: function (req, res) {
        var param = req.body
      
        try {
            var val_companyName = !validator.isEmpty(param.companyName)
            var val_descriptions = !validator.isEmpty(param.descriptions)
            var val_upc = !validator.isEmpty(param.upc)
         
        } catch (error) {

            return res.status(500).send({
                status: 'error',
                message:"Complete los campos requeridos"

            })


        }

        if (val_companyName && val_descriptions && val_upc) {

         
            Prod.findOne({
                "$or": [

                    { "companyName": param.descriptions },
                    { "upc": param.upc },

                ]
            })
                .exec((err, item) => {
                
                if (err) {

                    return res.status(500).send({
                        status: 'error',
                        message: err
                    })

                }

                if (item) {

                    return res.status(500).send({
                        status: 'error',
                        message: 'Este articulo se encuentra registrado.'
                    })

                }

                if (!item) {

                    var prods = new Prod();

                    prods.userId = req.user.sub
                    prods.companyName = param.companyName
                    prods.descriptions = param.descriptions
                    prods.qty = param.qty
                    prods.expDate = !validator.isEmpty(param.expDate) ? param.expDate : new Date()
                    prods.mfd = param.mfd
                    prods.upc = param.upc
                    prods.itemWeight = !validator.isEmpty(param.itemWeight) ? param.itemWeight : 0
                    prods.price = 0.0

                    if (!req.files.file0.originalFilename) {

                        prods.image = ""

                    }else{

                        var imgPath = req.files.file0.path
                        var splitpath = imgPath.split('\\')
                        var filename = splitpath[3]

                        var expSplit = filename.split('\.');
                        var fileExt = expSplit[1]
                       
                        if (fileExt != 'png' && fileExt != 'jpg' && fileExt != 'jpeg' && fileExt != 'gif') {

                            fs.unlink(imgPath, (err) => {

                                return res.status(400).send({

                                    status: 'Failed',
                                    message: err
                                })
                            })

                        } else {

                            prods.image = filename
                            prods.save((err, newItem) => {

                                if (err) {

                                    return res.status(500).send({
                                        status: 'error',
                                        message: err
                                    })

                                }

                                if (newItem) {
                                    return res.status(200).send({
                                        status: 'success',
                                        item: newItem
                                    })
                                }

                            })

                        }


                    }
                   
                    
                }



            })

           
           

        }else {

            return res.status(500).send({
                status: "error",
                message: "Complete todos los campos correctamente."
            })
        }



    },
     updateItem:function (req, res) {

    var param = req.body
        
        try {
        
            var valuser = !validator.isEmpty(req.user.sub)
            var desval = !validator.isEmpty(param.descriptions)
            var upcval = !validator.isEmpty(param.upc)
            
        } catch (error) {

            return res.status(500).send({
                status:'error',
                message:'Existen datos que no estan siento enviados, completelos!'
            })
            
        }
         console.log(valuser, desval, upcval)
        if (valuser && desval && upcval) {

            Prod.findOne({upc: param.upc}, (err, found) =>{

                    if (err) {

                        return res.status(500).send({
                            status: 'error'
                        })
                        
                    }

                    if (!found) {
                        return res.status(500).send({
                            status: 'error',
                            message:'No existe en base de datos.'
                        })
                        
                    }

               Prod.findOneAndUpdate({upc:param.upc}, param, {new:true}, (err, updated) => {

                    if (err) {

                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al actualzar registro.'
                        })
                        
                    }
                   if (!updated) {

                       return res.status(404).send({
                           status: 'error',
                           message: 'No exite para ser actualizado.'
                       })

                   }

                   return res.status(200).send({
                       status: 'success',
                       updated
                   })
               })



            })


            
        }else{

            return res.status(500).send({
                status: 'error',
                message: 'Campos requeridos vacios.'
            })
        }
        
     },

     deleteItem: function(req,res){

        var itemId = req.params.id


            Prod.deleteOne({ _id: itemId }, (err, deleted) => {

                if (err) {

                    return res.status(500).send({
                        status: 'error',
                        message: 'Registro no pudo ser eliminado.'
                    })
                    
                }

                return res.status(200).send({
                    status: 'success',
                    deleted
                })
            })
                  
     },
     updateImage: function(req, res){

         var param = req.body

         var imgPath = req.files.file0.path
         var splitpath = imgPath.split('\\')
         var filename = splitpath[3]

         var expSplit = filename.split('\.');
         var fileExt = expSplit[1]

         if (fileExt != 'png' && fileExt != 'jpg' && fileExt != 'jpeg' && fileExt != 'gif') {

             fs.unlink(filePath, (err) => {

                 return res.status(400).send({

                     status: 'Failed',
                     message: err
                 })
             })



         } else {
             
             var control = param._id == undefined ? " " : param._id
            
             if (!validator.isEmpty(control)) {

             Prod.findOne({ _id: param }, (err, item) => {

                if (err) {

                    return res.status(500).send({
                        status: 'error'
                    })
                    
                }
                 if (!item) {

                     return res.status(500).send({
                         status: 'error',
                         message:'No se encuentra en la BD.'
                     })

                 }
               

                 Prod.findOneAndUpdate({ _id: param._id }, { image: filename },{new:true}, (err,img) => {

                    if (err) {
                        return res.status(500).send({
                            status: 'error'
                        })
                    }

                     return res.status(200).send({
                         status: 'success',
                         image:img
                     })
                 })
             })


            
         }else{

             return res.status(500).send({
                 status: 'error',
                 message:"No se encontro la imagen en el registro"
             })

         }

     }
     },

  
     search: function (req, res) {

        var keyword = req.params.prod

        Prod.find({ "$or" : [
            {"companyName" : {"$regex": keyword, "$options": "i"}},
            { "upc": { "$regex": keyword, "$options": "i" } },
           
        ]})
        .sort([['descending']])
        .exec((err, prods) => {
           
            if (err) {

                return res.status(500).send({
                    status: 'error',
                    message: "Hubo un error en la busqueda"
                })
                
            }

            if ( prods.length == 0 ) {

                return res.status(500).send({
                    status: 'error',
                    message: "No se encuentra en la base de datos"
                })
                
            }

            return res.status(200).send({
                status: 'success',
                prods
            })
        })
        
     }

}

module.exports = prod_controller

