'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fabricacionSchema = new Schema({
  consecutivo: Number,
  fecha_solicitud: Date,
  fecha_entrega: Date,
  responsable: {},
  autoriza: {},
  productos: [],
  procesos_externos: [],
  orden_venta: {}
});

module.exports = mongoose.model('fabricacion', fabricacionSchema);