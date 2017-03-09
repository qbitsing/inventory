'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materia_primaSchema = Schema({
    nombre: String,
    unidad_medida: {},
    min_stock: Number,
    cantidad: Number,
    marca: String
});

module.exports = mongoose.model('materia_prima' , materia_primaSchema);