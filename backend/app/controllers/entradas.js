'use strict';

const entradaModel = require('../models/entradas');
const personaModel = require('../models/personas');
const materiaModel = require('../models/materia-prima');
const productoModel = require('../models/productos');
const ordenModel = require('../models/orden-compra');
const co = require('co');


let listarAll = co.wrap(function * (req, res){
	try {
		let datos = yield entradaModel.find({},null, {sort: {fecha: -1}});
		if(datos.length < 1){
			return res.status(404).send({
				message: `ERROR no hay entradas registradas en el sistema`
			});

		}
		return res.status(200).send({
			datos
		});
	} catch (e) {
		return res.status(500).send({
			message: `ERROR ${e}`
		});
	}
});

let listarById = co.wrap(function * (req, res){
	try {
		let entradaId = req.params.id;
		let datos = yield entradaModel.findById(entradaId);

		if(!datos){
			return res.status(404).send({
				message: 'No hay ninguna entrada registrada con el Id indicado'
			});
		}

		return res.status(200).send({
			datos
		});
	} catch (e) {
		return res.status(500).send({
			message :`ERROR ${e}`
		})
	}
});

let crear = co.wrap(function * (req, res){
	try {
		let contadorMateria = 0;
		let contadorProductos = 0;
		if(req.body.orden_compra){
			if(req.body.orden_compra.materia_prima.length > 0){
				let materia = req.body.orden_compra.materia_prima;
				req.body.orden_compra.materia_prima = [];
				for(var ele of materia){
					if(ele.cantidad_entrante > ele.cantidad_faltante){
						ele.cantidad +=  parseInt(ele.cantidad_entrante) - parseInt(ele.cantidad_faltante);
						ele.ingresanMas = parseInt(ele.cantidad_entrante) - parseInt(ele.cantidad_faltante);
						ele.cantidad_faltante = 0;
					}else{
						ele.cantidad_faltante -= ele.cantidad_entrante;
					}
					yield materiaModel.findByIdAndUpdate(ele._id, {$inc: {cantidad : ele.cantidad_entrante }});
					req.body.orden_compra.materia_prima.push(ele);

					if(ele.cantidad_faltante == 0) contadorMateria ++;
				}
			}
			if(req.body.orden_compra.productos.length > 0){
				let productos = req.body.orden_compra.productos;
				req.body.orden_compra.productos = [];
				for(var ele of productos){
					if(ele.cantidad_entrante > ele.cantidad_faltante){
						ele.cantidad +=  parseInt(ele.cantidad_entrante) - parseInt(ele.cantidad_faltante);
						ele.ingresanMas = parseInt(ele.cantidad_entrante) - parseInt(ele.cantidad_faltante);
						ele.cantidad_faltante = 0;
					}else{
						ele.cantidad_faltante -= ele.cantidad_entrante;
					}
					yield productoModel.findByIdAndUpdate(ele._id, {$inc: {cantidad : ele.cantidad_entrante}});
					req.body.orden_compra.productos.push(ele);

					if(ele.cantidad_faltante == 0) contadorProductos ++;					
				}
			}

			req.body.orden_compra.estado = 'Con Entradas'
			
			if((contadorMateria == req.body.orden_compra.materia_prima.length) && (contadorProductos == req.body.orden_compra.productos.length))
				req.body.orden_compra.estado = 'Finalizado';

			yield ordenModel.findByIdAndUpdate(req.body.orden_compra._id , req.body.orden_compra);

			let entrada = new entradaModel(req.body);

			let datos = yield entrada.save();

			return res.status(200).send({
				message: 'Entrada registrada con exito',
				datos
			});


		}else{
			return res.status(400).send({
				message: 'Error: no es posible registrar la entrada ya que no se especifico una orden de compra'
			});
		}
	} catch (e) {
		return res.status(500).send({
			message: `ERROR ${e}`
		});
	}
});


let eliminar = co.wrap(function *(req, res){
	try {
		let entradaId = req.params.id;
		let entrada = yield entradaModel.findById(entradaId);

		if(entrada.orden_compra.materia_prima.length > 0){
			let materia = entrada.orden_compra.materia_prima;
			entrada.orden_compra.materia_prima = [];
			for(var ele of materia){
				if(ele.ingresanMas){
					ele.cantidad -= ele.ingresanMas;
					ele.cantidad_faltante += parseInt(ele.cantidad_entrante) - parseInt(ele.ingresanMas);
				}else{
					ele.cantidad_faltante += parseInt(ele.cantidad_entrante);
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
					ele.cantidad_faltante += parseInt(ele.cantidad_entrante) - parseInt(ele.ingresanMas);
				}else{
					ele.cantidad_faltante += parseInt(ele.cantidad_entrante);
				}
				yield productoModel.findByIdAndUpdate(ele._id, {$inc: {cantidad : (ele.cantidad_entrante * -1)}});
				entrada.orden_compra.productos.push(ele);
			}
		}

		let entrada.orden_compra.estado = 'Con Entradas';

		yield ordenModel.findByIdAndUpdate(entrada.orden_compra._id , entrada.orden_compra);

		yield entradaModel.findByIdAndRemove(entrada._id);

		return res.status(200).send({
			message : 'Entrada anulada con exito, los cambios han sido revertidos en la base de datos',
			datos : entrada
		});
	} catch (e) {
		return res.status(500).send({
			message: `ERROR ${e}`
		});
	}

});


module.exports = {
	listarAll,
	listarById,
	crear,
	eliminar
};
