'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('../utils/auto-increment').init();


const fabricacionSchema = new Schema({
  fabricacion_consecutivo: Number,
  fecha_solicitud: Date,
  fecha_entrega: Date,
  autoriza: {},
  productos: [],
  procesos: [],
  orden_venta: {},
  estado: {type: String , enum:['Completa', 'Incompleta', 'En Fabricacion'], default: 'En Fabricacion'},
  estado_remision: {type: String, enum:['Sin Remision' , 'Con Remision'], default: 'Sin Remision'},
  generado: {}
});
fabricacionSchema.plugin(autoIncrement.plugin, {
    model: 'fabricacion',
    field: 'fabricacion_consecutivo',
    startAt: 1000,
    incrementBy: 1
});

module.exports = mongoose.model('fabricacion', fabricacionSchema);
