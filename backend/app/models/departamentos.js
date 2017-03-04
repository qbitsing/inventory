'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departamentoSchema = Schema({
  nombre : {
      type : String,
      required : 'el nombre del departamento es requido'
  },
  pais : {
      type : Number,
      required : [
          true,
          'el pais del departamento es requido'
      ]
  },
  id : {
      type : Number,
      unique : true,
      required : [
          true,
          'el id del departamento es requido'
      ]
  }
});

module.exports = mongoose.model('departamentos' , departamentoSchema);