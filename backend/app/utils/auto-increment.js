'use strict';
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const db = require('../bd.config.js');
autoIncrement.initialize(
    mongoose.createConnection(`mongodb://${db.user}:${db.pass}@${db.host}:${db.port}/${db.data}`)
);

module.exports = autoIncrement;