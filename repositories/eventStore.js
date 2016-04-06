'use strict';
const EventStore = require('../models/eventStoreRepo');

const eventStoreRepo = {};

eventStoreRepo.createEvent = function(eventName, eventData) {
    const eventStore = new EventStore({
       name: eventName,
        data: eventData
    });
    return eventStore.save();
};

module.exports = eventStoreRepo;