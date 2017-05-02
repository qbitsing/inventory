'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const entradaSchema = new Schema({
    orden_compra:{},
    persona_entrada: {},
    observaciones: String,
    fecha: {type: Date, default: Date.now()}
});


module.exports = mongoose.model('entrada', entradaSchema);