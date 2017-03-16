'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordenVentaSchema = new Schema({
    cliente: {},
    consecutivo: {type: Number},
    orden_compra_cliente: String,
    fecha_recepcion: Date,
    lugar_entrega: String,
    productos: [],
    observaciones: String,
    fecha_entrega: Date,
    estado: {type: String, enum:['Activo' , 'Inactivo'], default: 'Activo'}
});

module.exports = mongoose.model('orden_venta', ordenVentaSchema);