'use strict';

const ciudadModel = require('../models/ciudades');

function listarAll (req, res){
	ciudadModel.find({} , (err , datos , count)=>{
        if(err) {
            return res.status(500).send({
                message : `ERROR al obtener la lista de ciudades ${err}`
            });            
        }
        if(datos.length < 1){
            return res.status(404).send({
                message : `No hay ciudades registradas en la BD`
            });
        }

        return res.status(200).send({
            datos
        });
    });
}

function listarById (req, res) {
	let ciudadId = req.params.id;
    ciudadModel.findById(ciudadId , (err , datos)=>{
        if(err) return res.status(500).send({message : `ERROR al tratar de obtener la ciudad por id ${err}`});
        return res.status(200).send({
            datos
        });
    })
}

function crear (req, res) {
	let ciudad = new ciudadModel(req.body);

    ciudad.save((err , datos)=>{
        if(err) return res.status(500).send({message : `ERROR al guardar la ciudad en la DB ${err}`});

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