'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fabricacionSchema = new Schema({
  consecutivo: Number,
  fecha_solicitud: Date,
  fecha_entrega: Date,
  autoriza: {},
  productos: [],
  procesos: [],
  orden_venta: {}
});

module.exports = mongoose.model('fabricacion', fabricacionSchema);
