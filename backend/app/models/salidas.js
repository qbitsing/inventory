'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const salidaSchema = new Schema({
    orden_venta:{},
    persona_entrada: {},
    observaciones: String
});


module.exports = mongoose.model('salida', salidaSchema);
