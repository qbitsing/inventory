'use strict';

const entradaModel = require('../models/entradas');
const personaModel = require('../models/personas');
const materiaModel = require('../models/materia-prima');
const productoModel = require('../models/productos');
const ordenModel = require('../models/orden-compra');

function listarAll(req, res){
		entradaModel.find({}, (err, entradaStored)=>{
				if(err){
						return res.status(500).send({
								message: `ERROR al intentar listar las entradas ${err}`
						});
				}

				if(entradaStored.length < 1){
						return res.status(404).send({
								message: `ERROR no hay entradas registradas en el sistema`
						});

				}

				return res.status(200).send({
						datos : entradaStored
				});
		});
}

function listarById(req, res){
		var entradaId = req.params.id;
		entradaModel.findById(entradaId , (err, entradaStored)=>{
				if(err){
						return res.status(500).send({
								message: `ERROR al intentar obtener el recurso ${err}`
						});
				}

				if(!entradaStored){
						return res.status(404).send({
								message:`ERROR el recurso no esta almacenado en la base de datos`
						});
				}

				return res.status(200).send({
						datos : entradaStored
				});
		});
}

function crear(req, res){
		var errors = [];
		if(req.body.orden_compra){
				if(req.body.orden_compra.materia_prima.length > 0){
						req.body.orden_compra.materia_prima = req.body.orden_compra.materia_prima.map(ele=>{
								if(ele.cantidad_entrante > ele.cantidad_faltante){
										ele.cantidad +=  ele.cantidad_entrante - ele.cantidad_faltante;
										ele.ingresanMas = ele.cantidad_entrante - ele.cantidad_faltante;
										ele.cantidad_faltante = 0;
								}else{
										ele.cantidad_faltante -= ele.cantidad_entrante;
								}

								return ele;
						});
						updateMaterias();
				}
				if(req.body.orden_compra.productos.length > 0){
						req.body.orden_compra.productos = req.body.orden_compra.productos.map(ele=>{
								if(ele.cantidad_entrante > ele.cantidad_faltante){
										ele.cantidad +=  ele.cantidad_entrante - ele.cantidad_faltante;
										ele.ingresanMas = ele.cantidad_entrante - ele.cantidad_faltante;
										ele.cantidad_faltante = 0;
								}else{
										ele.cantidad_faltante -= ele.cantidad_entrante;
								}

								return ele;
						});
				}
		}

		ordenModel.findByIdAndUpdate(req.body.orden_compra._id, req.body.orden_compra , (err , registro)=>{
				if(err){
						return res.status(500).send({
								message : `ERROR al intentar actualizar la orden de compra ${err}`
						});
				}
				updateProducts();
		});

		function updateProducts(){
				var cont = 0;
				if(req.body.orden_compra.productos.length > 0){
						for(var element of req.body.orden_compra.productos){
								var dataToUpdate = {
										$inc: { cantidad: element.cantidad_entrante }
								};

								productoModel.findByIdAndUpdate(element._id, dataToUpdate , (err , registro)=>{
										if(err){
												errors.push(err);
										}
										cont ++;
										if(cont == req.body.orden_compra.productos.length){
												updateMaterias();
										}
								});
						}
				}else updateMaterias();

		}

		function updateMaterias(){
				if(req.body.orden_compra.materia_prima.length > 0){
						var cont = 0;
						for(var element of req.body.orden_compra.materia_prima){
								var dataToUpdate = {
										$inc: { cantidad: element.cantidad_entrante }
								};

								materiaModel.findByIdAndUpdate(element._id, dataToUpdate , (err , registro)=>{
										if(err){
										errors.push(err);
										}
										cont ++;
										if(cont == req.body.orden_compra.materia_prima.length){
												responder();
										}
								});
						}
				}else responder();

		}

		function responder(){
				if(errors.length > 0){
						return res.status(500).send(errors);
				}else{
						return res.status(200).send({
								message: `Entrada registrada exitosamente`
						});
				}
		}
}

function eliminar(req, res){
		let ordenId = req.params.id;

		ordenModel.findById(ordenId , (err, registro)=>{
				if(err){
					return res.status(500).send({
						message : `ERROR al intentar obtener la orden indicada ${err}`
					});
				}

				if(!registro){
					return res.status(404).send({
						message: 'La orden indicada no esta registrada en la base de datos'
					});
				}

				anularOrden(registro);
		});

		function anularOrden(orden){

		}
}


module.exports = {
		listarAll,
		listarById,
		crear,
		eliminar
};
