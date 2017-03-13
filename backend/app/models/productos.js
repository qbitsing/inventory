'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = new Schema({
    nombre : String,
    uniad_medida : {},
    minimo_stock : Number,
    cantidad : Number,
    insumos : [],
    precio: Number    
});

module.exports = mongoose.model('Producto' , ProductoSchema);