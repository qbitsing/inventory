'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dianSchema = Schema({
	numero: String,
	fecha: String,
	desde: Number,
	hasta: Number
});
module.exports = mongoose.model('dian' , dianSchema);