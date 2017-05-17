'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const facturaSchema = new Schema({
    productos: [],
    cliente: {},
    iva: Number,
    valorIva: Number,
    subtotal: Number,
    total: Number,
    fecha: Date,
    vencimiento: Date,
    remision: String,
    ordenCompra: String,
    orden: {type: String},
    consecutivo: Number,
    estado: {type: String, enum:['activa' , 'cancelada'], default: 'activa'},
    observacion: String
});

module.exports = mongoose.model('factura', facturaSchema);