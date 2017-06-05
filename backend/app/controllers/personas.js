'use strict';

const personaModel = require('../models/personas');
const ciudadModel = require('../models/ciudades');
const bcrypt = require('bcrypt-nodejs');
const co = require('co');
const transporter = require('../utils/email').transporter;
const fs = require('fs');
let mkdirp = require('mkdirp');
const exec = require('child_process').execSync;


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
			console.log(mailOptions);
			let info = yield transporter.sendMail(mailOptions);
		}


		let persona = new personaModel(req.body);
		let datos = yield persona.save();

		if (req.body.myImage) {

			let myImage = req.body.myImage.split(',')[1];
			let Image = req.body.Image.split(',')[1];

			let bufMyImage = new Buffer(myImage, 'base64');
			let bufImage = new Buffer(Image, 'base64');
			mkdirp.sync('assest/users');
			mkdirp.sync(`assest/users/${datos._id}`);
			fs.writeFile(`assest/users/${datos._id}/myImage.png`, bufMyImage);
			fs.writeFile(`assest/users/${datos._id}/Image.png`, bufImage);

		}
		
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

let actualizar = co.wrap(function * (req, res){
	try{

		let personaId = req.params.id;

		if (req.body.pssactual) {
			let persona = yield personaModel.findById(personaId);

			if(bcrypt.compareSync(req.body.pssactual, persona.contrasena)){

				req.body.contrasena = encryptarContrasena(req.body.nueva);

			}else{

				return res.status(500).send(
					{
						message: 'La contraseña indicada no es correcta'
					}
				);

			}

		}

		let update = yield personaModel.findByIdAndUpdate(personaId, req.body);

		if (req.body.myImage) {

			let myImage = req.body.myImage.split(',')[1];
			let Image = req.body.Image.split(',')[1];

			let bufMyImage = new Buffer(myImage, 'base64');
			let bufImage = new Buffer(Image, 'base64');
			mkdirp.sync('assest/users');
			mkdirp.sync(`assest/users/${update._id}`);
			fs.writeFile(`assest/users/${update._id}/myImage.png`, bufMyImage);
			fs.writeFile(`assest/users/${update._id}/Image.png`, bufImage);

		}

		return res.status(200).send({
			message: 'los datos se han actualizado con exito'
		});

	}
	catch(e){
		return res.status(500).send({
			message: `ERROR ${e}`
		});
	}
});

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