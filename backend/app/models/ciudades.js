'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cuidadSchema = Schema({
  nombre : {
      type : String,
      required : 'el nombre de la cuidad es requido'
  },
  departamento : {
      type : String,
      required : [
          true,
          'el departamento de la cuidad es requido'
      ]
  },
  id : {
      type : Number,
      unique : true,
      required : [
          true,
          'el id de la cuidad es requido'
      ]
  }
});

module.exports = mongoose.model('cuidad' , cuidadSchema);