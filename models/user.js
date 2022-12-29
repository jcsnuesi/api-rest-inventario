'use strict'
 var mongoose = require('mongoose')
 var mongooPaginate = require('mongoose-paginate-v2')
var Schema = mongoose.Schema


var UserSchema = Schema({

    name:String,
    surname:String,
    email:String,
    password:String,
    role:String,
    created_at: {type: Date, default: Date.now},
    changed_at: String,
    avatar: String
})

//Evitar que se muestre la clave al hacer consulta a mongodb


UserSchema.method.toJSON = function(){
    var obj = this.toObject()
    delete obj.password
    return obj
}

module.exports = mongoose.model('User', UserSchema);