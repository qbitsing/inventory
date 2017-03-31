'use strict';

const entradaModel = require('../models/entradas');
const personaModel = require('../models/personas');
const materiaModel = require('../models/materia-prima');
const productoModel = require('../models/productos');
const ordenModel = require('../models/orden-compra');
const co = require('co');

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
		let promise = co.wrap(function * () {
			if(req.body.orden_compra){
					if(req.body.orden_compra.materia_prima.length > 0){
						let materia = req.body.orden_compra.materia_prima;
						req.body.orden_compra.materia_prima = [];
						for(var ele of materia){
							if(ele.cantidad_entrante > ele.cantidad_faltante){
								ele.cantidad +=  ele.cantidad_entrante - ele.cantidad_faltante;
								ele.ingresanMas = ele.cantidad_entrante - ele.cantidad_faltante;
								ele.cantidad_faltante = 0;
							}else{
								ele.cantidad_faltante -= ele.cantidad_entrante;
							}
							yield materiaModel.findByIdAndUpdate(ele._id, {$inc: {cantidad : ele.cantidad_entrante}});
							req.body.orden_compra.materia_prima.push(ele);
						}
					}
					if(req.body.orden_compra.productos.length > 0){
						let productos = req.body.orden_compra.productos;
						req.body.orden_compra.productos = [];
						for(var ele of productos){
							if(ele.cantidad_entrante > ele.cantidad_faltante){
								ele.cantidad +=  ele.cantidad_entrante - ele.cantidad_faltante;
								ele.ingresanMas = ele.cantidad_entrante - ele.cantidad_faltante;
								ele.cantidad_faltante = 0;
							}else{
								ele.cantidad_faltante -= ele.cantidad_entrante;
							}
							yield productoModel.findByIdAndUpdate(ele._id, {$inc: {cantidad : ele.cantidad_entrante}});
							req.body.orden_compra.productos.push(ele);
						}
					}

					yield ordenModel.findByIdAndUpdate(req.body.orden_compra._id , req.body.orden_compra);

					let entrada = new entradaModel(req.body);

					yield entrada.save();

					respond(200, {
						message: 'Entrada registrada con exito',
						datos: entrada
					});


			}else{
				return respond(400 , {
					message: 'Error: no es posible registrar la entrada ya que no se especifico una orden de compra'
				});
			}
		});

		promise();

		function respond(status, response){
			res.status(status).send(response);
		}

}

let eliminar = co.wrap(function *(req, res){
		let entradaId = req.params.id;
		let entrada = yield entradaModel.findById(entradaId);

		if(entrada.orden_compra.materia_prima.length > 0){
			let materia = entrada.orden_compra.materia_prima;
			entrada.orden_compra.materia_prima = [];
			for(var ele of materia){
				if(ele.ingresanMas){
					ele.cantidad -= ele.ingresanMas;
					ele.cantidad_faltante += ele.cantidad_entrante - ele.ingresanMas;
				}else{
					ele.cantidad_faltante += ele.cantidad_entrante;
				}

				yield materiaModel.findByIdAndUpdate(ele._id, {$inc: {cantidad : (ele.cantidad_entrante * -1)}});
				entrada.orden_compra.materia_prima.push(ele);
			}
		}

		if(entrada.orden_compra.productos.length > 0){
			let productos = entrada.orden_compra.productos;
			entrada.orden_compra.productos = [];
			for(var ele of productos){
				if(ele.ingresanMas){
					ele.cantidad -= ele.ingresanMas;
					ele.cantidad_faltante += ele.cantidad_entrante - ele.ingresanMas;
				}else{
					ele.cantidad_faltante += ele.cantidad_entrante;
				}
				yield productoModel.findByIdAndUpdate(ele._id, {$inc: {cantidad : (ele.cantidad_entrante * -1)}});
				entrada.orden_compra.productos.push(ele);
			}
		}

		yield ordenModel.findByIdAndUpdate(entrada.orden_compra._id , entrada.orden_compra);

		yield entradaModel.findByIdAndRemove(entrada._id);

		return res.status(200).send({
			message: 'Entrada anulada con exito, los cambios han sido revertidos en la base de datos'
		});

});


module.exports = {
		listarAll,
		listarById,
		crear,
		eliminar
};
