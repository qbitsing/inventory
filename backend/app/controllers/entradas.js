'use strict';

const entradaModel = require('../models/entradas');
const personaModel = require('../models/personas');
const materiaModel = require('../models/materia-prima');
const productoModel = require('../models/productos');
const ordenModel = require('../models/orden-compra');

function listarAll(req, res){
    entradaModel.find({}, (err, entradaStored)=>{
        if(err){
            return res.status(500).send({
                message: `ERROR al intentar listar las entradas ${err}`
            });
        }

        if(entradaStored.length < 1){
            return res.status(404).send({
                message: `ERROR no hay entradas registradas en el sistema`
            });

        }

        return res.status(200).send({
            datos : entradaStored
        });
    });
}

function listarById(req, res){
    var entradaId = req.params.id;
    entradaModel.findById(entradaId , (err, entradaStored)=>{
        if(err){
            return res.status(500).send({
                message: `ERROR al intentar obtener el recurso ${err}`
            });
        }

        if(!entradaStored){
            return res.status(404).send({
                message:`ERROR el recurso no esta almacenado en la base de datos`
            });
        }

        return res.status(200).send({
            datos : entradaStored
        });
    });
}

function crear(req, res){
    var materiaArray = [];
    var erroresMateria = [];
    var productosArray = [];
    var erroresProductos = [];

    if(req.body.proveedor){
        personaModel.findById(req.body.proveedor._id, (err, proveedorStrored)=>{
            if(err){
                return res.status(500).send({
                    message:`ERROR al identificar al proveedor ${err}`
                });
            }

            if(!proveedorStrored){
                return res.status(404).send({
                    message : `Èl proveedor indicado no se encuentra registrado en la base de datos`
                });
            }

            req.body.proveedor = proveedorStrored;
            pasoCero();
        });
    }else pasoCero();

    function pasoCero(){
        if(req.body.orden_compra){
           ordenModel.findById(req.body.orden_compra._id, (err, proveedorStrored)=>{
                if(err){
                    return res.status(500).send({
                        message:`ERROR al identificar la orden_compra ${err}`
                    });
                }

                if(!proveedorStrored){
                    return res.status(404).send({
                        message : `La orden de compra indicada no se encuentra registrado en la base de datos`
                    });
                }

                req.body.orden_compra = proveedorStrored;
                pasoUno();
            }); 
        }else pasoUno();
    }

    function pasoUno(){
        if(req.body.persona_entrada){
            personaModel.findById(req.body.persona_entrada._id, (err, persona_entradaStrored)=>{
                if(err){
                    return res.status(500).send({
                        message:`ERROR al identificar la persona que autoriza ${err}`
                    });
                }

                if(!persona_entradaStrored){
                    return res.status(404).send({
                        message : `La  persona que autoriza indicado no se encuentra registrado en la base de datos`
                    });
                }

                req.body.persona_entrada = persona_entradaStrored;
                pasoDos();
            });
        }else pasoDos();
    }

    function pasoDos(){
        var orden = req.body.orden_compra;
        orden.productos = orden.productos.map(prod =>{
            for(var req_pro of req.body.productos){

            }
        });
    }
}

function actualizar(req, res){

}

function eliminar(req, res){

}


module.exports = {
    listarAll,
    listarById,
    crear,
    actualizar,
    eliminar
};

