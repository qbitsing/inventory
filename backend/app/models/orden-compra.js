'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('../utils/auto-increment').init();


const ordenCompraSchema = new Schema({
    proveedor: {},
    productos: [],
    orden_compra_consecutivo: {type: Number},
    materia_prima: [],
    observaciones: String,
    estado: {type: String , enum:['Activo' , 'Finalizado', 'Con Entradas'], default: 'Activo'},
    fecha: {type: Date, default: Date.now()}
});

ordenCompraSchema.plugin(autoIncrement.plugin, {
    model: 'orden_compra',
    field: 'orden_compra_consecutivo',
    startAt: 1000,
    incrementBy: 1
});

module.exports = mongoose.model('orden_compra', ordenCompraSchema);