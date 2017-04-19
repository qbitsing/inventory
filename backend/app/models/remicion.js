'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const remicionSchema = new Schema({
  proveedor : {},
  productos: [],
  fecha_entrega: Date,
  fecha_solicitud: Date
});

module.exports = mongoose.model('remicion', remicionSchema);