'use strict';
const Elasticsearch = require('elasticsearch');
const config = require('../config/config');

const elasticSearchClient = new elasticsearch.Client(config.elasticSearch);

module.exports  = elasticSearchClient;
