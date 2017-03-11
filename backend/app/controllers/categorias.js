'use strict';

const categoriaModel = require('../models/categorias');

function listarAll (req, res){
	categoriaModel.find({} , (err , datos)=>{
        if(err) {
            return res.status(500).send({
                message : `ERROR al obtener la lista de categorias ${err}`
            });            
        }
        if(datos.length < 1){
            return res.status(404).send({
                message : `No hay categorias registradas en la BD`
            });
        }

        return res.status(200).send({
            datos
        });
    });
}

function crear (req, res) {
	let categoria = new categoriaModel(req.body);

    categoria.save((err , datos)=>{
        if(err) return res.status(500).send({message : `ERROR al guardar la categoria en la DB ${err}`});

        return res.status(200).send({
            datos
        });
    });
}

function eliminar(req , res){
    let categoriaId = req.params.id;
	categoriaModel.findByIdAndRemove(categoriaId , (err)=>{
		if(err){
			return res.status(500).send({
				message : `ERROR al intentar eliminar la categoria ${err}`
			});
		}
		return res.status(200).send({
			message : `categoria eliminada con exito`
		});
	});
}


module.exports = {
	listarAll,
	eliminar,
    crear
};