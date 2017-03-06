'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materia_primaSchema = Schema({
    nombre: String,
    unidad_medida: {},
    min_stock: Number,
    cantidad: Number
});

module.exports = mongoose.model('ciudades' , cuidadSchema);