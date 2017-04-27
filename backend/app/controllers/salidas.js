'use strict';

const salidaModel = require('../models/salidas');
const personaModel = require('../models/personas');
const productoModel = require('../models/productos');
const ordenModel = require('../models/orden-venta');
const co = require('co');

let listarAll = co.wrap(function* (req, res){
  let datos;
  try {
    datos = yield salidaModel.find({});
  } catch (e) {
    return res.status(500).send({
      message: `ERROR al intentar buscar salidas en la base de datos ${e}`
    });
  }

  if(datos.length <= 0){
    return res.status(404).send({
      message: 'No hay salidas registradas en la base de datos'
    });
  }

  return res.status(200).send({
    datos
  });
});

let listarById = co.wrap(function * (req, res){
    let salidaId = req.params.id;
    let datos;
    try {
      datos = yield salidaModel.findById(salidaId);
    } catch (e) {
      return res.status(500).send({
        message: `ERROR al intentar obtener la salida ${e}`
      });
    }
    if(!datos){
      return res.status(404).send({
        message:'La salida indicada no esta registrada en la base de datos'
      });
    }
    return res.status(200).send({
      datos
    });
});

let crear = co.wrap(function * (req, res){
  if(req.body.orden_venta){
    if(req.body.orden_venta.productos.length > 0){
      let productos = req.body.orden_venta.productos;
      req.body.orden_venta.productos = [];
      for(var ele of productos){
        if(ele.cantidad_saliente > 0){
          ele.cantidad_faltante -= ele.cantidad_saliente;
          yield productoModel.findByIdAndUpdate(ele._id, {$inc: {cantidad : (ele.cantidad_saliente * -1)}});
        }
        req.body.orden_venta.productos.push(ele);
      }

      yield ordenModel.findByIdAndUpdate(req.body.orden_venta._id);

      let salida = new salidaModel(req.body);

      yield salida.save();

      return res.status(200).send({
        message: 'Salida registrada con exito'
      });

    }else{
      return res.status(400).send({
        message: 'Error: no es posible registrar la salida ya que no se especificaron productos a entregar'
      });
    }
  }else{
    return res.status(400).send({
      message: 'Error: no es posible registrar la salida ya que no se especifico una orden de venta'
    });
  }
});

let eliminar = co.wrap(function *(req, res){
		let salidaId = req.params.id;
		let salida = yield salidaModel.findById(salidaId);
    console.log(salida.orden_venta.productos);
		if(salida.orden_venta.productos.length > 0){
			let productos = salida.orden_venta.productos;
			salida.orden_venta.productos = [];
			for(var ele of productos){
				ele.cantidad_faltante += ele.cantidad_saliente;
				yield productoModel.findByIdAndUpdate(ele._id, {$inc: {cantidad : ele.cantidad_saliente}});
				salida.orden_venta.productos.push(ele);
			}
		}

		yield ordenModel.findByIdAndUpdate(salida.orden_venta._id , salida.orden_venta);

		yield salidaModel.findByIdAndRemove(salida._id);

		return res.status(200).send({
			message: 'Salida anulada con exito, los cambios han sido revertidos en la base de datos'
		});

});


module.exports = {
		listarAll,
		listarById,
		crear,
		eliminar
};
