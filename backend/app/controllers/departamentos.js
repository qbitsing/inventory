'use strict';

const ciudadModel = require('../models/ciudades');

function listarAll (req, res){
	ciudadModel.find({} , (err , ciudadesStrored)=>{
        if(err) return res.status(500).send({message : `ERROR al obtener la lista de ciudades ${err}`});

        return res.status(200).send({
            ciudadesStrored
        });
    });
}

function listarById (req, res) {
	let ciudadId = req.params.id;
    ciudadModel.findById(ciudadId , (err , cuidadStored)=>{
        if(err) return res.status(500).send({message : `ERROR al tratar de obtener la ciudad por id ${err}`});
        return res.status(200).send({
            cuidadStored
        });
    })
}

function crear (req, res) {
	let ciudad = new ciudadModel(req.body);

    ciudad.save((err , cuidadStored)=>{
        if(err) return res.status(500).send({message : `ERROR al guardar la ciudad en la DB ${err}`});

        return res.status(200).send({
            cuidadStored
        });
    });
}


module.exports = {
	listarAll,
	listarById,
    crear
};