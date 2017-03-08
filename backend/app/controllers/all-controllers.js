'use strict';

const personas = require('./personas');
const ciudades = require('./ciudades');
const departamentos = require('./departamentos');
const unidades = require('./unidades');
const materiaPrima = require('./materia-prima');

const controllers = {
	personas,
	ciudades,
	departamentos,
	unidades,
	materiaPrima
};

module.exports = controllers;
