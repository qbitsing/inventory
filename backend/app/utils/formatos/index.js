'use strict';

const pdf = require('phantom-html2pdf');
const remisionTrabajo = require('./remision-trabajo');

let html = remisionTrabajo.getHtml(
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
    html,
    css: `${__dirname}/remision-trabajo/index.css`
};

pdf.convert(options, (err , result)=>{
    result.toFile(`${__dirname}/archivo.pdf`, function() {});
});
