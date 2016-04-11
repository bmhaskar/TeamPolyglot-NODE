'use strict';
const elasticSearchMapping = {
    index: 'booksharing',
    mappings: {
        bookTransaction: {
            properties: {
                event: {
                    type: 'string',
                    index: 'not_analyzed'
                },
                createdAt: {
                    type: 'date'
                }

            }
        }
    }
};


module.exports = elasticSearchMapping;
