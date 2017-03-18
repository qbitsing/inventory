'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const entradaSchema = new Schema({
    orden_compra:{},
    persona_entrada: {},
    observaciones: String
});


module.exports = mongoose.model('entrada', entradaSchema);