'use strict';

const ordenCompraModel = require('../models/orden-compra');
const proveedorModel = require('../models/personas');
const productoModel = require('../models/productos');
const materiaPrimaModel = require('../models/materia-prima');
const co = require('co');


let listarAll = co.wrap(function * (req, res){
    try {
        let query = req.query;
        let condiciones = [];
        query.Activo ? condiciones.push({estado: 'Activo'}) : null;
        query.Finalizado ? condiciones.push({estado: 'Finalizado'}) : null;
        query.Entradas ? condiciones.push({estado: 'Con Entradas'}) : null;

        let datos = [];

        if(query.Activo || query.Finalizado || query.Entradas)        
            datos = yield ordenCompraModel.find({$or: condiciones}, null, {sort: {fecha: -1}});
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
            proveedor = yield proveedorModel.findById(req.body.proveedor._id);

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
            datos
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

        let proveedor;
        if(req.body.proveedor){
            proveedor = yield proveedorModel.findById(req.body.proveedor._id);

            if(!proveedor){
                return res.status(404).send({
                    message: `ERROR el proveedor indicado no s encuentra en la base de datos`
                });
            }
        }

        yield ordenCompraModel.findByIdAndUpdate(ordenId, req.body);

        return res.status(200).send({
            message: 'Orden de Compra Actualizada con Exito'
        });

    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let eliminar = co.wrap(function * (req, res){
    try {
        let ordenId = req.params.id;
        let orden = yield ordenCompraModel.findById(ordenId);

        if(orden.estado != 'Activo') return res.status(400).send({message: 'La orden no se puede cancelar ya que no esta activa'});

        yield ordenCompraModel.findByIdAndRemove(ordenId);

        return res.status(200).send({
            message: 'Orden de Compra Eliminada con Exito'
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
    actualizar,
    eliminar
};
