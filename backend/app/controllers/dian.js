'use strict';

const categoriaModel = require('../models/dian');
const co = require('co');

let get = co.wrap(function * (req, res){
    try {
        let datos = yield categoriaModel.findOne({});
        return res.status(200).send({
            datos
        });
    } catch (e) {
       return res.status(500).send({
           message: `ERROR ${e}`
       }); 
    }
});

let set = co.wrap(function * (req, res){
    try {
        yield categoriaModel.remove({});

        let categoria = new categoriaModel(req.body);

        let datos = yield categoria.save();

        return res.status(200).send({
            datos,
            message: 'Datos de factura actualizados con exito'
        });
    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});


module.exports = {
	get,
	set
};