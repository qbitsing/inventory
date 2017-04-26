'use strict';

module.exports = {
    getHtml: data => {
        let html = `
            <div class="head">
                <div class="headInfo">
                    <img src="${data.dir}/logo-prines.jpg">
                    <h2>Producciones Industriales Esperanza S.A.S.</h2>
                    <h3>Productos industriales para telecomunicaciones</h3>
                    <ul>
                        <li>Frabricación y distribución de Herrajería para redes de CATV y HFC</li>
                        <li>Implementacion y montaje de redes de comunicación, seguridad y televisión</li>
                        <li>Asesorias, montajes y diseño de redes HFC</li>
                    </ul>
                </div>
                <div class="NoRemsion">
                    <h3>REMISIÓN</h3>
                    <div>N°  ${data.consecutivo}</div>
                    <p>
                        Calle 73 Sur No. 80J - 52 - Bosa Laureles (Bogota D.C.)
                        Telefono: 777 77 04 E-mail: efraindr@gmail.com
                    </p>
                </div>
            </div>
        `;

        return html;

    }
};