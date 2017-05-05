'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('../utils/auto-increment.js');


const entradaSchema = new Schema({
    orden_compra:{},
    persona_entrada: {},
    observaciones: String,
    fecha: {type: Date, default: Date.now()},
    entrada_consecutivo: Number
});

entradaSchema.plugin(autoIncrement.plugin, {
    model: 'entrada',
    field: 'entrada_consecutivo',
    startAt: 1000,
    incrementBy: 1
});

module.exports = mongoose.model('entrada', entradaSchema);