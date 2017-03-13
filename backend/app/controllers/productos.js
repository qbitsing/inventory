'use strict';

const ProductoModel = require('../models/productos');
const unidadMedidaModel = require('../models/unidades');
const materiaPrimaModel = require('../models/materia-prima');

function listarAll(req, res){
    ProductoModel.find({}, (err , productoStrored)=>{
        if(err){
            return res.status(500).send({
                message: `ERROR al intentar obtener la lista de prductos ${err}`
            });
        }

        if(productoStrored.length < 1){
            return res.status(404).send({
                message: `ERROR no hay productos registrados`
            });
        }

        return res.status(200).send({
            datos : productoStrored
        });
    });
}

function listarById(req, res){
    let productoId = req.params.id;
    ProductoModel.findById(productoId, (err , productoStrored)=>{
        if(err){
            return res.status(500).send({
                message : `ERROR al intentar obtener el recurso ${err}`
            });
        }

        if(!productoStrored){
            return res.status(404).send({
                message : `ERROR no se encuentra ningun registro con el ID indicado`
            });
        }

        return res.status(200).send({
            datos : productoStrored
        });

    })
}

function crear(req, res){
    var insumosArray = [];
    if(req.body.insumos){
        var contador = 0;
        for(insumo of req.body.insumos){
            materiaPrimaModel.findById(insumo.id, (err, insumoStored)=>{
                if(err){
                    return res.status(500).send({
                        message: `ERROR al intentar obtener el insumo ${err}`
                    });
                }
                if(!insumoStored){
                    return res.status(404).send({
                        message: `ERROR alguno de los insumos indicados no esta en la base de datos ${insumo.nombre}`
                    });
                }
                insumosArray.push(insumoStored);
                contador ++;
                if(contador == res.body.insumos.length){
                    pasoDos();
                }

            });
        }
    }else pasoDos();

    function pasoDos(){
        if(req.body.unidad_medida){
            unidadMedidaModel.findById(req.body.unidad_medida.id, (err, unidadMedidaStrored)=>{
                if(err){
                    return res.status(500).send({
                        message: `ERROR al buscar la unidad de medida ${err}`
                    });
                }

                if(!unidadMedidaStrored){
                    return res.status(404).send({
                        message: `ERROR la unidad de medida indicada no esta registradada en el sistema`
                    });
                }
                req.body.unidad_medida = unidadMedidaStrored;
                insertar();
            })
        }else insertar();
    }
    

    function insertar(){
        let newMateriaPrima = new materiaPrimaModel(req.body);
        newMateriaPrima.save((err , materiaPrimaStored)=>{
            if(err){
                return res.status(500).send({
                    message : `ERROR al intentar almacenar el recurso en la abse de datos ${err}`
                });
            }

            return res.status(200).send({
                datos: materiaPrimaStored
            });
        });
    }
}

function actualizar(req, res){
    if(req.body.unidad_medida){
        unidadMedidaModel.findById(req.body.unidad_medida.id, (err, unidadMedidaStrored)=>{
            if(err){
                return res.status(500).send({
                    message: `ERROR al buscar la unidad de medida ${err}`
                });
            }

            if(!unidadMedidaStrored){
                return res.status(404).send({
                    message: `ERROR la unidad de medida indicada no esta registradada en el sistema`
                });
            }
            req.body.unidad_medida = unidadMedidaStrored;
            Actuar();
        })
    }else Actuar();
    function Actuar(){
        let materiaPrimaId = req.params.id;
        materiaPrimaModel.findByIdAndUpdate(materiaPrimaId, req.body, (err, materiaPrimaStored)=>{
            if(err){
                return res.status(500).send({
                    message : `ERROR ocurrio un problema al intentar actualizar ${err}`
                });
            }

            return res.status(200).send({
                datos: materiaPrimaStored
            });
        });
    }    
}

function eliminar(req, res){
    let materiaPrimaId = req.params.id;
	materiaPrimaModel.findByIdAndRemove(materiaPrimaId , (err)=>{
		if(err){
			return res.status(500).send({
				message : `ERROR al intentar eliminar la el registro ${err}`
			});
		}
		return res.status(200).send({
			message : `registro eliminado con exito`
		});
	});    
}

module.exports = {
    listarAll,
    listarById,
    crear,
    actualizar,
    eliminar
};