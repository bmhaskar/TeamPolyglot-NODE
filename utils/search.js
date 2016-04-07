'use strict';


const config = require('../config/config');
const debugLogger = require('../logger/debugLogger');
const elasticSearchClient = require('./elasticSearchClient');


const search = function (params, body) {
    const searchable = Object.assign({
        index: config.elasticSearchMapping.index
    }, params);

    searchable.body = body;

    return elasticSearchClient.search(searchable)
            .catch(function (err) {
                debugLogger.log('error','Found error while searching',err, params, searchable);
            });
};

const parseSearchResult = function (result) {
    return new Promise(function (resolve, reject) {
        if(!result.hits.total) {
            reject('No results found');
        }
        resolve(result.hits);
    })
};

module.exports = {
    search: search,
    parseSearchResult: parseSearchResult
};
