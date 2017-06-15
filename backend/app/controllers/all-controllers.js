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
const remision = require('./remicion');
const entradaRemision = require('./entradas-remision');
const salidasFabricacion = require('./salidas-fabricacion.js');
const facturas = require('./facturas');
const historial = require('./historial');

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
	procesos,
	remision,
	entradaRemision,
	salidasFabricacion,
	facturas,
	historial
};

module.exports = controllers;
