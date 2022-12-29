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
                    prods.image = !validator.isEmpty(fetch_prod.items[0].images) ? fetch_prod.items[0].images : " "

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
                    var keyOfDate = Object.keys(param)
                    var checkDates = ''
                    var dateVal;
                    
                    var expDateValidator = param[keyOfDate[keyOfDate.indexOf('expDate')]]
                    var mfdValidator = param[keyOfDate[keyOfDate.indexOf('mfd')]]

                    if (expDateValidator.length > 0) {
                         checkDates = keyOfDate[keyOfDate.indexOf('expDate')]
                         dateVal = param[keyOfDate[keyOfDate.indexOf('expDate')]]
                       
                    } else if (mfdValidator.length > 0) {

                       checkDates = keyOfDate[keyOfDate.indexOf('mfd')]
                       dateVal = param[keyOfDate[keyOfDate.indexOf('mfd')]]
                      
                    }else{
                        checkDates = keyOfDate[keyOfDate.indexOf('mfd')]
                        dateVal = new Date()
              
                    }

                    prods.userId = req.user.sub
                    prods.companyName = param.companyName
                    prods.descriptions = param.descriptions
                    prods.qty = param.qty
                    prods.expireDateOrmfd[checkDates] = dateVal
                    prods.upc = param.upc
                    prods.itemWeight = !validator.isEmpty(param.itemWeight) ? param.itemWeight : 0
                    prods.price = param.price
                  

                  
                    if (param.file0 || param.image) {
                        prods.image = param.file0 || param.image

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



                        if (fileExt != 'png' && fileExt != 'jpg' && fileExt != 'jpeg' && fileExt != 'gif') {

                            fs.unlink(imgPath, (err) => {

                                return res.status(400).send({

                                    status: 'Failed',
                                    message: err
                                })
                            })

                        } else {

                            var imgPath = req.files.file0.path
                            var splitpath = imgPath.split('\\')
                            var filename = splitpath[3]

                            var expSplit = filename.split('\.');
                            var fileExt = expSplit[1]

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

    getProducts: function(req, res){

        Prod.find((err, prods) => {

            if (err) {

                return res.status(500).send({
                    status: "error",
                    message: "Internal error."
                })
                
            }


            if (!prods) {

                return res.status(404).send({
                    status: "error",
                    message: "There is not products to show."
                })

            }

            return res.status(200).send({
                status: "success",
                prod: prods
            })
        })


    },

    getProductsImg: function(req, res){

        let img = req.params.img
      
        
        let filePath = './uploads/users/products/' + img
        
        fs.exists(filePath,(exist)=>{
          
            if (exist) {

                return res.sendFile(path.resolve(filePath));
                
            } else {
                return res.status(404).send({
                    message: "Imagen no existe."
                })
            }
        })




    },

     updateItem:function (req, res) {

    var param = req.body
        
        try {
        
            var valuser = !validator.isEmpty(req.user.sub)
            var comNameVal = !validator.isEmpty(param.companyName)
            var upcval = !validator.isEmpty(param.upc)
            
        } catch (error) {

            return res.status(500).send({
                status:'error',
                message:'Existen datos que no estan siento enviados, completelos!'
            })
            
        }
        
         if (valuser && comNameVal && upcval) {

             Prod.findOne({ _id: param.id }, (err, found) =>{

              
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

                    //Actualizar la fecha segun su origen ej. exp date. tiene valor entonces mfd tiene que ser un string vacio
                       
                 if (param['expireDateOrmfd.mfd'] && param['expireDateOrmfd.mfd'] != undefined) {

                     
                     param['expireDateOrmfd.expDate'] = ""

                    
                }
                 if (param['expireDateOrmfd.expDate'] && param['expireDateOrmfd.expDate'] != undefined) {


                     param['expireDateOrmfd.mfd'] = ""


                 }
                            
                    
                 Prod.findOneAndUpdate({ _id: param.id }, param, {new:true}, (err, updated) => {

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
                    status: 'deleted',
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

    itemPic: function (req, res) {

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



        }

        return res.status(200).send({
            status:"success",
            response: filename
        })
    },

  
     search: function(req, res) {

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
        
     },
    getPagination: function (req, res) {

        let param = req.params.page
       
        
        if (!param || param == null || param == undefined || param == 0 || param == "0") {
            var page = 1
        } else {
            var page = req.params.page
        }

        //Indicar las opciones de paginacion
        var options = {
            sort: { des: -1 },
            populate: 'userId',
            limit: 5,
            page: parseInt(page) 

        }

        
        Prod.paginate({}, options, (err, prodPag) => {
           
           
           
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al hacer la consulta'
                });
            }

            if (!prodPag) {

                return res.status(500).send({
                    status: 'error',
                    message: 'No hay productos'
                });

            }

           prodPag.docs[0].userId.password = null
            //Devolver resultado (products, total de products, total de paginas)
            return res.status(200).send({
                status: 'success',
                products: prodPag.docs,
                totalDocs: prodPag.totalDocs,
                totalPages: prodPag.totalPages
            });
        })

    }
     ,
     ebaySearch:async function(req, res){

         let token = 'Bearer v^1.1#i^1#f^0#p^3#I^3#r^0#t^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'

         
         let param = req.params.findig
         
         let prodFound = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${param}&limit=10`, {method: 'get',
                    headers:{
                        'Authorization': token, 'Content-Type': 'application/json'
                        }})
         .then(resp => resp.json())
         .then(found =>  {return found})
         .catch(noFound =>  console.log(noFound))

       

         if (prodFound.total > 0) {
             return res.status(200).send({
                 status: 'success',
                 prodFound
             })
         }else{

             return res.status(404).send({
                 status: 'error',
                 message:'Item was not found'
             })
         }
         


    }
    

}


module.exports = prod_controller



