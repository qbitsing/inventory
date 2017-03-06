'use strict';

const personas = require('./personas');
const ciudades = require('./ciudades');
const departamentos = require('./departamentos');
const unidades = require('./unidades');

const controllers = {
	personas,
	ciudades,
	departamentos,
	unidades
};

module.exports = controllers;
