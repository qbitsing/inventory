'use strict';


const mongoose = require('mongoose');
const co = require('co');
const procesosModel = require('../models/procesos');

let listarAll = co.wrap(function * (req, res){
  try{
    let datos = yield procesosModel.find({},null, {short: {nombre: 1}});
    if(datos.length > 0){
      return res.status(200).send({
        datos
      });
    }

    return res.status(404).send({
      message: 'No hay procesos registrados en la bas de datos'
    });
  }catch(e){
    return res.status(500).send({
      message: `ERROR al listar los procesos ${e}`
    });
  }
});

let listarById = co.wrap(function * (req, res){
  try{
    let procesoId = req.params.id;
    let datos = yield procesosModel.findById(procesoId);

    if(!datos){
      return res.status(404).send({
        message: 'NO hay un proceso registrado con el id indicado'
      });
    }

    return res.status(200).send({
      datos
    });
  }catch(e){
    return res.status(500).send({
      message: `ERROR ${e}`
    });
  }
});

let crear = co.wrap(function * (req, res){
  try {
    let proceso = new procesosModel(req.body);
    let datos = yield proceso.save();
    return res.status(200).send({
      message: 'Proceso registrado con exito',
      datos
    });
  } catch (e) {
    return res.status(500).send({
      message:`ERROR ${e}`
    });
  }
});

let actualizar = co.wrap(function * (req, res){
  try {
    let procesoId = req.params.id;
    delete req.body._id;
    let proceso = yield procesosModel.findOneAndUpdate(procesoId, req.body);

    return res.status(200).send({
      message: 'Proceso actualizado con exito'
    });
  } catch (e) {
    return res.status(500).send({
      message:`ERROR ${e}`
    });
  }
});

let eliminar = co.wrap(function * (req, res){
  try {
    let procesoId = req.params.id;

    yield procesosModel.findByIdAndRemove(procesoId);

    return res.status(200).send({
      message: 'Proceso eliminado con exito'
    });
  } catch (e) {
    return res.status(500).send({
      message:`ERROR ${e}`
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