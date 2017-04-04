'use strict';

const personaModel = require('./personas');
const productosModel = require('./productos');
const ordenModel = require('./orden-venta');
const mongoose = require('mongoose');
const co = require('co');




module.exports = {
  listarALl,
  listarById,
}
