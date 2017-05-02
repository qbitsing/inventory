'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordenCompraSchema = new Schema({
    proveedor: {},
    productos: [],
    consecutivo: {type: Number},
    materia_prima: [],
    observaciones: String,
    estado: {type: String , enum:['activo' , 'finalizado']},
    fecha: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('orden_compra', ordenCompraSchema);