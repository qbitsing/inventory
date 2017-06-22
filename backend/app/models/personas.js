'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personaSchema = Schema({
    documento : {
        type : String,
        unique : [
            true, 
            'el documento debe ser unico'
        ], 
        required : true, 
    },
    nombre : String,
    apellidos : String,
    direccion : String,
    telefono : String,
    correo : {
        type : String, 
        unique : true
    },
    contrasena : String,
    proveedor:Boolean,
    proveedorproductos: Boolean,
    proveedorfabricacion: Boolean,
    cliente:Boolean,
    super_administrador:Boolean,
    almacenista:Boolean,
    contador:Boolean,
    empleado:Boolean,
    ciudad : {},
    contacto: String,
    fax : Number,
    cargo: String,
    Image: String
});

module.exports = mongoose.model('persona' , personaSchema);
