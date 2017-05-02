'use strict';

const personaModel = require('../models/personas');
const ciudadModel = require('../models/ciudades');
const bcrypt = require('bcrypt-nodejs');
const co = require('co');

function listarAll (req, res){
	let query = req.query;
	let promise = co.wrap(function * (){
		let condiciones = [];
		let personas = [];
		query.proveedor ? condiciones.push({proveedor : true}) : null;
		query.proveedorproductos ? condiciones.push({proveedorproductos: true}) : null;
		query.proveedorfabricacion ? condiciones.push({proveedorfabricacion: true}) : null;
		query.cliente ? condiciones.push({cliente : true}): null;
		query.administrador ? condiciones.push({administrador : true}): null;
		query.empleado ? condiciones.push({empleado : true}): null;
		if(query.proveedor || query.cliente || query.administrador || query.empleado || query.proveedorfabricacion || query.proveedorproductos)
			personas = yield personaModel.find({$or: condiciones},null, {short: {nombre: 1}});
		return res.send({datos: personas});
	});
	promise();

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
	var pass= "";
	var ciudad = null;
	if(req.body.ciudad){
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
			if(req.body.administrador|| req.body.super_administrador || req.body.contador || req.body.almacenista){
				pass = CreatePass();
				req.body.contrasena = encryptarContrasena(pass);
			}
			insertar();
		});
	}else {
		if(req.body.administrador|| req.body.super_administrador || req.body.contador || req.body.almacenista){
			pass = CreatePass();
			req.body.contrasena = encryptarContrasena(pass);

		}
		insertar();
	}
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
				datos : personaStored,
				pass
			});
		});
	}
}

function actualizar (req, res) {
	let personaId = req.params.id;
	if(req.body.pssactual){
		personaModel.findById(personaId, (err, _user)=>{
			if(err || !_user){
				return res.status(500).send({
					message : 'Los datos indicados no son correctos'
				});
			}
			if(bcrypt.compareSync(req.body.pssactual, _user.contrasena)){
				req.body.contrasena = encryptarContrasena(req.body.nueva);
			}
			Update();
		});
	}else Update();
	function Update(){
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

}

function login (req, res){
	let credentials = {
		correo : req.body.user
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
		if(bcrypt.compareSync(req.body.password , userLogin.contrasena)){
			return res.status(200).send({
				datos : userLogin
			});
		}else{
			return res.status(404).send({
				message : `Los datos ingresados no coinciden`
			});
		}


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

function encryptarContrasena(pass){
	return  bcrypt.hashSync(pass)
}
function contrasena(req , res){
	var pass = CreatePass();
	req.body.contrasena = encryptarContrasena(pass);
	personaModel.findOneAndUpdate({correo : req.body.correo},req.body,(err, _user)=>{
		if(err){
			return res.status(500).send({
				message: `Error interno del servidor ${err}`
			});
		}
		if(!_user){
			return res.status(404).send({
				message: `EL correo inicado no esta registrado en la base de datos`
			});
		}
		return res.status(200).send({
			pass
		});
	});
}
function CreatePass(){
	var pass = '';
	for(var i = 0; i<6; i++){
		pass+= Math.floor(Math.random()*10);
	}
	return pass;

}

module.exports = {
	listarAll,
	listarById,
	crear,
	actualizar,
	login,
	eliminar,
	contrasena
};
