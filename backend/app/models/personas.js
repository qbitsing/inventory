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
    telefono : Number,
    correo : {
        type : String, 
        unique : true, 
        required : [
            true, 
            'el correo es requerido'
        ]
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
    imagen: String
});

module.exports = mongoose.model('persona' , personaSchema);
