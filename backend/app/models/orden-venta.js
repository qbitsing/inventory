'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('../utils/auto-increment').init();


const ordenVentaSchema = new Schema({
    cliente: {},
    orden_venta_consecutivo: {type: Number},
    orden_compra_cliente: String,
    fecha_recepcion: Date,
    lugar_entrega: String,
    productos: [],
    observaciones: String,
    fecha_entrega: Date,
    estado: {type: String , enum:['Activo' , 'Finalizado', 'Con Salidas'], default: 'Activo'}
});

ordenVentaSchema.plugin(autoIncrement.plugin, {
    model: 'orden_venta',
    field: 'orden_venta_consecutivo',
    startAt: 1000,
    incrementBy: 1
});

module.exports = mongoose.model('orden_venta', ordenVentaSchema);