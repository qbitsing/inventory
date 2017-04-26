'use strict';
function getRowTable(row){
    return `
        <tr>
            <td> ${row.consecutivo} </td>
            <td class="colspan7">${row.nombre}</td>
            <td>${row.cantidad}</td>
        </tr>
    `;
}


module.exports = {
    getHtml: data => {
        let rowsTable = data.productos.map(getRowTable);
        rowsTable = rowsTable.join(' ');
        let html = `
            <div class="head">
                <div class="row">
                    <div class="col-xs-8 headInfo">
                        <div class="row containerLogoTitle">
                            <div class="col-xs-3 conatinerLogo">
                                <img src="${data.dir}/logo-prines.jpg" class="logo">
                            </div>
                            <div class="col-xs-9 containerTitle">
                                <h2 class="title">Producciones Industriales Esperanza S.A.S.</h2>
                            </div>
                        </div>
                        <h3 class="subTitle">Productos industriales para telecomunicaciones</h3>
                        <ul class="listHead">
                            <li>@ Frabricación y distribución de Herrajería para redes de CATV y HFC</li>
                            <li>@ Implementacion y montaje de redes de comunicación, seguridad y televisión</li>
                            <li>@ Asesorias y mantenimiento en mecánica hidráulica</li>
                            <li>@ Asesorias, montajes y diseño de redes HFC</li>
                        </ul>
                    </div>
                    <div class="col-xs-4 remisionDetails">
                        <h3 class="noRemisionTitle">REMISIÓN</h3>
                        <div class="noRemsion">&#160;&#160;N°&#160;&#160;&#160;&#160;&#160;  ${data.consecutivo}</div>
                        <p class="remisionDescripcion">
                            Calle 73 Sur No. 80J - 52 - Bosa Laureles (Bogota D.C.)
                            <br>
                            Telefono: 777 77 04 E-mail: efraindr@gmail.com
                        </p>
                    </div>
                </div>
            </div>
            <div class="body">
                <div class="radius">
                    <table class="remisionProveedorInfo">
                        <tr>
                            <td class="colspan5">PROVEEDOR:&#160;&#160;&#160;</td>
                            <td>NIT:&#160;&#160;&#160; </td>
                            <td>FECHA:&#160;&#160;&#160;</td>                       
                        </tr>
                        <tr>
                            <td class="colspan5">DIRECCIÓN:&#160;&#160;&#160;</td>
                            <td>CIUDAD:&#160;&#160;&#160; </td>
                            <td>TELEFONO:&#160;&#160;&#160;</td>                       
                        </tr>
                    </table>
                </div>
                <div class="radius">
                    <table class="remisionProductosDetalles">
                        <tr class="negro" bgcolor="#000">
                            <td> CODIGO </td>
                            <td class="colspan7"> DESCRIPCION </td>
                            <td> CANTIDAD </td>
                        </tr>
                        ${rowsTable}
                    </table>
                </div>
            </div>

            <div class="col-xs-5 borderTop">
                ASESOR COMERCIAL
            </div>
            <div class="col-xs-5 borderTop">
                FIRMA DEL PROVEEDOR
            </div>
        `;

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Document</title>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

    }
};