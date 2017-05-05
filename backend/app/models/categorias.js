'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('../utils/auto-increment.js');

const CateriaSchema = new Schema({
    nombre : String,
    codigo: String
});

CateriaSchema.plugin(autoIncrement.plugin, {
    model: 'Categoria',
    field: 'codigo',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('Categoria' , CateriaSchema);
