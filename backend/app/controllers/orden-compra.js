'use strict';

const ordenCompraModel = require('../models/orden-compra');
const proveedorModel = require('../models/personas');
const productoModel = require('../models/productos');
const materiaPrimaModel = require('../models/materia-prima');
const co = require('co');


let listarAll = co.wrap(function * (req, res){
    try {
        let datos = yield ordenCompraModel.find({}, null, {sort: {fecha: -1}});

        if(datos.length < 1) {
            return res.status(404).send({
                message: `ERROR no hay ordenes de compra registradas`
            });
        }

        return res.status(200).send({
            datos
        });
    } catch (e) {
        return res.status(500).send({
            message:`ERROR ${e}`
        });
    }
});

let listarById = co.wrap(function * (req, res){
    try {
        let ordenId = req.params.id;

        let datos = yield ordenCompraModel.findById(ordenId);

        if(!productoStrored){
            return res.status(404).send({
                message : `ERROR no se encuentra ningun registro con el ID indicado`
            });
        }

        return res.status(200).send({
            datos : ordenStored
        });
    } catch (e) {
        return res.status(500).send({
            message : `ERROR ${e}`
        });
    }
});

let crear = co.wrap(function * (req, res){
    try {
        let proveedor;
        if(req.body.proveedor){
            let proveedor = yield proveedorModel.findById(req.body.proveedor._id);

            if(!proveedor){
                return res.status(404).send({
                    message: `ERROR el proveedor indicado no s encuentra en la base de datos`
                });
            }
        }

        req.body.proveedor = proveedor;

        let newOrdenCompra = new ordenCompraModel(req.body);

        let datos = yield newOrdenCompra.save();

        return res.status(200).send({
            message: 'Orden de Compra registrada con exito',
            id: datos._id,
            datos
        });


    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

function actualizar(req, res){
    pasoUno();
    function pasoUno(){
        if(req.body.proveedor){
            proveedorModel.findById(req.body.proveedor._id , (err, proveedorStrored)=>{
                if(err){
                    return res.status(500).send({
                        message : `ERROR al obtener el proveedor ${err}`
                    });
                }

                if(!proveedorStrored){
                    return res.status(404).send({
                        message : `ERROR el proveedor indicado no s encuentra en la base de datos`
                    });
                }

                req.body.proveedor = proveedorStrored;
                pasoDos();
            });
        }else pasoDos();

    }
    function pasoDos(){
        var ordenId = req.params.id;
        ordenCompraModel.findByIdAndUpdate(ordenId, req.body , (err , ordenStored)=>{
            if(err){
                return res.status(500).send({
                    message : `ERROR al intentar actualizar el recurso en la base de datos ${err}`
                });
            }

            return res.status(200).send({
                datos: ordenStored
            });
        });
    }
}

function eliminar(req, res){
    let ordenId = req.params.id;
	ordenCompraModel.findByIdAndRemove(ordenId , (err)=>{
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