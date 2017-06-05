'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('../utils/auto-increment').init();

const entradaRemisionSchema = new Schema({
    fecha: {type: Date, default: Date.now()},
    remision: {},
    fabricacion: {},
    productos: [],
    estado:{type: String, enum:['Cancelada']},
    entrada_remision_consecutivo: Number,
    asunto: String,
    typeRemision: {type: Boolean, default: false}
});

entradaRemisionSchema.plugin(autoIncrement.plugin, {
    model: 'entradaremision',
    field: 'entrada_remision_consecutivo',
    startAt: 1000,
    incrementBy: 1
});

module.exports = mongoose.model('entradaremision', entradaRemisionSchema);


