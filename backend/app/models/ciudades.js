'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cuidadSchema = Schema({
  nombre : String,
  departamento : Number,
  id : Number
});

module.exports = mongoose.model('ciudades' , cuidadSchema);