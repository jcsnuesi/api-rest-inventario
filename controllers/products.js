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
                  
                    if (param.file0) {
                        prods.image = param.file0

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

         let token = 'Bearer v^1.1#i^1#p^3#r^0#I^3#f^0#t^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'

         
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



