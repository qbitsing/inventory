'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personaSchema = Schema({
  documento : {type : String , unique : true , required : true},
  nombre : String,
  direccion : String,
  telefono : Number,
  correo : {type : String , unique: true},
  contrasena : String
});

module.exports = mongoose.model('persona' , personaSchema);
