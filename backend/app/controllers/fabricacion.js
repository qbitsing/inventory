'use strict';

const personaModel = require('../models/personas');
const productosModel = require('../models/productos');
const ordenModel = require('../models/orden-venta');
const fabricacionModel = require('../models/fabricacion');
const mongoose = require('mongoose');
const co = require('co');

let listarAll = co.wrap(function * (req, res){
  try {
    let datos = yield fabricacionModel.find({});
    if(datos.length > 0){
      return res.status(200).send({
        datos
      });
    }
    return res.status(404).send({
      message: 'No hay procesos de fabricacion registrados en la base de datos'
    });
  } catch (e) {
    return res.status(500).send({
      message: `ERROR al listar los procesos de fabricacion ${e}`
    });
  }
});

let listarById = co.wrap(function * (req, res){
  try {
    let fabricacionId = req.params.id;
    let datos = fabricacionModel.findById(fabricacionId);
    if(!datos){
      return res.status(404).send({
        message: 'No hay un proceso de fabricacion con el id indicado en la base de datos'
      });
    }
    return res.status(200).send({
      datos
    });
  } catch (e) {
    return res.status(500).send({
      message: `ERROR al obtener el proceso de fabricacion ${e}`
    });
  }
});


let crear = co.wrap(function * (req, res){
  let fabricacion = req.body;
  try {
    let newfabricacion = new fabricacionModel(fabricacion);
    let newfabricacion1 = yield newfabricacion.save();
    return res.status(200).send({
      message: 'proceso de fabricacion registrado con exito',
      datos: newfabricacion1._id
    });
  } catch (e) {
    return res.status(500).send({
      message: `ERROR al registrar el proceso de fabricacion ${e}`
    });
  }
});


let actualizar = co.wrap(function * (req, res){
  let fabricacionId = req.params.id;

  try {
    yield fabricacionModel.findByIdAndUpdate(fabricacionId, req.body);
    return res.send({
      message: 'proceso de fabricacion actualizado con exito'
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
  actualizar
}
