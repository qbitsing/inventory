'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personaSchema = Schema({
  documento : {type : String , unique : true , index : true},
  nombre : String,
  direccion : String,
  telefono : Number,
  correo : String,
  contrasena : String
});

module.exports = mongoose.model('persona' , personaSchema);
