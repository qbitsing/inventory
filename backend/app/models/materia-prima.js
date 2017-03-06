'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const unidadModel = require('./unidades');
console.log(unidadModel);

const materia_primaSchema = Schema({
    nombre: String,
    unidad_medida: unidadModel,
    min_stock: Number,
    cantidad: Number
});

module.exports = mongoose.model('ciudades' , cuidadSchema);