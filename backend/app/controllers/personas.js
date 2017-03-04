'use strict';

const personaModel = require('../models/personas');

function listarAll (req, res){
	res.send(`Se van a listar todas las personas`);
}

function listarById (req, res) {
	res.send(`Se van a listar todas las personas`);
}

function crear (req, res) {
	var persona = new personaModel(req.body);
	persona.save((err, personaStored)=>{
		if(err) return res.status(500).send({message : `Error al guardar la persona en la base de datos ${err}`});
		return res.status(200).send({
			personaStored
		});
	});
}

function actualizar (req, res) {
	res.send(`Se van a listar todas las personas`);
}

function login (req, res){
	console.log(req);
	res.status(200).send({Estado:1,datos : req.body , message : "Datos enviados por el cliente"});
}
function eliminar (req, res) {
	let personaId = req.params.id;
	personaModel.find({documento : personaId} , (err , personaStored)=>{
		if(err) return res.status(404).send({message : `ERROR al identificar la persona ${err}`});
		for(var persona of personaStored){
			persona.remove((err)=>{
				if(err){
					return res.status(500).send({message : err});
				}
			});
		}
	});
}

module.exports = {
	listarAll,
	listarById,
	crear,
	actualizar,
	login,
	eliminar
};
