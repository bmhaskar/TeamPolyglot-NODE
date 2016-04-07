'use strict';

const Elasticsearch = require('elasticsearch');
const config = require('../config/config');
const logger = require('../logger/elasticSearchLogger');

config.elasticSearch.log = logger;

const esClient = new Elasticsearch.Client(config.elasticSearch);

module.exports =  esClient;