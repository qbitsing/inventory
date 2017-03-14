'use strict';

const personas = require('./personas');
const ciudades = require('./ciudades');
const departamentos = require('./departamentos');
const unidades = require('./unidades');
const materiaPrima = require('./materia-prima');
const categoria = require('./categorias');
const productos = require('./productos');
const ordenCompra = require('./orden-compra');

const controllers = {
	personas,
	ciudades,
	departamentos,
	unidades,
	materiaPrima,
	categoria,
	productos,
	ordenCompra
};

module.exports = controllers;
