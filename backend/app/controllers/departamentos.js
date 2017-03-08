'use strict';

const departamentoModel = require('../models/departamentos');

function listarAll (req, res){
	departamentoModel.find({} , (err , datos)=>{
        if(err) {
            return res.status(500).send({
                message : `ERROR al obtener la lista de departamentos ${err}`
            });            
        }
        if(datos.length < 1){
            return res.status(404).send({
                message : `No hay departamentos registrados en la BD`
            });
        }

        return res.status(200).send({
            datos
        });
    });
}

function listarById (req, res) {
	let departamentoId = req.params.id;
    departamentoModel.findById(departamentoId , (err , datos)=>{
        if(err){
          return res.status(500).send({
              message : `ERROR al tratar de obtener el departamento por id ${err}`
            });  
        }

        if(!datos){
            return res.status(404).send({
              message : `El departamento no existe`
            });  
        } 
        return res.status(200).send({
            datos
        });
    })
}

function crear (req, res) {
	let departamento = new departamentoModel(req.body);

    departamento.save((err , datos)=>{
        if(err) return res.status(500).send({message : `ERROR al guardar el departamento en la DB ${err}`});

        return res.status(200).send({
            datos
        });
    });
}



module.exports = {
	listarAll,
	listarById,
    crear
};