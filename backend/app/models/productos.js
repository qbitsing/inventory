'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('../utils/auto-increment.js');

const ProductoSchema = new Schema({
    nombre : String,
    unidad_medida : {},
    min_stock : Number,
    apartados: {type: Number, default: 0},
    cantidad : {type: Number , default: 0},
    marca : String,
    categoria: {},
    Insumos : [],
    procesos: [],
    productos : [],
    precio: Number,
    producto_consecutivo: Number,
    codigo: Number,
    tipo: {type: String, enum:['producto', 'kit']},
    fabricado: Boolean,
    comprado: Boolean
});

ProductoSchema.plugin(autoIncrement.plugin, {
    model: 'Producto',
    field: 'producto_consecutivo',
    startAt: 1000,
    incrementBy: 1
});


const modelProduct = mongoose.model('Producto' , ProductoSchema);

module.exports = modelProduct
