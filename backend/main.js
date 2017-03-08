'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./app/bd.config.js');
const controllers = require('./app/controllers/all-controllers');


const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req,res,next){
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
})

// Bloque de Rutas de personas
app.get('/personas', controllers.personas.listarAll);

app.get('/personas/:id' , controllers.personas.listarById);

app.post('/personas', controllers.personas.crear);

app.post('/personas/login', controllers.personas.login);

app.put('/personas/:id', controllers.personas.actualizar);

app.delete('/personas/:id', controllers.personas.eliminar);
// Fin BLoque de Rutas de personas

// Bloque de rutas de ciudades
app.get('/ciudades', controllers.ciudades.listarAll);

app.get('/ciudades/:id' , controllers.ciudades.listarById);

//app.post('/ciudades' , controllers.ciudades.crear);
// Fin Bloque de rutas de ciudades

// Bloque de rutas de departamentos
app.get('/departamentos', controllers.departamentos.listarAll);

app.get('/departamentos/:id' , controllers.departamentos.listarById);

app.post('/departamentos' , controllers.departamentos.crear);
// Fin Bloque de rutas de departamentos

// Bloque de rutas de unidades
app.get('/unidades', controllers.unidades.listarAll);

app.delete('/unidades/:id' , controllers.unidades.eliminar);

app.post('/unidades' , controllers.unidades.crear);
// Fin Bloque de rutas de unidades

// Bloque de rutas de materiaPrima
app.get('/materiaPrima', controllers.materiaPrima.listarAll);

app.get('/materiaPrima/:id', controllers.materiaPrima.listarById);

app.put('/materiaPrima/:id', controllers.materiaPrima.actualizar);

app.delete('/materiaPrima/:id' , controllers.materiaPrima.eliminar);

app.post('/materiaPrima' , controllers.materiaPrima.crear);
// Fin Bloque de rutas de materiaPrima

mongoose.connect(`mongodb://${db.user}:${db.pass}@${db.host}:${db.port}/${db.data}`, (err , res) => {
	if(err){
		return console.log(`ERROR al conectar con la BD: ${err}`);
	};
	console.log('Conexión con la base de datos establecida');
	app.listen(port, () => {
		console.log(`Api REST corriendo en: http://localhost:${port}`);
	});
});
