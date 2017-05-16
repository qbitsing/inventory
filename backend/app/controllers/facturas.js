'use strict';

const facturaModel = require('../models/facturas');
const ordenModel = require('../models/orden-venta');
const co = require('co');


let listarAll = co.wrap(function * (req, res) {
    try {
        let datos = yield facturaModel.find({});

        if(datos.length < 1){
            return res.status(404).send({
                message: 'No hay facturas registradas en la base de datos'
            });
        }

        return res.status(200).send({
            datos
        });
    } catch(e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }       
});

let crear = co.wrap(function * (req, res) {
    try {
        let newFactura = new facturaModel(req.body);

        let datos = yield newFactura.save();

        return res.status(200).send({
            message: 'Factura registrada con exito',
            datos
        });
    } catch(e) {
        return res.status(500).send({
            message: `ERROR ${e.message}`
        });
    }
});

let anular = co.wrap(function * (req, res) {
    try {
        let facturaId = req.params.id;
        yield facturaModel.findByIdAndUpdate(facturaId, {
            estado: 'cancelada', 
            observacion: req.body.observacion
        });

        return res.status(200).send({
            message: 'Factura anulada con exito'
        });
    } catch(e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

module.exports = {
    listarAll,
    crear,
    anular
}