'use strict';

const personaModel = require('../models/personas');

function listarAll (req, res){
	personaModel.find((err , personasStored) => {
		if(err){
			return res.status(500).send({
				message : `ERROR al tratar de listar las personas: ${err}`
			});
		}

		if(!personasStored){
			return res.status(404).send({
				message : `No hay personas registradas en la BD`
			});
		}

		return res.status(200).send({
			personasStored
		});

	});
}

function listarById (req, res) {
	let personaId = req.params.id;
	personaModel.findById(personaId , (err , personaStored)=>{
		if(err){
			return res.status(500).send({
				message : `ERROR al tratar de listar la persona: ${err}`
			});
		}

		if(!personaStored){
			return res.status(404).send({
				message : `No Existe una persona registrada con ese id`
			});
		}

		return res.status(200).send({
			personaStored
		});
	});
}

function crear (req, res) {
	console.log('entro');
	console.log(req.body);
	var persona = new personaModel(req.body);
	persona.save((err, personaStored)=>{
		if(err){
			return res.status(500).send({
				message : `Error al guardar la persona en la base de datos: ${err}`
			});
		} 
		return res.status(200).send({
			personaStored
		});
	});
}

function actualizar (req, res) {
	let personaId = req.params.id;
	personaModel.findByIdAndUpdate(personaId , req.body ,(err , personaStored)=>{
		if(err){
			return res.status(500).send({
				message : `ERROR al intentar actualizar la persona ${err}`
			});
		}

		return res.status(200).send({
			personaStored
		});
	});
}

function login (req, res){
	let credentials = {
		correo : req.body.user,
		contrasena : req.body.password
	};
	personaModel.findOne(credentials , (err , userLogin) => {
		if(err){
			return res.status(500).send({
				message : `Error al intentar validar el usuario: ${err}`
			});
		}

		if(!userLogin){
			return res.status(404).send({
				message : `Los datos ingresados no coinciden`
			});
		}

		return res.status(200).send({
			userLogin
		});

	})
}
function eliminar (req, res) {
	let personaId = req.params.id;
	personaModel.findByIdAndRemove(personaId , (err)=>{
		if(err){
			return res.status(500).send({
				message : `ERROR al intentar eliminar la persona ${err}`
			});
		}
		return res.status(200).send({
			message : `Persona eliminada con exito`
		});
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
