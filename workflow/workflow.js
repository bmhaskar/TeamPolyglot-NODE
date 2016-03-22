'use strict';
const EventEmitter  = require("events").EventEmitter;

const eventStoreRepo = require("../repositories/eventStore");

class Workflow extends EventEmitter {
    constructor() {
        super();
    }
    emitEvent(eventName, eventData, callBack, eventStoreErrorHandler) {
        const workflow = this;
        //@todo: add better exception mechanism.
        eventStoreErrorHandler = eventStoreErrorHandler || function(err) {
                throw err;
            };

        eventStoreRepo.createEvent(eventName, eventData)
            .then(function (storedEvent) {
                    workflow.emit(eventName, eventData);
                    if (callBack) callBack();
                },
                eventStoreErrorHandler);
    };
}
const workflow = new Workflow();

module.exports = workflow;

