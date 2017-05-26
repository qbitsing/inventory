'use strict';

const personaModel = require('../models/personas');
const ciudadModel = require('../models/ciudades');
const bcrypt = require('bcrypt-nodejs');
const co = require('co');
const transporter = require('../utils/email').transporter;

function listarAll (req, res){
	let query = req.query;
	let promise = co.wrap(function * (){
		let condiciones = [];
		let personas = [];
		query.proveedor ? condiciones.push({proveedor : true}) : null;
		query.proveedorproductos ? condiciones.push({proveedorproductos: true}) : null;
		query.proveedorfabricacion ? condiciones.push({proveedorfabricacion: true}) : null;
		query.cliente ? condiciones.push({cliente : true}): null;
		query.contador ? condiciones.push({contador : true}): null;
		query.almacenista ? condiciones.push({almacenista : true}): null;
		query.super_administrador ? condiciones.push({super_administrador : true}): null;
		query.empleado ? condiciones.push({empleado : true}): null;
		if(query.proveedor || query.contador || query.almacenista || query.cliente || query.super_administrador || query.empleado || query.proveedorfabricacion || query.proveedorproductos)
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

let crear = co.wrap(function * (req, res){
	try {
		let pass = '';
		if(req.body.ciudad){
			req.body.ciudad = yield ciudadModel.findById(req.body.ciudad._id);
		}
		if( req.body.super_administrador || req.body.contador || req.body.almacenista){
			pass = CreatePass();
			req.body.contrasena = encryptarContrasena(pass);
			let mailOptions = {
				from: 'Produciones Industriales Esperanza S.A.S.',
				to: req.body.correo,
				subject: 'Registro en la plataforma de inventario',
				text: `Cordial Saludo Sr(a) ${req.body.nombre} su registro en la plataforma de inventario ha sido exitoso su clave de acceso es: ${pass}`
			};
			let info = yield transporter.sendMail(mailOptions);
		}


		let persona = new personaModel(req.body);
		let datos = yield persona.save();
		
		return res.status(200).send({
			message: 'Persona Registrada con Exito',
			datos,
			pass
		});
	} catch (e) {
		return res.status(500).send({
			message: `ERROR ${e}`
		});
	}
});

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
				Update();
			}else{
				return res.status(500).send({
					message : `Contraseña Incorreca`
				});
			}
			
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
let contrasena = co.wrap(function * (req, res){
	try {
		let pass = CreatePass();

		let persona = yield personaModel.findOne({correo: req.body.correo});

		if(!persona){
			return res.status(404).send({
				message:'El correo indicado no se encuentra registrado en la base de datos por favor intentelo de nuevo'
			});
		}

		let mailOptions = {
			from: 'Produciones Industriales Esperanza S.A.S.',
			to: persona.correo,
			subject: 'cambio de contraseña',
			text: `Cordial Saludo Sr(a) ${persona.nombre} se realizo cambio de contraseña y ha sido exitoso su clave de acceso es: ${pass}`
		};

		let info = yield transporter.sendMail(mailOptions);

		persona.contrasena = encryptarContrasena(pass);

		yield personaModel.findByIdAndUpdate(persona._id, persona);

		return res.status(200).send({
			message: 'La contraseña nueva a sido enviada al correo indicado'
		});
	} catch (e) {
		return res.status(500).send({
			message: `ERROR ${e}`
		});
	}
});

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