'use strict';

const ProductoModel = require('../models/productos');
const unidadMedidaModel = require('../models/unidades');
const materiaPrimaModel = require('../models/materia-prima');
const categoriaModel = require('../models/categorias');

function listarAll(req, res){
    ProductoModel.find({},null, {short: {nombre: 1}}, (err , productoStrored)=>{
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

    });
}

function crear(req, res){
    var insumosArray = [];
    var productosArray = [];
    var ErroresInsumos = [];
    var ErroresProductos = [];
    if(req.body.Insumos){
        var contador = 0;
        for(var insumo of req.body.Insumos){
            materiaPrimaModel.findById(insumo._id, (err, insumoStored)=>{
                if(err){
                    ErroresInsumos.push({
                        message: `ERROR al intentar obtener el insumo ${err}`
                    });
                }
                if(!insumoStored){
                   ErroresInsumos.push({
                        message: `ERROR alguno de los insumos indicados no esta en la base de datos ${insumo.nombre}`
                    });
                }
                insumoStored.cantidad = insumo.cantidad;
                insumosArray.push(insumoStored);
                contador ++;
                if(contador == req.body.Insumos.length){
                    req.body.Insumos = insumosArray
                    pasoUno();
                }

            });
        }
    }else if(req.body.productos){
        var contador = 0;
        for(var producto of req.body.productos){
            ProductoModel.findById(producto._id, (err, productoStored)=>{
                if(err){
                    ErroresProductos.push(500).send({
                        message: `ERROR al intentar obtener el producto ${err}`
                    });
                }
                if(!productoStored){
                    ErroresProductos.push({
                        message: `ERROR alguno de los productos indicados no esta en la base de datos ${producto.nombre}`
                    });
                }
                productoStored.cantidad = producto.cantidad;
                productosArray.push(productoStored);
                contador ++;
                if(contador == req.body.productos.length){
                    req.body.productos = productosArray
                    pasoUno();
                }

            });
        }
    }else pasoUno();

    function pasoUno(){
        if(ErroresProductos.length > 0){
            return res.status(500).send({
                ErroresProductos
            });
        }
        if(ErroresInsumos.length > 0){
            return res.status(500).send({
                ErroresInsumos
            });
        }
        if(req.body.categoria){
            categoriaModel.findById(req.body.categoria._id, (err , categoriaStored)=>{
                if(err){
                    return res.status(500).send({
                        message: `ERROR al obtener la categoria ${err}`
                    });
                }

                if(!categoriaStored){
                    return res.status(404).send({
                        message: `ERROR la categoria indicada no esta registradada en la base de
                            datos`
                    });
                }
                console.log(categoriaStored);
                req.body.categoria= categoriaStored;
                pasoDos();
            });
        }else pasoDos();
    }

    function pasoDos(){
        if(req.body.unidad_medida){
            unidadMedidaModel.findById(req.body.unidad_medida._id, (err, unidadMedidaStrored)=>{
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
        let newMateriaPrima = new ProductoModel(req.body);
        newMateriaPrima.save((err , materiaPrimaStored)=>{
            if(err){
                return res.status(500).send({
                    message : `ERROR al intentar almacenar el recurso en la abse de datos ${err}`
                });
            }
            materiaPrimaStored.codigo = parseInt(`${materiaPrimaStored.categoria.codigo}${materiaPrimaStored.producto_consecutivo}`);
            ProductoModel.findByIdAndUpdate(materiaPrimaStored._id, materiaPrimaStored, (err, datos)=>{
                if(err){
                    return res.status(500).send({
                        message : `ERROR al intentar almacenar el recurso en la abse de datos ${err}`
                    });
                }
                datos.codigo = parseInt(`${datos.categoria.codigo}${datos.producto_consecutivo}`);
                return res.status(200).send({
                    datos,
                    message: 'Produto Creado Con Exito'
                });
            });
            
        });
    }
}

function actualizar(req, res){
    var insumosArray = [];
    var productosArray = [];
    var ErroresInsumos = [];
    var ErroresProductos = [];
    if(req.body.Insumos){
        var contador = 0;
        for(var insumo of req.body.Insumos){
            materiaPrimaModel.findById(insumo._id, (err, insumoStored)=>{
                if(err){

                    ErroresInsumos.push({
                        message: `ERROR al intentar obtener el insumo ${err}`
                    });
                }
                if(!insumoStored){
                    ErroresInsumos.push({
                        message: `ERROR alguno de los insumos indicados no esta en la base de datos ${insumo.nombre}`
                    });
                }
                insumoStored.cantidad = insumo.cantidad;
                insumosArray.push(insumoStored);
                contador ++;
                if(contador == req.body.Insumos.length){
                    req.body.Insumos = insumosArray
                    pasoUno();
                }

            });
        }
    }else if(req.body.productos){
        var contador = 0;
        for(var producto of req.body.productos){
            ProductoModel.findById(producto._id, (err, productoStored)=>{
                if(err){
                    ErroresProductos.push({
                        message: `ERROR al intentar obtener el producto ${err}`
                    });
                }
                if(!productoStored){
                    ErroresProductos.push({
                        message: `ERROR alguno de los productos indicados no esta en la base de datos ${producto.nombre}`
                    });
                }
                productoStored.cantidad = producto.cantidad;
                productosArray.push(productoStored);
                contador ++;
                if(contador == req.body.productos.length){
                    req.body.productos = productosArray
                    pasoUno();
                }

            });
        }
    }else pasoUno();

    function pasoUno(){
        if(ErroresProductos.length > 0){
            return res.status(500).send({
                ErroresProductos
            });
        }
        if(ErroresInsumos.length > 0){
            return res.status(500).send({
                ErroresInsumos
            });
        }
        if(req.body.categoria){
            categoriaModel.findById(req.body.categoria._id, (err , categoriaStored)=>{
                if(err){
                    return res.status(500).send({
                        message: `ERROR al obtener la categoria ${err}`
                    });
                }

                if(!categoriaStored){
                    return res.status(404).send({
                        message: `ERROR la categoria indicada no esta registradada en la base de
                            datos`
                    });
                }

                req.body.categoria= categoriaStored;
                pasoDos();
            });
        }else pasoDos();
    }
    function pasoDos(){
        if(req.body.unidad_medida){
            unidadMedidaModel.findById(req.body.unidad_medida._id, (err, unidadMedidaStrored)=>{
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
    }

    function Actuar(){
        let productoId = req.params.id;
        ProductoModel.findByIdAndUpdate(productoId, req.body, (err, productoStrored)=>{
            if(err){
                return res.status(500).send({
                    message : `ERROR ocurrio un problema al intentar actualizar ${err}`
                });
            }

            return res.status(200).send({
                datos: productoStrored
            });
        });
    }
}

function eliminar(req, res){
    let productoId = req.params.id;
	ProductoModel.findByIdAndRemove(productoId , (err)=>{
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
