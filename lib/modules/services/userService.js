'use strict';

const nconf = require('nconf');

const users = nconf.get('users');


module.exports = {
    isValid(user) {
        
    },

    getUserByDomain(domain) {
        let foundUser;
        users.forEach((user) => {
            if (domain.indexOf(user.domain) > -1) {
                foundUser = user;
            }
        });

        return foundUser;
    },

    getUserByUsername(username) {
        let foundUser;
        users.forEach((user) => {
            if (username == user.username) {
                foundUser = user;
            }
        });

        return foundUser;
    }
}