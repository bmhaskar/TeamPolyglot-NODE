'use strict';
const Elasticsearch = require('elasticsearch');
const config = require('../config/config');

const elasticSearchClient = new elasticsearch.Client(config.elasticSearch);

module.exports  = elasticSearchClient;

/**
 * Delete an existing index
 * @param indexName
 * @returns  Promise
 */
function deleteIndex(indexName) {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
 * create the index
 * @param indexName
 * @returns  Promise
 */
function createIndex(indexName) {
    return elasticClient.indices.create({
        index: indexName
    });
};
exports.createIndex = createIndex;


/**
 * check if the index exists
 * @param indexName
 * @returns  Promise
 */
function indexExists(indexName) {
    return elasticClient.indices.exists({
        index: indexName
    });
};

exports.indexExists = indexExists;

function configure(mapping) {
    return elasticClient.indices.putMapping(mapping);
};
exports.configure = configure;

/**
 * Indexes object into elastic search
 * @param document object to be indexed
 * @param indexName name of the index in which we want to add the object
 * @param type type of the object as per configuration of elastic search
 * @returns Promise
 */
function add(document, indexName, type) {
    const indexableDocument = {index: indexName, type: type, body: document};

    return elasticClient.index(indexableDocument);
};
exports.add = add;

/**
 * Removes the object from elastic search
 * @param id document id which we want to remove
 * @param indexName name of the index from which we want to remove the document
 * @param type type of the document as per configuration of elastic search
 * @returns Promise
 */
function deleteDoc(id, indexName, type) {
    const deletableDocument = {index: indexName, type: type, id: id};
    return elasticClient.delete(deletableDocument);
};
exports.delete = deleteDoc;