'use strict';

const unidadModel = require('../models/unidades');

function listarAll (req, res){
	unidadModel.find({} , (err , datos , count)=>{
        if(err) {
            return res.status(500).send({
                message : `ERROR al obtener la lista de unidades ${err}`
            });            
        }
        if(datos.length < 1){
            return res.status(404).send({
                message : `No hay unidades registradas en la BD`
            });
        }

        return res.status(200).send({
            datos
        });
    });
}

function crear (req, res) {
	let unidad = new unidadModel(req.body);

    unidad.save((err , datos)=>{
        if(err) return res.status(500).send({message : `ERROR al guardar la unidad en la DB ${err}`});

        return res.status(200).send({
            datos
        });
    });
}

function eliminar(req , res){
    let unidadId = req.params.id;
	unidadModel.findByIdAndRemove(unidadId , (err)=>{
		if(err){
			return res.status(500).send({
				message : `ERROR al intentar eliminar la unidad ${err}`
			});
		}
		return res.status(200).send({
			message : `Unidad eliminada con exito`
		});
	});
}


module.exports = {
	listarAll,
	eliminar,
    crear
};