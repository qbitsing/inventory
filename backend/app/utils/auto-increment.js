'use strict';
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const db = require('../bd.config.js');
const co = require('co');

let init = co.wrap(function * (){
	let conn = yield mongoose.mongo.MongoClient.connect(
		`mongodb://${db.user}:${db.pass}@${db.host}:${db.port}/${db.data}`);
	return autoIncrement.initialize(conn);
});




module.exports = {init};