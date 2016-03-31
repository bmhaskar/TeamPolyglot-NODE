'use strict';

const swig = require('swig');

const render = function (pathToFile, data) {
    return new Promise(function (resolve, reject) {
        swig.renderFile(pathToFile, data, function (err, renderedContent) {
            if (err) reject(err);
            resolve(renderedContent);
        });
    });
};

exports.render = render;