'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('../utils/auto-increment.js');

const salidaSchema = new Schema({
    productos: [],
    materia_prima: [],
    fabricacion: {},
    estado: String,
    fecha: {type: Date, defalut: Date.now()},
    salida_fabricacion_consecutivo: Number
});

salidaSchema.plugin(autoIncrement.plugin, {
    model: 'fabricacioninsumos',
    field: 'salida_fabricacion_consecutivo',
    startAt: 1000,
    incrementBy: 1
});

module.exports = mongoose.model('fabricacioninsumos', salidaSchema);