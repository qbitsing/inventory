'use strict';

const departamentoModel = require('../models/departamentos');

function listarAll (req, res){
	departamentoModel.find({} , (err , departamentosStored)=>{
        if(err) {
            return res.status(500).send({
                message : `ERROR al obtener la lista de departamentos ${err}`
            });            
        }
        if(departamentosStored.length < 1){
            return res.status(404).send({
                message : `No hay departamentos registrados en la BD`
            });
        }

        return res.status(200).send({
            departamentosStored
        });
    });
}

function listarById (req, res) {
	let departamentoId = req.params.id;
    departamentoModel.findById(departamentoId , (err , departamentoStored)=>{
        if(err){
          return res.status(500).send({
              message : `ERROR al tratar de obtener el departamento por id ${err}`
            });  
        }

        if(!departamentoStored){
            return res.status(404).send({
              message : `El departamento no existe`
            });  
        } 
        return res.status(200).send({
            departamentoStored
        });
    })
}

function crear (req, res) {
	let departamento = new departamentoModel(req.body);

    departamento.save((err , departamentoStored)=>{
        if(err) return res.status(500).send({message : `ERROR al guardar el departamento en la DB ${err}`});

        return res.status(200).send({
            departamentoStored
        });
    });
}



module.exports = {
	listarAll,
	listarById,
    crear
};