'use strict';

const entradaModel = require('../models/entradas');
const personaModel = require('../models/personas');
const materiaModel = require('../models/materia-prima');
const productoModel = require('../models/productos');
const ordenModel = require('../models/orden-compra');

function listarAll(req, res){
    entradaModel.find({}, (err, entradaStored)=>{
        if(err){
            return res.status(500).send({
                message: `ERROR al intentar listar las entradas ${err}`
            });
        }

        if(entradaStored.length < 1){
            return res.status(404).send({
                message: `ERROR no hay entradas registradas en el sistema`
            });

        }

        return res.status(200).send({
            datos : entradaStored
        });
    });
}

function listarById(req, res){
    var entradaId = req.params.id;
    entradaModel.findById(entradaId , (err, entradaStored)=>{
        if(err){
            return res.status(500).send({
                message: `ERROR al intentar obtener el recurso ${err}`
            });
        }

        if(!entradaStored){
            return res.status(404).send({
                message:`ERROR el recurso no esta almacenado en la base de datos`
            });
        }

        return res.status(200).send({
            datos : entradaStored
        });
    });
}

function crear(req, res){
    if(req.body.orden_compra){
        if(req.body.orden_compra.materia_prima.length > 0){
            req.body.orden_compra.materia_prima = req.body.orden_compra.materia_prima.map((materia_prima)=>{
                
            });
        }
    }
}

function actualizar(req, res){

}

function eliminar(req, res){

}


module.exports = {
    listarAll,
    listarById,
    crear,
    actualizar,
    eliminar
};

