'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ordenVentaSchema = new Schema({
    cliente: {},
    consecutivo: {type: Number, index: true},
    orden_compra_cliente: String,
    fecha_recepcion: Date,
    lugar_entrega: String,
    productos: [],
    obcervaciones: String,
    fecha_entrega: Date,
    estado: {type: String, enum:['Activo' , 'Inactivo'], default: 'Activo'}
});

module.exports = mongoose.model('orden_venta', ordenVentaSchema);