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
  orden_venta: {},
  estado: {type: String , enum:['Completa', 'Incompleta', 'En Fabricacion'], default: 'En Fabricacion'},
  estado_remision: {type: String, enum:['Sin Remision' , 'Con Remision'], default: 'Sin Remision'}
});

module.exports = mongoose.model('fabricacion', fabricacionSchema);
