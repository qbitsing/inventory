'use strict';

const ordenVentaModel = require('../models/orden-venta');
const clienteModel = require('../models/personas');
const productoModel = require('../models/productos');
const co = require('co');

let listarAll = co.wrap(function * (req, res){
    try {
        let query = req.query;
        let condiciones = [];
        query.Activo ? condiciones.push({estado: 'Activo'}) : null;
        query.Finalizado ? condiciones.push({estado: 'Finalizado'}) : null;
        query.Salidas ? condiciones.push({estado: 'Con Salidas'}) : null;

        let datos = [];

        if(query.Activo || query.Finalizado || query.Entradas)        
            datos = yield ordenVentaModel.find({$or: condiciones}, null, {sort: {fecha_recepcion: -1}});

        if(datos.length < 1){
            return res.status(404).send({
                message: `no hay ordenes de venta registradas`
            });
        }

        return res.status(200).send({
            datos
        });
    } catch (error) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let listarById = co.wrap(function * (req, res){
    try {
        let ordenId = req.params.id;
        let datos = yield ordenVentaModel.findById(ordenId);
        if(!datos){
            return res.status(404).send({
                message : `no se encuentra ningun registro con el ID indicado`
            });
        }
        return res.status(200).send({
            datos
        });
    } catch (e) {
        return res.status(500).send({
            message : `ERROR ${e}`
        });
    }
});

let crear = co.wrap(function * (req, res){
    try {
        if(req.body.cliente){
            req.body.cliente = yield clienteModel.findById(req.body.cliente._id);
        }
        let noDisponible = [];
        for(let ele of req.body.productos){
            if(ele.tipo == 'kit'){
                let prod = yield productoModel.findById(ele._id);
                ele.productos = prod.productos;
                for(let el of ele.productos){
                    let pr = yield productoModel.findById(el._id);
                    let dispo = pr.cantidad - pr.min_stock;
                    if(pr.cantidad < el.cantidad){
                        noDisponible.push(`No cuenta con las cantidad suficiente de ${el.nombre} en inventario`);
                    }else if(dispo < (el.cantidad * ele.cantidad)){
                        noDisponible.push(`El minimo stock  de ${el.nombre} se esta superando`);
                    }else if((pr.cantidad - pr.apartados) < (el.cantidad * ele.cantidad)){
                        noDisponible.push(`El inventario cuenta con el producto ${el.nombre} pero ya hay ${pr.apartados} apartados en otras ordenes de venta`);
                    }else if((dispo - pr.apartados) < (el.cantidad * ele.cantidad)){
                        noDisponible.push(`El inventario cuenta con el producto ${el.nombre} pero ya hay ${pr.apartados} apartados en otras ordenes de venta,
                        y al despacharlos se supera el minimo stock`);               
                    }

                    pr.apartados += parseInt(el.cantidad * ele.cantidad);

                    yield productoModel.findByIdAndUpdate(pr._id, pr);

                } 
            }else{
                let pro = yield productoModel.findById(ele._id);
                let disponible = pro.cantidad - pro.min_stock;
                if(pro.cantidad < ele.cantidad){
                    noDisponible.push(`No cuenta con las cantidad suficiente de ${ele.nombre} en inventario`);
                }else if(disponible < ele.cantidad){
                    noDisponible.push(`El minimo stock  de ${ele.nombre} se esta superando`);
                }else if((pro.cantidad - pro.apartados) < ele.cantidad){
                    noDisponible.push(`El inventario cuenta con el producto ${ele.nombre} pero ya hay ${pro.apartados} apartados en otras ordenes de venta`);
                }else if((disponible - pro.apartados) < ele.cantidad){
                    noDisponible.push(`El inventario cuenta con el producto ${ele.nombre} pero ya hay ${pro.apartados} apartados en otras ordenes de venta,
                    y al despacharlos se supera el minimo stock`);                
                }

                pro.apartados += ele.cantidad;

                yield productoModel.findByIdAndUpdate(pro._id, pro);
            }
        }
        let newOrdenVenta = new ordenVentaModel(req.body);
        let datos = yield newOrdenVenta.save();

        return res.status(200).send({
            datos,
            noDisponible,
            message: 'Se ha registrado la orden de venta exitosamente'
        });
    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let actualizar = co.wrap(function * (req, res){
    try {
        let ordenId = req.params.id; 
        if(req.body.cliente){
            req.body.cliente = yield clienteModel.findById(req.body.cliente._id);
        }
        let noDisponible = [];
        let ordensita = yield ordenVentaModel.findById(ordenId);
        for(let ele of ordensita.productos){
            if(ele.tipo == 'kit'){
                let prod = yield productoModel.findById(ele._id);
                ele.productos = prod.productos;
                for(let el of ele.productos){
                    let pr = yield productoModel.findById(el._id);
                    pr.apartados -= parseInt(el.cantidad * ele.cantidad);
                    yield productoModel.findByIdAndUpdate(pr._id, pr);
                } 
            }else{
                let pro = yield productoModel.findById(ele._id);
                pro.apartados -= parseInt(ele.cantidad);
                yield productoModel.findByIdAndUpdate(pro._id, pro);
            }
        }
        for(let ele of req.body.productos){
            if(ele.tipo == 'kit'){
                let prod = yield productoModel.findById(ele._id);
                ele.productos = prod.productos;
                for(let el of ele.productos){
                    let pr = yield productoModel.findById(el._id);
                    let dispo = pr.cantidad - pr.min_stock;
                    if(pr.cantidad < el.cantidad){
                        noDisponible.push(`No cuenta con las cantidad suficiente de ${el.nombre} en inventario`);
                    }else if(dispo < (el.cantidad * ele.cantidad)){
                        noDisponible.push(`El minimo stock  de ${el.nombre} se esta superando`);
                    }else if((pr.cantidad - pr.apartados) < (el.cantidad * ele.cantidad)){
                        noDisponible.push(`El inventario cuenta con el producto ${el.nombre} pero ya hay ${pr.apartados} apartados en otras ordenes de venta`);
                    }else if((dispo - pr.apartados) < (el.cantidad * ele.cantidad)){
                        noDisponible.push(`El inventario cuenta con el producto ${el.nombre} pero ya hay ${pr.apartados} apartados en otras ordenes de venta,
                        y al despacharlos se supera el minimo stock`);                
                    }

                    pr.apartados += parseInt(el.cantidad * ele.cantidad);

                    yield productoModel.findByIdAndUpdate(pr._id, pr);

                } 
            }else{
                let pro = yield productoModel.findById(ele._id);
                let disponible = pro.cantidad - pro.min_stock;
                if(pro.cantidad < ele.cantidad){
                    noDisponible.push(`No cuenta con las cantidad suficiente de ${ele.nombre} en inventario`);
                }else if(disponible < ele.cantidad){
                    noDisponible.push(`El minimo stock  de ${ele.nombre} se esta superando`);
                }else if((pro.cantidad - pro.apartados) < ele.cantidad){
                    noDisponible.push(`El inventario cuenta con el producto ${ele.nombre} pero ya hay ${pro.apartados} apartados en otras ordenes de venta`);
                }else if((disponible - pro.apartados) < ele.cantidad){
                    noDisponible.push(`El inventario cuenta con el producto ${ele.nombre} pero ya hay ${pro.apartados} apartados en otras ordenes de venta,
                    y al despacharlos se supera el minimo stock`);                
                }

                pro.apartados += ele.cantidad;

                yield productoModel.findByIdAndUpdate(pro._id, pro);
            }
        }

        yield ordenVentaModel.findByIdAndUpdate(ordenId, req.body);

        return res.status(200).send({
            message: 'Orden de venta actualizada con exito',
            noDisponible
        });
    } catch (e) {
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let eliminar = co.wrap(function * (req, res) {
    try{
        let ordenId = req.params.id;
        let orden = yield ordenVentaModel.findById(ordenId);
        if(orden.estado != 'Activo') return res.status(400).send({message: 'La orden no se puede cancelar ya que no esta activa'});
        for(let ele of orden.productos){
            if(ele.tipo == 'kit'){
                let prod = yield productoModel.findById(ele._id);
                ele.productos = prod.productos;
                for(let el of ele.productos){
                    let pr = yield productoModel.findById(el._id);
                    pr.apartados -= parseInt(el.cantidad * ele.cantidad);
                    yield productoModel.findByIdAndUpdate(pr._id, pr);
                } 
            }else{
                let pro = yield productoModel.findById(ele._id);
                pro.apartados -= parseInt(ele.cantidad);
                yield productoModel.findByIdAndUpdate(pro._id, pro);
            }
        }

        yield ordenVentaModel.findByIdAndRemove(ordenId);

        return res.status(200).send({
            message : `registro eliminado con exito`
        });

    }catch(e){
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

let finalizar = co.wrap(function * (req, res){
    try{
        let ordenId = req.params.id;

        let orden = yield ordenVentaModel.findById(ordenId);

        if(!orden) return res.status(404).send({ message: 'No hay orden de venta registrada con el id indicado' });

        for(let ele of orden.productos){
            if(ele.tipo == 'kit'){
                let prod = yield productoModel.findById(ele._id);
                ele.productos = prod.productos;
                for(let el of ele.productos){
                    let pr = yield productoModel.findById(el._id);
                    pr.apartados -= parseInt(el.cantidad * ele.cantidad_faltante);
                    yield productoModel.findByIdAndUpdate(pr._id, pr);
                } 
            }else{
                let pro = yield productoModel.findById(ele._id);
                pro.apartados -= parseInt(ele.cantidad_faltante);
                yield productoModel.findByIdAndUpdate(pro._id, pro);
            }
        }

        orden.productos = orden.productos.map(ele => {
            ele.cantidad -= ele.cantidad_faltante;
            ele.cantidad_faltante = 0;
            if(ele.cantidad > 0) return ele;
        });

        orden.productos = orden.productos.filter(ele => ele != null);

        orden.estado = 'Finalizado';

        yield ordenVentaModel.findByIdAndUpdate(ordenId, orden);


        return res.status(200).send({
            message: 'La orden de venta se finalizo con exito',
            datos: orden
        });

    }catch(e){
        return res.status(500).send({
            message: `ERROR ${e}`
        });
    }
});

module.exports = {
    listarAll,
    listarById,
    crear,
    actualizar,
    eliminar,
    finalizar
};