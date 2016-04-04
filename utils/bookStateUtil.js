'use strict';

exports.isRequestedByUser = function (bookState, user) {
    return new Promise(function(resolve, reject) {
        const userId = user._id.toString();
        if(!userId) {
            throw  new Error('UserId not found');
        }
        if(bookState.requestedBy.length) {
            Object.keys(bookState.requestedBy).forEach((index)=> {
                if(bookState.requestedBy[index]._id.toString() == userId) {
                    return resolve({user: bookState.requestedBy[index], index:  index});
                }
            });
            return reject(false);
        }

        return reject(false);
    });

};
