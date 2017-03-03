'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./app/bd.config.js');
const controllers = require('./app/controllers/all-controllers');


const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Bloque de Rutas de personas
app.get('/personas', controllers.personas.listarAll);

app.get('/persona/:id' , controllers.personas.listarById);

app.post('/personas', controllers.personas.crear);

app.post('/personas/login', controllers.personas.login);

app.put('/persona/:id', controllers.personas.actualizar);

app.delete('/persona/:id', controllers.personas.eliminar);
// Fin BLoque de Rutas de personas

// Bloque de rutas de ciudades
app.get('/ciudades', controllers.ciudades.listarAll);

app.get('/ciudades/:id' , controllers.ciudades.listarById);

app.post('/ciudades' , controllers.ciudades.crear);
// Fin Bloque de rutas de ciudades

mongoose.connect(`mongodb://${db.user}:${db.pass}@${db.host}:${db.port}/${db.data}`, (err , res) => {
	if(err){
		return console.log(`ERROR al conectar con la BD: ${err}`);
	};
	console.log('Conexión con la base de datos establecida');
	app.listen(port, () => {
		console.log(`Api REST corriendo en: http://localhost:${port}`);
	});
});
