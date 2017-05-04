'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    consecutivo: Number,
    codigo: Number,
    tipo: {type: String, enum:['producto', 'kit']}
});

module.exports = mongoose.model('Producto' , ProductoSchema);
