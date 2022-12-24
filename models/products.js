'use strict'

var mongoose =  require('mongoose')
var Schema = mongoose.Schema
var mongoosePagination = require('mongoose-paginate-v2')


var ProdSchema = Schema({

    userId: { type: 'objectId', ref: 'User' },
    companyName:String,
    descriptions:String,
    qty:Number,
    expireDateOrmfd:
        { expDate: Date || String, mfd: Date },
    upc: String,
    itemWeight: mongoose.Decimal128,
    price: mongoose.Decimal128,
    image: []

})
//Cargar paginacion
ProdSchema.plugin(mongoosePagination)



module.exports = mongoose.model('Productos', ProdSchema);