'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departamentoSchema = Schema({
  nombre : {
      type : String,
      required : 'el nombre del departamento es requerido'
  },
  pais : {
      type : {},
      default:{
          id : 170,
          nombre : "COLOMBIA"
      }
  },
  id : {
      type : Number,
      unique : true,
      required : [
          true,
          'el id del departamento es requerido'
      ]
  }
});
module.exports = mongoose.model('departamentos' , departamentoSchema);