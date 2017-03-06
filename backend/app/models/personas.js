'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ciudadModel = require('./ciudades');

const personaSchema = Schema({
  documento : {
    type : String,
    unique : [
      true, 
      'el documento debe ser unico'
    ], 
    required : true, 
  },
  nombre : String,
  direccion : String,
  telefono : Number,
  correo : {
    type : String, 
    unique : true, 
    required : [
      true, 
      'el correo es requerido'
    ]
  },
  contrasena : String,
  rol : Array,
  ciudad : String,
  contacto: String,
  fax : String,
  cargo: String
});

module.exports = mongoose.model('persona' , personaSchema);
