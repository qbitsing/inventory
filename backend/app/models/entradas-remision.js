'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
const db = require('../bd.config.js');
autoIncrement.initialize(mongoose.createConnection(`mongodb://${db.user}:${db.pass}@${db.host}:${db.port}/${db.data}`));

const entradaRemisionSchema = new Schema({
    fecha: {type: Date, default: Date.now()},
    remision: {},
    productos: [],
    estado:{type: String, enum:['Cancelada']},
    consecutivo: Number
});

entradaRemisionSchema.plugin(autoIncrement.plugin, {
    model: 'entradaremision',
    field: 'consecutivo',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('entradaremision', entradaRemisionSchema);


