'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./app/bd.config.js');
const controllers = require('./app/controllers/all-controllers');


const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true , limit: '5mb'}));
app.use(express.static(__dirname+'/assest'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(function(req,res,next){
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
})

// Bloque de Rutas de personas
app.get('/personas', controllers.personas.listarAll);

app.get('/personas/:id' , controllers.personas.listarById);

app.post('/personas', controllers.personas.crear);

app.post('/personas/login', controllers.personas.login);

app.put('/personas/contrasena', controllers.personas.contrasena);

app.put('/personas/:id', controllers.personas.actualizar);

app.delete('/personas/:id', controllers.personas.eliminar);
// Fin BLoque de Rutas de personas

// Bloque de rutas de ciudades
app.get('/ciudades', controllers.ciudades.listarAll);

app.get('/ciudades/:id' , controllers.ciudades.listarById);

app.post('/ciudades' , controllers.ciudades.crear);
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

// Bloque de rutas de categorias
app.get('/categorias', controllers.categoria.listarAll);

app.delete('/categorias/:id' , controllers.categoria.eliminar);

app.post('/categorias' , controllers.categoria.crear);
// Fin Bloque de rutas de categorias

// Bloque de rutas de productos
app.post('/productos', controllers.productos.crear);

app.delete('/productos/:id' , controllers.productos.eliminar);

app.get('/productos' , controllers.productos.listarAll);

app.get('/productos/:id' , controllers.productos.listarById);

app.put('/productos/:id' , controllers.productos.actualizar);
// Fin Bloque de rutas de productos

// Bloque de rutas de orden_compra
app.post('/orden_compra', controllers.ordenCompra.crear);

app.delete('/orden_compra/:id' , controllers.ordenCompra.eliminar);

app.get('/orden_compra' , controllers.ordenCompra.listarAll);

app.get('/orden_compra/:id' , controllers.ordenCompra.listarById);

app.put('/orden_compra/:id' , controllers.ordenCompra.actualizar);
// Fin Bloque de rutas de orden_compra

// Bloque de rutas de orden_venta
app.post('/orden_venta', controllers.ordenVenta.crear);

app.delete('/orden_venta/:id' , controllers.ordenVenta.eliminar);

app.get('/orden_venta' , controllers.ordenVenta.listarAll);

app.get('/orden_venta/:id' , controllers.ordenVenta.listarById);

app.put('/orden_venta/:id' , controllers.ordenVenta.actualizar);
// Fin Bloque de rutas de orden_venta

// Bloque de rutas de entradas
app.post('/entradas', controllers.entradas.crear);

app.delete('/entradas/:id' , controllers.entradas.eliminar);

app.get('/entradas' , controllers.entradas.listarAll);

app.get('/entradas/:id' , controllers.entradas.listarById);
<<<<<<< HEAD
=======

>>>>>>> 93cd3c8986291203e3eaf5a98d84425b0d5ca1b8
// Fin Bloque de rutas de entradas

mongoose.connect(`mongodb://${db.user}:${db.pass}@${db.host}:${db.port}/${db.data}`, (err , res) => {
	if(err){
		return console.log(`ERROR al conectar con la BD: ${err}`);
	};
	console.log('Conexión con la base de datos establecida');
	app.listen(port, () => {
		console.log(`Api REST corriendo en: http://localhost:${port}`);
	});
});
