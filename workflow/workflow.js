'use strict';
const EventEmitter  = require("events").EventEmitter;

const eventStoreRepo = require("../repositories/eventStore");

class Workflow extends EventEmitter {
    constructor() {
        super();
    }
    emitEvent(eventName, eventData) {

      const workflow = this;

      return eventStoreRepo.createEvent(eventName, eventData)
            .then(function (storedEvent) {
                return workflow.emit(eventName, eventData);
            });
    };
}
const workflow = new Workflow();

module.exports = workflow;

