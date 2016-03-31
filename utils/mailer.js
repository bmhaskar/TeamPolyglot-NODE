'use strict';
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const config = require('../config/config');

const auth = {
    auth: {
        api_key: config.mailgun.apiKey,
        domain: config.mailgun.domain
    }
};

const nodeMailerMailgun = nodemailer.createTransport(mg(auth));

const send = function (options) {
    return nodeMailerMailgun.sendMail({
        from: options.from || config.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html
    });
};

module.exports = {send: send};
