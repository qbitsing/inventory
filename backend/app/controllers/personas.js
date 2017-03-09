'use strict';

const personaModel = require('../models/personas');
const ciudadModel = require('../models/ciudades');

function listarAll (req, res){
	var query = req.query;
	var personasToReturn = [];
	responder();
	if(query.proveedor){
		personaModel.find({proveedor : true},(err , personasStored) => {
			if(err){
				return res.status(500).send({
					message : `ERROR al tratar de listar las personas: ${err}`
				});
			}
			personasToReturn = personasToReturn.concat(personasStored);
			query.proveedor = !query.proveedor;
			responder();
		});
	}
	if(query.cliente){
		personaModel.find({cliente : true},(err , personasStored) => {
			if(err){
				return res.status(500).send({
					message : `ERROR al tratar de listar las personas: ${err}`
				});
			}
			personasToReturn = personasToReturn.concat(personasStored);
			query.cliente = !query.cliente;
			responder();
		});
	}
	if(query.administrador){
		personaModel.find({administrador : true},(err , personasStored) => {
			if(err){
				return res.status(500).send({
					message : `ERROR al tratar de listar las personas: ${err}`
				});
			}
			personasToReturn = personasToReturn.concat(personasStored);
			query.administrador = !query.administrador;
			responder();
		});
	}
	if(query.empleado){
		personaModel.find({empleado : true},(err , personasStored) => {
			if(err){
				return res.status(500).send({
					message : `ERROR al tratar de listar las personas: ${err}`
				});
			}
			personasToReturn = personasToReturn.concat(personasStored);
			query.empleado = !query.empleado;
			responder();
		});
	}
	function responder(){
		if(!query.proveedor  && !query.cliente && !query.administrador && !query.empleado){
			res.status(200).send({
				datos : personasToReturn
			});
		}
	}
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
			datos : personaStored
		});
	});
}

function crear (req, res) {
	var ciudad = null;
	if(req.body.ciudad._id){
		ciudadModel.findById(req.body.ciudad._id , (err , ciudadStored)=>{
			if(err){
				return res.status(500).send({
					message : `Error al buscar la ciudad ${err}`
				});
			}

			if(!ciudadStored){
				return res.status(404).send({
					message : `Error la ciudad indicada no se encuentra en la BD`
				});
			}

			ciudad = ciudadStored;
			insertar();
		});
	}else insertar();

	function insertar(){
		req.body.ciudad = ciudad;
		var persona = new personaModel(req.body);
		persona.save((err, personaStored)=>{
			if(err){
				return res.status(500).send({
					message : `Error al guardar la persona en la base de datos: ${err}`
				});
			} 
			return res.status(200).send({
				datos : personaStored
			});
		});
	}
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
			datos : personaStored
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
			datos : userLogin
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
