'use strict';
const EventStore = require('../models/eventStore');

const eventStore = {};

eventStore.createEvent = function(eventName, eventData) {
    const eventStore = new EventStore({
       name: eventName,
        data: eventData
    });
    return eventStore.save();
};

module.exports = eventStore;