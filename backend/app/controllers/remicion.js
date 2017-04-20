'use strict';

const co = require('co');
const remicionModel = require('../models/remicion');
const fabricacionModel = require('../models/fabricacion');

let listarAll = co.wrap(function * (req, res) {
  try {
    let remiciones = yield remicionModel.find({});

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
  try {
    
  } catch(e) {
    // statements
    console.log(e);
  }
});


module.exports = {
  listarAll
};
