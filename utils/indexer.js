'use strict';
const Elasticsearch = require('elasticsearch');
const config = require('../config/config');
const logger = require('../logger/elasticSearchLogger');

config.elasticSearch.log = logger;

const elasticSearchClient = new Elasticsearch.Client(config.elasticSearch);


/**
 * Delete an existing index
 * @param indexName
 * @returns  Promise
 */
function deleteIndex(indexName) {
    return elasticSearchClient.indices.delete({
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
    return elasticSearchClient.indices.create({
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
    return elasticSearchClient.indices.exists({
        index: indexName
    })
};
exports.indexExists = indexExists;

function putMapping(mapping) {
    return elasticSearchClient.indices.putMapping(mapping);
};
exports.putMapping = putMapping;

/**
 * Indexes object into elastic search
 * @param document object to be indexed
 * @param indexName name of the index in which we want to add the object
 * @param type type of the object as per configuration of elastic search
 * @returns Promise
 */
function add(document, indexName, type) {
    const indexableDocument = {index: indexName, type: type, body: document};

    return elasticSearchClient.index(indexableDocument);
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
    return elasticSearchClient.delete(deletableDocument);
};
exports.delete = deleteDoc;
/**
 * Fetches mappings of given type/s
 * @param index String, String[] name/s of the index from which we want to remove the document
 * @param type String, String[] type/s of the document as per configuration of elastic search
 * @return Promise
 */
function getMapping(index, type) {
    return elasticSearchClient.indices.getMapping({index: index, type:type});
};
exports.getMapping = getMapping;

const init = function () {
    const indexName = config.elasticSearchMapping.index;
    const mappings = config.elasticSearchMapping.mappings;

    return indexExists(indexName)
            .then(function (indexExist) {
                    if (!indexExist) {
                        return createIndex(indexName)
                    }
                })
            .then(function () {
                const docTypes  = Object.keys(mappings);
                return getMapping(indexName, docTypes);
            })
            .then(function (mapping) {
                if(!Object.keys(mapping).length) {
                    let promises = [];
                    for(let documentType in mappings) {
                        promises.push(putMapping({index: indexName, type: documentType, body: mappings[documentType]}))
                    }
                    return Promise.all(promises);
                }
            })
            .catch(function (err) {
                console.log(err);
                logger.debugLogger.log('error', 'Could not initialise elastic search', err);
            });

};
exports.init = init;