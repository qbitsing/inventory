'use strict';

const ordenCompraModel = require('../models/orden-compra');
const proveedorModel = require('../models/personas');
const productoModel = require('../models/productos');
const materiaPrimaModel = require('../models/materia-prima');

function listarAll(req, res){
    ordenCompraModel.find({}, (err , ordenStored)=>{
        if(err){
            return res.status(500).send({
                message: `ERROR al intentar obtener la lista de ordenes de compra ${err}`
            });
        }

        if(ordenStored.length < 1){
            return res.status(404).send({
                message: `ERROR no hay ordenes de compra registradas`
            });
        }

        return res.status(200).send({
            datos : ordenStored
        });
    });
}

function listarById(req, res){
    let ordenId = req.params.id;
    ordenCompraModel.findById(ordenId, (err , ordenStored)=>{
        if(err){
            return res.status(500).send({
                message : `ERROR al intentar obtener el recurso ${err}`
            });
        }

        if(!productoStrored){
            return res.status(404).send({
                message : `ERROR no se encuentra ningun registro con el ID indicado`
            });
        }

        return res.status(200).send({
            datos : ordenStored
        });

    });
}

function crear(req, res){
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
        let newOrdenCompra = new ordenCompraModel(req.body);
        newOrdenCompra.save((err , ordenStored)=>{
            if(err){
                return res.status(500).send({
                    message : `ERROR al intentar almacenar el recurso en la base de datos ${err}`
                });
            }

            return res.status(200).send({
                datos: ordenStored
            });
        });
    }
}

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
        })
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