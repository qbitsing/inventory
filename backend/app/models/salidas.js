'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('../utils/auto-increment');



const salidaSchema = new Schema({
    orden_venta:{},
    persona_entrada: {},
    observaciones: String,
    fecha: {type:Date, default: Date.now()},
    salida_consecutivo: Number,
    contenido: String,
    generado: {}
});

salidaSchema.plugin(autoIncrement.plugin, {
    model: 'salida',
    field: 'salida_consecutivo',
    startAt: 1000,
    incrementBy: 1
});



module.exports = mongoose.model('salida', salidaSchema);
