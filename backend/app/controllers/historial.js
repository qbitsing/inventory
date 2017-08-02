'use strict';

const salidasModel = require('../models/salidas');
const entradasModel = require('../models/entradas');
const entradasRemisionModel = require('../models/entradas-remision');
const productosModel = require('../models/productos');
const materiaModel = require('../models/materia-prima');
const salidasFabricacionModel = require('../models/salidas-fabricacion');
const co = require('co');

let buscar = co.wrap(function * (req, res){
	try{
		let fechaInicial = req.params.fechaInicial + ' 00:00:00';
		let fechaFinal = req.params.fechaFinal + ' 23:59:59';
		let salidas = yield salidasModel.find({fecha : { $gte: fechaInicial, $lte: fechaFinal }});
		let entradas = yield entradasModel.find({fecha : { $gte: fechaInicial, $lte: fechaFinal }});
		let entradasRemision = yield entradasRemisionModel.find({fecha : { $gte: fechaInicial, $lte: fechaFinal }, estado: {$ne: 'Cancelada'}});
		let salidasFabricacion = yield salidasFabricacionModel.find({fecha : { $gte: fechaInicial, $lte: fechaFinal }, estado: {$ne: 'Cancelada'}});
		let productos = yield productosModel.find({tipo: 'producto'});
		let materia = yield materiaModel.find({});
		productos = productos.map(ele => {
			return {
				nombre: ele.nombre,
			    _id: ele._id,
			    producto_consecutivo: ele.producto_consecutivo,
			    codigo: ele.codigo,
	            unidad_medida: ele.unidad_medida,
	            categoria: ele.categoria,
	            marca: ele.marca,
	            precio: ele.precio,
	            cantidad_entrada: 0,
	            cantidad_salida: 0
	        }
		});
		materia = materia.map(ele => {
			return {
				_id: ele._id,
				nombre: ele.nombre,
			    unidad_medida: ele.unidad_medida,
			    min_stock: ele.min_stock,
			    cantidad: ele.cantidad,
			    marca: ele.marca,
			    materia_consecutivo: ele.materia_consecutivo,
			    cantidad_entrada: 0,
			    cantidad_salida: 0
			}
		})
		for(let salida of salidas){
			for(let producto of salida.orden_venta.productos){
				if(producto.tipo == "kit"){
					for(let product of producto.productos){
						productos = productos.map(ele => {
							if(ele._id ==  product._id){
								ele.cantidad_salida += (parseInt(product.cantidad) * parseInt(producto.cantidad_saliente)) || 0;
							}

							return ele
						});
					}
				}else{
					productos = productos.map(ele => {
						if(ele._id ==  producto._id){
							ele.cantidad_salida += parseInt(producto.cantidad_saliente) || 0;
						}

						return ele
					});
				}
			}
		}

		for(let entrada of entradas){
			for (let producto of entrada.orden_compra.productos){
				productos = productos.map(ele => {
					if(ele._id == producto._id){
						ele.cantidad_entrada += parseInt(producto.cantidad_entrante) || 0;
					}
					return ele;
				});
			}

			for (let materiaPrima of entrada.orden_compra.materia_prima){
				materia = materia.map(ele => {
					if(ele._id == materiaPrima._id){
						ele.cantidad_entrada += parseInt(materiaPrima.cantidad_entrante) || 0;
					}
					return ele;
				});
			}

		}

		for(let entrada of entradasRemision){
			for (let producto of entrada.productos){
				productos = productos.map(ele => {
					if(ele._id == producto.producto._id){
						ele.cantidad_entrada += parseInt(producto.cantidad_entrante) || 0;
					}
					return ele;
				});
			}

		}

		for(let salida of salidasFabricacion){
			for (let producto of salida.productos){
				productos = productos.map(ele => {
					if(ele._id == producto.producto._id){
						ele.cantidad_salida += parseInt(producto.cantidad) || 0;
					}
					return ele;
				});
			}

			for (let materiaPrima of salida.materia_prima){
				materia = materia.map(ele => {
					if(ele._id == materiaPrima.materia._id){
						ele.cantidad_salida += parseInt(materiaPrima.cantidad) || 0;
					}
					return ele;
				});
			}
		}

		productos = productos.filter(ele => (ele.cantidad_salida > 0) || (ele.cantidad_entrada > 0))
		materia = materia.filter(ele => (ele.cantidad_salida > 0) || (ele.cantidad_entrada > 0))
		return res.status(200).send({
			productos,
			materia
		});
	}catch(e){
		return res.status(500).send({
			message: `ERROR ${e}`
		});
	}
});

module.exports = {
	buscar
}