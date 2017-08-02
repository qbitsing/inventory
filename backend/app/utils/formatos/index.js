'use strict';

const pdf = require('phantom-html2pdf');
const remisionTrabajo = require('./remision-trabajo');
const ordenTrabajo = require('./orden-trabajo');

let html = ordenTrabajo.getHtml(
    {
        consecutivo : 1001, 
        dir : __dirname,
        productos: [
            {
                consecutivo: '0001',
                nombre: 'Cajon de Hierro',
                cantidad: 80
            },
            {
                consecutivo: '0001',
                nombre: 'Cajon de Hierro',
                cantidad: 80
            },
            {
                consecutivo: '0001',
                nombre: 'Cajon de Hierro',
                cantidad: 80
            },
            {
                consecutivo: '0001',
                nombre: 'Cajon de Hierro',
                cantidad: 80
            }
        ]

    }
);

let options = {
    html
};

pdf.convert(options, (err , result)=>{
    result.toFile(`${__dirname}/archivo.pdf`, function() {});
});
