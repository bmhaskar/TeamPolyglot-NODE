'use strict';

const searchUtil = require('../utils/search');


const abstractSearch = function (queryString, from, size) {
    const body = {
            "query": {
                "bool": {
                    "must": [{"query_string": {"default_field": "_all", "query": queryString}}]
                }
            },
            "from": from, "size": size
    };
  return searchUtil.search({}, body);
};

module.exports = abstractSearch;