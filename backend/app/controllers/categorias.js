'use strict';

const categoriaModel = require('../models/categorias');
const co = require('co');

let listarAll = co.wrap(function * (req, res){
    try {
        let datos = yield categoriaModel.find({}, null, {sort: {nombre: 1}} );
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

        let datos = yield categoria.save();

        return res.status(200).send({
            datos,
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

        yield categoriaModel.findByIdAndUpdate(categoriaId, req.body);

        return res.status(200).send({
            message: `categoria editada exitosamente`
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
