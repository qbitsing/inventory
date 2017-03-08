'use strict';

const materiaPrimaModel = require('../materia-prima');

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

function actualizar(req, res){
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