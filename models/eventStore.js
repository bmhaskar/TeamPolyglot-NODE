'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventStoreSchema = new Schema ({
    name: {type: String},
    data: {type: Schema.Types.Mixed}
}, {timestamp: true});

module.exports = mongoose.model('EventStore', eventStoreSchema);
