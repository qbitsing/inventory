'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./app/bd.config.js');
const controllers = require('./app/controllers/all-controllers');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/personas', controllers.personas.listarAll);

app.get('/persona/:id' , (req , res) => {
	res.send(`Se listara la persona ${req.params.id}`);
});

app.post('/personas', (req , res) => {
	res.send(`Se creara una persona`);
});

app.put('/persona/:id', (req , res) => {
	res.send(`Se actualizara la persona ${req.params.id}`);
});

app.delete('/persona/:id', (req , res) => {
	res.send(`Se eliminara la persona ${req.params.id}`);
});

console.log(`mongodb://${db.user}:${db.pass}@${db.host}:${db.port}/${db.data}`);
mongoose.connect(`mongodb://${db.user}:${db.pass}@${db.host}:${db.port}/${db.data}`, (err , res) => {
	if(err){
		return console.log(`ERROR al conectar con la BD: ${err}`);
	};
	console.log('Conexión con la base de datos establecida');
	app.listen(port, () => {
		console.log(`Api REST corriendo en: http://localhost:${port}`);
	});
});


