'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const entradaSchema = new Schema({
    proveedor: {},
    materia_prima: [],
    productos: [],
    orden_compra:{},
    persona_autoriza: {},
    persona_entrga: {},
    observaciones: String
});


module.exports = mongoose.model('entrada', entradaSchema);