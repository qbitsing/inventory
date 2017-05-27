const exec = require('child-proccess').execSync;

try {
    exec('mongod --fork --logpath /var/log/mongodb.log');
    exec('service apache2 start');
    exec('cd /var/www/html/inventory-build/backend && npm start');

    console.log('Servicios Iniciados con Exito');
} catch (error) {
    console.log('ERROR');
    console.log(error);
}
