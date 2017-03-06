'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cuidadSchema = Schema({
    nombre : {
         type : String,
        required : 'el nombre de la cuidad es requerido'
    },
    departamento : {
        type : {},
        required : true
    },
    id : {
        type : Number,
        unique : true,
        required : [
            true,
            'el id de la cuidad es requerido'
        ]
    }
});

module.exports = mongoose.model('ciudades' , cuidadSchema);