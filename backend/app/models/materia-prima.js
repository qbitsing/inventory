'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('../utils/auto-increment');

const materia_primaSchema = new Schema({
    nombre: String,
    unidad_medida: {},
    min_stock: Number,
    cantidad: {type: Number , default: 0},
    marca: String,
    materia_consecutivo: Number
});

materia_primaSchema.plugin(autoIncrement.plugin, {
    model: 'materia_prima',
    field: 'materia_consecutivo',
    startAt: 1000,
    incrementBy: 1
});
module.exports = mongoose.model('materia_prima' , materia_primaSchema);