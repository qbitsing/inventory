'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('../utils/auto-increment.js');


const remicionSchema = new Schema({
  fabricacion: {},
  proveedor : {},
  productos: [],
  proceso : {},
  fecha_entrega: Date,
  fecha_solicitud: Date,
  estado: {type: String, enum:['Con Entrada', 'Sin Entrada', 'Cancelada'], default: 'Sin Entrada'},
  remision_consecutivo: Number,
  generado: {}
});

remicionSchema.plugin(autoIncrement.plugin, {
    model: 'remicion',
    field: 'remision_consecutivo',
    startAt: 1000,
    incrementBy: 1
});

module.exports = mongoose.model('remicion', remicionSchema);