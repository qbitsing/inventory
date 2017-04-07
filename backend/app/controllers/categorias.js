'use strict';

const categoriaModel = require('../models/categorias');
const co = require('co');

let listarAll = co.wrap(function * (req, res){
    try {
        let datos = yield categoriaModel.find({});
        if(datos.length > 0){
            return res.status(200).send({
                datos
            });
        }

        return res.status(404).send({
            message: 'No hay categorias registradas en la base de datos'
        });
    } catch (e) {
       return res.status(500).send({
           message: `ERROR ${e}`
       }); 
    }
});

let crear = co.wrap(function * (req, res){
    try {
        let categoria = new categoriaModel(req.body);

        let datos = categoria.save();

        return res.status(200).send({
            datos: datos._id,
            message: 'categoria creada exitosamente'
        });
    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let eliminar = co.wrap(function * (req, res){
    try {
        let categoriaId = req.params.id;

        yield categoriaModel.findByIdAndRemove(categoriaId);

        return res.status(200).send({
            message: `categoria eliminada exitosamente`
        });
    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

module.exports = {
	listarAll,
	eliminar,
    crear
};
