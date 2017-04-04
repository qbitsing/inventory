'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const procesoSchema = new Schema({
    nombre : String,
    tipo: {type: String, enum: ['Interno', 'Esterno']}
});


module.exports = mongoose.model('proceso' , procesoSchema);