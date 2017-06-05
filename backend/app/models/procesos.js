'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('../utils/auto-increment');

const procesoSchema = new Schema({
    nombre : String,
    tipo: {type: String, enum: ['Interno', 'Externo']},
    proceso_consecutivo: Number
});

procesoSchema.plugin(autoIncrement.plugin, {
    model: 'proceso',
    field: 'proceso_consecutivo',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('proceso' , procesoSchema);
