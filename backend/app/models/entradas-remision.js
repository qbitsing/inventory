'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('../utils/auto-increment');

const entradaRemisionSchema = new Schema({
    fecha: {type: Date, default: Date.now()},
    remision: {},
    fabricacion: {},
    productos: [],
    estado:{type: String, enum:['Cancelada']},
    consecutivo: Number,
    asunto: String,
    typeRemision: {type: Boolean, default: false}
});

entradaRemisionSchema.plugin(autoIncrement.plugin, {
    model: 'entradaremision',
    field: 'consecutivo',
    startAt: 1000,
    incrementBy: 1
});

module.exports = mongoose.model('entradaremision', entradaRemisionSchema);


