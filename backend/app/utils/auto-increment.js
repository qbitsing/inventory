'use strict';
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const db = require('../bd.config.js');
const co = require('co');

let conn = mongoose.createConnection(`mongodb://${db.user}:${db.pass}@${db.host}:${db.port}/${db.data}`);
autoIncrement.initialize(conn);

module.exports = autoIncrement;