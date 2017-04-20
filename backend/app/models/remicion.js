'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const remicionSchema = new Schema({
  fabricacion: {},
  proveedor : {},
  productos: [],
  fecha_entrega: Date,
  fecha_solicitud: Date,
  estado: {type: String, enum:['Con Entrada', 'Sin Entrada'], default: 'Sin Entrada'}
});

module.exports = mongoose.model('remicion', remicionSchema);