'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salidaSchema = new Schema({
    productos: {},
    materia_prima: {},
    fabricacion: {},
    estado: String
});

module.exports = mongoose.model('fabricacioninsumos', salidaSchema);