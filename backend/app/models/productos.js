'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = new Schema({
    nombre : String,
    unidad_medida : {},
    min_stock : Number,
    cantidad : Number,
    marca : String,
    categoria: {},
    Insumos : [],
    productos : [],
    precio: Number    
});

module.exports = mongoose.model('Producto' , ProductoSchema);