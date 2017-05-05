'use strict';

const ordenVentaModel = require('../models/orden-venta');
const clienteModel = require('../models/personas');
const productoModel = require('../models/productos');
const co = require('co');

let listarAll = co.wrap(function * (req, res){
    try {
        let query = req.query;
        let condiciones = [];
        query.Activo ? condiciones.push({estado: 'Activo'}) : null;
        query.Finalizado ? condiciones.push({estado: 'Finalizado'}) : null;
        query.Salidas ? condiciones.push({estado: 'Con Salidas'}) : null;

        let datos = [];

        //if(query.Activo || query.Finalizado || query.Entradas)        
        //    datos = yield ordenVentaModel.find({$or: condiciones}, null, {sort: {fecha_recepcion: -1}});
        datos = yield ordenVentaModel.find({},null, {sort: {fecha_recepcion: -1}});

        if(datos.length < 1){
            return res.status(404).send({
                message: `no hay ordenes de venta registradas`
            });
        }

        return res.status(200).send({
            datos
        });
    } catch (error) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let listarById = co.wrap(function * (req, res){
    try {
        let ordenId = req.params.id;
        let datos = yield ordenVentaModel.findById(ordenId);
        if(!datos){
            return res.status(404).send({
                message : `no se encuentra ningun registro con el ID indicado`
            });
        }
        return res.status(200).send({
            datos
        });
    } catch (e) {
        return res.status(500).send({
            message : `ERROR ${e}`
        });
    }
});

let crear = co.wrap(function * (req, res){
    try {
        if(req.body.cliente){
            req.body.cliente = yield clienteModel.findById(req.body.cliente._id);
        }
        let noDisponible = [];
        for(let ele of req.body.productos){
            let pro = yield productoModel.findById(ele._id);
            let disponible = pro.cantidad - pro.min_stock;
            if(pro.cantidad < ele.cantidad){
                noDisponible.push(`No cuenta con las cantidad suficiente de ${ele.nombre} en inventario`);
            }else if(disponible < ele.cantidad){
                noDisponible.push(`El minimo stock  de ${ele.nombre} se esta superando`);
            }else if((pro.cantidad - pro.apartados) < ele.cantidad){
                noDisponible.push(`El inventario cuenta con el producto ${ele.nombre} pero ya hay ${pro.apartados} apartados en otras ordenes de venta`);
            }else if((disponible - pro.apartados) < ele.cantidad){
                noDisponible.push(`El inventario cuenta con el producto ${ele.nombre} pero ya hay ${pro.apartados} apartados en otras ordenes de venta,
                y al despacharlos se supera el minimo stock`);                
            }

            pro.apartados += ele.cantidad;

            yield productoModel.findByIdAndUpdate(pro._id, pro);
        }
        let newOrdenVenta = new ordenVentaModel(req.body);
        let datos = yield newOrdenVenta.save();

        return res.status(200).send({
            datos,
            noDisponible,
            message: 'Se ha registrado la orden de venta exitosamente',
            id: datos._id
        });
    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let actualizar = co.wrap(function * (req, res){
    try {
        let ordenId = req.params.id; 
        if(req.body.cliente){
            req.body.cliente = yield clienteModel.findById(req.body.cliente._id);
        }
        let noDisponible = [];
        for(let ele of req.body.productos){
            let pro = yield productoModel.findById(ele._id);
            let disponible = pro.cantidad - pro.min_stock;
            if(pro.cantidad < ele.cantidad){
                noDisponible.push(`No cuenta con las cantidad suficiente de ${ele.nombre} en inventario`);
            }else if(disponible < ele.cantidad){
                noDisponible.push(`El minimo stock  de ${ele.nombre} se esta superando`);
            }else if((pro.cantidad - pro.apartados) < ele.cantidad){
                noDisponible.push(`El inventario cuenta con el producto ${ele.nombre} pero ya hay ${pro.apartados} apartados en otras ordenes de venta`);
            }else if((disponible - pro.apartados) < ele.cantidad){
                noDisponible.push(`El inventario cuenta con el producto ${ele.nombre} pero ya hay ${pro.apartados} apartados en otras ordenes de venta,
                y al despacharlos se supera el minimo stock`);                
            }

            pro.apartados += ele.cantidad;

            yield productoModel.findByIdAndUpdate(pro._id, pro);
        }

        yield ordenVentaModel.findByIdAndUpdate(ordenId, req.body);

        return res.status(200).send({
            message: 'Orden de venta actualizada con exito',
            noDisponible
        });
    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

function eliminar(req, res){
    let ordenId = req.params.id;
	ordenVentaModel.findByIdAndRemove(ordenId , (err)=>{
		if(err){
			return res.status(500).send({
				message : `ERROR al intentar eliminar el registro ${err}`
			});
		}
		return res.status(200).send({
			message : `registro eliminado con exito`
		});
	});    
}

module.exports = {
    listarAll,
    listarById,
    crear,
    actualizar,
    eliminar
};