'use strict';

const mongoose = require('mongoose');
const co = require('co');
const materiaModel = require('../models/materia-prima.js');
const productosModel = require('../models/productos.js');
const salidaModel = require('../models/salidas-fabricacion.js');


let listarAll = co.wrap(function * (req, res){
    try {
        let datos = yield salidaModel.find({},null, {short: {fecha: -1}});

        if(datos.length < 1){
            return res.status(404).send({
                message: 'No hay salidas registradas en la base de datos'
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
    try {
        let salidaId = req.params.id;
        let datos = yield salidaModel.findById(salidaId);
        if(!datos){
            return res.status(404).send({
                message: 'La salida indicada no esta registrada en la base de datos'
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
    try {
        let salida = new salidaModel(req.body);
        let productos = [];
        let materias = [];
        for(let producto of salida.productos){
            let productoToEdit = yield productosModel.findById(producto.producto._id);
            productoToEdit.cantidad -= producto.cantidad;
            yield productosModel.findByIdAndUpdate(productoToEdit._id, productoToEdit);
            productos.push(productoToEdit);
        }

        for(let materia of salida.materia_prima){
            let materiaToEdit = yield materiaModel.findById(materia.materia._id);
            materiaToEdit.cantidad -= materia.cantidad;
            yield materiaModel.findByIdAndUpdate(materiaToEdit._id, materiaToEdit);
            materias.push(materiaToEdit);
        }

        let datos = yield salida.save();

        return res.status(200).send({
            message: 'Salida registrada con exito',
            datos,
            productos,
            materias
        });

    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let eliminar = co.wrap(function * (req, res){
    try {
        let salida = req.body;
        let productos = [];
        let materias = [];
        salida.estado = 'Cancelada';
        for(let producto of salida.productos){
          let productoToEdit = yield productosModel.findById(producto.producto._id);
          productoToEdit.cantidad += producto.cantidad;
          yield productosModel.findByIdAndUpdate(productoToEdit._id, productoToEdit);
          productos.push(productoToEdit);
        }

        for(let materia of salida.materia_prima){
          let materiaToEdit = yield materiaModel.findById(materia.materia._id);
          materiaToEdit.cantidad -= materia.cantidad;
          yield materiaModel.findByIdAndUpdate(materiaToEdit._id, materiaToEdit);
          materias.push(materiaToEdit);
        }

        yield salidaModel.findByIdAndUpdate(salida._id, salida);

        return res.status(200).send({
            message: 'Salida cancelada con exito',
            productos,
            materias
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
    eliminar

}
