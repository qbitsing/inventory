'use strict';

const mongoose = require('mongoose');
const entradaModel = require('../models/entradas-remision');
const productosModel = require('../models/productos');
const remisionModel = require('../models/remicion');
const fabricacionModel = require('../models/fabricacion');
const co = require('co');

let listarAll = co.wrap(function * (req, res){
    try {
        let datos = yield entradaModel.find({});
        if(datos.length < 1){
            return res.status(404).send({
                message : 'No hay entradas registradas en la base de datos'
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
    let entradaId = req.params.id;
    try {
        let datos = yield entradaModel.findById(entradaId);

        if(!datos){
            return res.status(404).send({
                message:'El id indicaco con coincide con ninguna entrada en la base de datos'
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

let crear = co.wrap(function * (req, res){
    let entrada = req.body;
    try {
        if(entrada.productos.length > 0){
            for(var pro of entrada.productos){
                yield productosModel.findByIdAndUpdate(pro.producto._id, {$inc: {cantidad : pro.cantidad}});
            }
        }else{
            return res.status(400).send({
                message: 'Para poder realizar la entrada es necesario que indique los productos a ingresar'
            });
        }

        if(entrada.remision){
            entrada.typeRemision = true;
            yield remisionModel.findByIdAndUpdate(entrada.remision._id, entrada.remision);            
        }

        yield fabricacionModel.findByIdAndUpdate(entrada.fabricacion._id, entrada.fabricacion);

        let newEntrada = new entradaModel(entrada);

        let datos = yield newEntrada.save();

        return res.status(200).send({
            message: 'Entrada registrada con exito',
            datos
        });

    } catch (e) {
        return res.status(500).send({
            message:`ERROR ${e}`
        });
    }
});

let eliminar = co.wrap(function * (req, res){
    let entradaId = req.params.id;
    let remision = req.body.remision;
    let fabricacion = req.body.fabricacion;
    try {
        let entrada = yield entradaModel.findById(entradaId);
        if(!entrada){
            return res.status(404).send({
                message:'El Id indicado no coincie con ninguna entrada en la base de datos'
            });
        }

        for(var pro of entrada.productos){
            yield productosModel.findByIdAndUpdate(pro.producto._id, {$inc: {cantidad : (pro.cantidad * -1)}});            
        }
        entrada.typeRemision ? yield remisionModel.findByIdAndUpdate(entrada.remision._id, remision) : null;

        yield fabricacionModel.findByIdAndUpdate(entrada.fabricacion._id, fabricacion);

        yield entradaModel.findByIdAndUpdate(entrada._id , {estado: 'Cancelada', asunto: req.body.asunto});
    } catch (e) {
        return res.status(500).send({
            message:`ERROR ${e}`
        });
    }
});

module.exports = {
    crear,
    listarAll,
    listarById,
    eliminar
}