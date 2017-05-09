'use strict';

const co = require('co');
const remicionModel = require('../models/remicion');
const fabricacionModel = require('../models/fabricacion');

let listarAll = co.wrap(function * (req, res) {
  try {
    let remiciones = yield remicionModel.find({}, null, {short: {fecha_solicitud: -1}});

    if(remiciones.length < 1){
      return res.status(404).send({
        message: 'No hay remiciones registradas en la base de datos'
      });
    }

    return res.status(200).send({
      datos: remiciones
    });
  } catch(e) {
    return res.status(500).send({
      message: `ERROR ${e}`
    });
  } 
});

let listarById = co.wrap(function * (req, res){
  let remicionId = req.params.id;
  try {
    let remicion = yield remicionModel.findById(remicionId);

    if(!remicion){
      return res.status(404).send({
        message: 'El ID indicado no pertenece a ninguna remicion en la base de datos'
      });
    }

    return res.status(200).send({
      datos: remicion
    });
  } catch(e) {
    return res.status(500).send({
      message: `ERROR ${e}`
    });
  }
});

let crear = co.wrap(function * (req, res) {
  let remicion = req.body;
  remicion.fabricacion.estado_remision = 'Con Remision';
  try {
    yield fabricacionModel.findByIdAndUpdate(remicion.fabricacion._id, remicion.fabricacion);

    let newRemision = new remicionModel(remicion);

    let saveRimision = yield newRemision.save();

    return res.status(200).send({
      message: 'Remisión registrada con exito',
      datos: saveRimision
    });
  } catch(e) {
    return res.status(500).send({
      message:`ERROR ${e}`
    });
  }
});


let eliminar = co.wrap(function *(req, res) {
  let remisionId = req.params.id;
  let remision = req.body;
  remision.estado = 'Cancelada';
  try {
    yield fabricacionModel.findByIdAndUpdate(remision.fabricacion._id, remision.fabricacion);

    yield remicionModel.findByIdAndUpdate(remisionId, remision);

    return res.status(200).send({
      message:'Remisión cancelada con exito'
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
  eliminar
};
