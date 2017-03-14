'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const ordenCompraSchema = new Schema({
    proveedor : {},
    productos: [],
    materia_prima: [],
    estado: {type: String , enum:['activo' , 'finalizado']}
});