'use strict';

const salidaModel = require('../models/salidas');
const personaModel = require('../models/personas');
const productoModel = require('../models/productos');
const ordenModel = require('../models/orden-venta');
const co = require('co');

let listarAll = co.wrap(function* (req, res){
  let datos;
  try {
    datos = yield salidaModel.find({},null, {short: {fecha: -1}});
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
  try {
      if(req.body.generado){
        delete req.body.generado.contrasena;
      }
      if(req.body.orden_venta){
        if(req.body.orden_venta.productos.length > 0){
          let productos = req.body.orden_venta.productos;
          let noDisponibles = [];
          let contador = 0;
          req.body.orden_venta.productos = [];
          for(let ele of productos){
            let pro = yield productoModel.findById(ele._id);
            if(pro.cantidad < ele.cantidad_saliente){
              noDisponibles.push(`No se puede realizar la salida ya que no cuenta con ${ele.cantidad} de ${ele.nombre}`);
            }
          }

          if(noDisponibles.length > 0){
            return res.status(400).send({
              noDisponibles
            });
          }
          for(let ele of productos){
            if(ele.cantidad_saliente > 0){
              let pro = yield productoModel.findById(ele._id);
              pro.apartados -= ele.cantidad_saliente;
              pro.cantidad -= ele.cantidad_saliente;
              yield productoModel.findByIdAndUpdate(pro._id, pro);          
            }
            if(ele.cantidad_faltante == 0) contador ++;
            req.body.orden_venta.productos.push(ele);
          }
          req.body.orden_venta.estado = 'Con Salidas';

          if(contador == req.body.orden_venta.productos.length) req.body.orden_venta.estado = 'Finalizado'
          yield ordenModel.findByIdAndUpdate(req.body.orden_venta._id, req.body.orden_venta);

          let salida = new salidaModel(req.body);

          let datos = yield salida.save();

          return res.status(200).send({
            message: 'Salida registrada con exito',
            datos
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
  } catch (e) {
    return res.status(500).send({
      message: `ERROR ${e}`
    });
  }

});

let eliminar = co.wrap(function *(req, res){
		let salidaId = req.params.id;
		let salida = yield salidaModel.findById(salidaId);
		if(salida.orden_venta.productos.length > 0){
			let productos = salida.orden_venta.productos;
			salida.orden_venta.productos = [];
			for(let ele of productos){
				ele.cantidad_faltante += ele.cantidad_saliente;
        let pro = yield productoModel.findById(ele._id);
        pro.apartados += ele.cantidad;
        pro.cantidad += ele.cantidad;
        yield productoModel.findByIdAndUpdate(pro._id, pro);
				salida.orden_venta.productos.push(ele);
			}
		}

    salida.orden_venta.estado = 'Con Salidas';

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
