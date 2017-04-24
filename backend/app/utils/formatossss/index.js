'use strict';

const pdf = require('phantom-html2pdf');
const remisionTrabajo = require('./remision-trabajo');


let html = remisionTrabajo.getHtml({consecutivo : 1001 , dir : __dirname});

let options = {
    html
};

pdf.convert(options, (err , result)=>{
    result.toFile(`${__dirname}/archivo.pdf`, function() {});
});