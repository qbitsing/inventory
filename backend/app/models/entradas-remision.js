'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entradaRemisionSchema = new Schema({
    fecha: {type: Date, default: Date.now()},
    remision: {},
    productos: []
});