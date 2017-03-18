'use strict';

const ordenVentaModel = require('../models/orden-venta');
const clienteModel = require('../models/personas');
const productoModel = require('../models/productos');

function listarAll(req, res){
    ordenVentaModel.find({}, (err , ordenStored)=>{
        if(err){
            return res.status(500).send({
                message: `ERROR al intentar obtener la lista de ordenes de venta ${err}`
            });
        }

        if(ordenStored.length < 1){
            return res.status(404).send({
                message: `ERROR no hay ordenes de venta registradas`
            });
        }

        return res.status(200).send({
            datos : ordenStored
        });
    });
}

function listarById(req, res){
    let ordenId = req.params.id;
    ordenVentaModel.findById(ordenId, (err , ordenStored)=>{
        if(err){
            return res.status(500).send({
                message : `ERROR al intentar obtener el recurso ${err}`
            });
        }

        if(!ordenStored){
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
    var productosArray = [];
    var ErroresProductos = [];
    if(req.body.cliente){
        clienteModel.findById(req.body.cliente._id, (err, clienteStored)=>{
            if(err){
                return res.status(500).send({
                    message: `ERROR al intentar obtener el cliente ${err}`
                });
            }
            if(!clienteStored){
                return res.status(404).send({
                    message: `ERROR el cliente indicado no esta registrado en la base de datos`
                });
            }  
            req.body.cliente = clienteStored;
            pasoCero();

        });
    }else pasoCero();

    function pasoCero (){
        if(req.body.productos){
            var contador = 0;
            for(var producto of req.body.productos){
                productoModel.findById(producto._id, (err, productoStored)=>{
                    if(err){
                        ErroresProductos.push({
                            message: `ERROR al intentar obtener el producto ${err}`
                        });
                    }
                    if(!productoStored){
                        ErroresProductos.push({
                            message: `ERROR alguno de los productos indicados no esta en la base de datos ${producto.nombre}`
                        });
                    }
                    productoStored.cantidad = producto.cantidad;
                    productosArray.push(productoStored);
                    contador ++;
                    if(contador == req.body.productos.length){
                        req.body.productos = productosArray
                        pasoUno();
                    }

                });
            }
        }else pasoUno();
    }

    function pasoUno(){
        if(ErroresProductos.length>0){
            return res.status(500).send({
                ErroresProductos
            });
        }
        let newOrdenVenta = new ordenVentaModel(req.body);
        newOrdenVenta.save((err , ordenStored)=>{
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
    var ErroresProductos = [];
    var productosArray = [];
    if(req.body.cliente){
        clienteModel.findById(req.body.cliente._id, (err, clienteStored)=>{
            if(err){
                return res.status(500).send({
                    message: `ERROR al intentar obtener el cliente ${err}`
                });
            }
            if(!clienteStored){
                return res.status(404).send({
                    message: `ERROR el cliente indicado no esta registrado en la base de datos`
                });
            }  
            req.body.cliente = clienteStored;
            pasoCero();

        });
    }else pasoCero();

    function pasoCero (){
        if(req.body.productos){
            var contador = 0;
            for(var producto of req.body.productos){
                productoModel.findById(producto._id, (err, productoStored)=>{
                    if(err){
                        ErroresProductos.push({
                            message: `ERROR al intentar obtener el producto ${err}`
                        });
                    }
                    if(!productoStored){
                        ErroresProductos.push({
                            message: `ERROR alguno de los productos indicados no esta en la base de datos ${producto.nombre}`
                        });
                    }
                    productoStored.cantidad = producto.cantidad;
                    productosArray.push(productoStored);
                    contador ++;
                    if(contador == req.body.productos.length){
                        req.body.productos = productosArray
                        pasoUno();
                    }

                });
            }
        }else pasoUno();
    }

    function pasoUno(){
        if(ErroresProductos.length>0){
            return res.status(500).send({
                ErroresProductos
            });
        }
        var ordenId = req.params.id;
        ordenVentaModel.findByIdAndUpdate(ordenId, req.body , (err , ordenStored)=>{
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