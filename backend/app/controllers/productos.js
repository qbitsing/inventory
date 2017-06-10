'use strict';

const ProductoModel = require('../models/productos');
const unidadMedidaModel = require('../models/unidades');
const materiaPrimaModel = require('../models/materia-prima');
const categoriaModel = require('../models/categorias');
const co = require('co');

let listarAll = co.wrap(function * (req, res){
    try {
        let query = req.query;
        let condicciones = [];
        query.producto ? condicciones.push({tipo: 'producto'}) : null;
        query.kit ? condicciones.push({tipo: 'kit'}) : null;

        let datos = [];

        if(condicciones.length > 0)
            datos = yield ProductoModel.find({$or : condicciones},null, {short: {nombre: 1}});
        
        if(datos.length < 1){
            return res.status(404).send({
                message: `no hay productos registrados`
            });
        }

        return res.status(200).send({
            datos
        });
    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let listarById = co.wrap(function * (req, res){
    try {
        let productoId = req.params.id;

        let datos = yield ProductoModel.findById(productoId);

        if(!datos){
            return res.status(404).send({
                message : `no se encuentra ningun registro con el ID indicado`
            });
        }

        return res.status(200).send({
            datos : productoStrored
        });
    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let crear = co.wrap(function * (req, res){
    try {
        req.body.categoria = yield categoriaModel.findById(req.body.categoria._id);

        req.body.unidad_medida = yield unidadMedidaModel.findById(req.body.unidad_medida._id);
        
        let newProducto = new ProductoModel(req.body);

        let datos = yield newProducto.save();

        datos.codigo = parseInt(`${datos.categoria.codigo}${datos.producto_consecutivo}`);

        yield ProductoModel.findByIdAndUpdate(datos._id, datos);

        return res.status(200).send({
            message: 'Producto registrado con exito',
            datos
        });

    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let actualizar = co.wrap(function * (req, res){
    try {
        let productoId = req.params.id;

        req.body.categoria = yield categoriaModel.findById(req.body.categoria._id);

        req.body.unidad_medida = yield unidadMedidaModel.findById(req.body.unidad_medida._id);


        yield ProductoModel.findByIdAndUpdate(productoId, req.body);

        return res.status(200).send({
            message: 'Producto actualizado con exito'
        });

    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let eliminar = co.wrap(function * (req, res){
    try {
        let productoId = req.params.id;
        
        yield ProductoModel.findByIdAndRemove(productoId);

        return res.status(200).send({
            message: 'Producto eliminado con exito'
        });
    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let valance = co.wrap(function * (req, res){
    try{
        let productos = yield ProductoModel.find({tipo : 'producto'});
        let materia = yield materiaPrimaModel.find({});
        productos = productos.map(function(ele){
            let datos = {
                nombre: ele.nombre,
                _id: ele._id,
                producto_consecutivo: ele.producto_consecutivo,
                unidad_medida: ele.unidad_medida,
                categoria: ele.categoria,
                marca: ele.marca,
                precio: ele.precio,
                precioCalculado: (ele.precio * ele.cantidad) || 0,
                codigo: ele.codigo,
                cantidad: ele.cantidad,
            }
            return datos;
        });
        let total = calcularTotal(0, productos, 0);
        return res.status(200).send({
            productos: productos.concat(materia),
            total
        });
    }catch(e){
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

function calcularTotal(total , array , i){

    if (i == (array.length - 1)){
        total += parseInt(array[i].precioCalculado);
        return total;
    }

    total += parseInt(array[i].precioCalculado);

    return calcularTotal(total, array, i+1);

}

module.exports = {
    listarAll,
    listarById,
    crear,
    actualizar,
    eliminar,
    valance
};
