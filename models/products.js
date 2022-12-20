'use strict'

var mongoose =  require('mongoose')
var Schema = mongoose.Schema


var ProdSchema = Schema({

    userId: String,
    companyName:String,
    descriptions:String,
    qty:Number,
    expDate: Date,
    mfd:String,
    upc: String,
    itemWeight: mongoose.Decimal128,
    price: mongoose.Decimal128,
    image: []




})

module.exports = mongoose.model('Productos', ProdSchema);