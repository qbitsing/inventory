'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CateriaSchema = new Schema({
    nombre : String,
    codigo: String
});


module.exports = mongoose.model('Categoria' , CateriaSchema);
