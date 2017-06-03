'use strict';

const nodemailer = require('nodemailer');

module.exports = {
    transporter : nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'omar970329@gmail.com',
            pass: 'sdcz4-1024'
        }
    })
}