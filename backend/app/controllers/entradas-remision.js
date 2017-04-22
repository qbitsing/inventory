'use strict';

const mongoose = require('mongoose');
const entradaModel = require('../models/entradas-remision');
const productosModel = require('../models/productos');
const co = require('co');

let listarAll = co.wrap(function * (req, res){
    try {
        let datos = yield entradaModel.find({});
        if(datos.lenght < 1){
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
        let datos = new entradaModel(entrada);
        let datos1 = yield datos.save();
        return res.send(datos1);
    } catch (e) {
        return res.status(500).send({
            message:`ERROR ${e}`
        });
    }
});

module.exports = {
    crear
}