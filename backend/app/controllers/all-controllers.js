'use strict';

const personas = require('./personas');
const ciudades = require('./ciudades');
const departamentos = require('./departamentos');
const unidades = require('./unidades');
const materiaPrima = require('./materia-prima');
const categoria = require('./categorias');
const productos = require('./productos');
const ordenCompra = require('./orden-compra');
const ordenVenta = require('./orden-venta');
const entradas = require('./entradas');
const salidas = require('./salidas');
const fabricacion = require('./fabricacion');
const procesos = require('./procesos');

const controllers = {
	personas,
	ciudades,
	departamentos,
	unidades,
	materiaPrima,
	categoria,
	productos,
	ordenCompra,
	ordenVenta,
	entradas,
	salidas,
	fabricacion,
	procesos
};

module.exports = controllers;
