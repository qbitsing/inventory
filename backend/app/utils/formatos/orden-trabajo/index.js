module.exports = {
    getHtml: data => {
        let html = `
            <table class="tableHead" border="1">
                <tr>
                    <td rowspan="2" class="tdLogoContainer"><img src="${data.dir}/logo-prines.jpg" class="logo"></td>                   
                    <td rowspan="5" class="tableHeadOrden">ORDEN DE TRABAJO</td>
                    <td>VERSION 1.3</td>
                </tr>
                <tr>
                    <td>No 19876</td>
                </tr>
            </table>
        `;
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Document</title>
                    <link rel="stylesheet" href="${data.dir}/assest/bootstrap.css">                  
                    <link rel="stylesheet" href="${__dirname}/index.css">
            </head>
            <body>
                ${html}
            </body>
            </html>
        `
    }
}