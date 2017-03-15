'use strict';

const materiaPrimaModel = require('../models/materia-prima');
const unidadMedidaModel = require('../models/unidades');

function listarAll(req, res){
    materiaPrimaModel.find({}, (err , materiaPrimaStored)=>{
        if(err){
            return res.status(500).send({
                message: `ERROR al intentar obtener la lista de materia prima ${err}`
            });
        }

        if(materiaPrimaStored.length < 1){
            return res.status(404).send({
                message: `ERROR no hay materia prima registradada`
            });
        }

        return res.status(200).send({
            datos : materiaPrimaStored
        });
    });
}

function listarById(req, res){
    let materiaPrimaId = req.params.id;
    materiaPrimaModel.findById(materiaPrimaId, (err , materiaPrimaStored)=>{
        if(err){
            return res.status(500).send({
                message : `ERROR al intentar obtener el recurso ${err}`
            });
        }

        if(!materiaPrimaStored){
            return res.status(404).send({
                message : `ERROR no se encuentra ningun registro con el ID indicado`
            });
        }

        return res.status(200).send({
            datos : materiaPrimaStored
        });

    })
}

function crear(req, res){
    if(req.body.unidad_medida){
        unidadMedidaModel.findById(req.body.unidad_medida._id, (err, unidadMedidaStrored)=>{
            if(err){
                return res.status(500).send({
                    message: `ERROR al buscar la unidad de medida ${err}`
                });
            }

            if(!unidadMedidaStrored){
                return res.status(404).send({
                    message: `ERROR la unidad de medida indicada no esta registradada en el sistema`
                });
            }
            req.body.unidad_medida = unidadMedidaStrored;
            insertar();
        })
    }else insertar();

    function insertar(){
        let newMateriaPrima = new materiaPrimaModel(req.body);
        newMateriaPrima.save((err , materiaPrimaStored)=>{
            if(err){
                return res.status(500).send({
                    message : `ERROR al intentar almacenar el recurso en la abse de datos ${err}`
                });
            }

            return res.status(200).send({
                datos: materiaPrimaStored
            });
        });
    }
}

function actualizar(req, res){
    if(req.body.unidad_medida){
        unidadMedidaModel.findById(req.body.unidad_medida._id, (err, unidadMedidaStrored)=>{
            if(err){
                return res.status(500).send({
                    message: `ERROR al buscar la unidad de medida ${err}`
                });
            }

            if(!unidadMedidaStrored){
                return res.status(404).send({
                    message: `ERROR la unidad de medida indicada no esta registradada en el sistema`
                });
            }
            req.body.unidad_medida = unidadMedidaStrored;
            Actuar();
        })
    }else Actuar();
    function Actuar(){
        let materiaPrimaId = req.params.id;
        materiaPrimaModel.findByIdAndUpdate(materiaPrimaId, req.body, (err, materiaPrimaStored)=>{
            if(err){
                return res.status(500).send({
                    message : `ERROR ocurrio un problema al intentar actualizar ${err}`
                });
            }

            return res.status(200).send({
                datos: materiaPrimaStored
            });
        });
    }    
}

function eliminar(req, res){
    let materiaPrimaId = req.params.id;
	materiaPrimaModel.findByIdAndRemove(materiaPrimaId , (err)=>{
		if(err){
			return res.status(500).send({
				message : `ERROR al intentar eliminar la el registro ${err}`
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