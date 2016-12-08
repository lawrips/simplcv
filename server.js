'use strict';

const nconf = require('nconf');
nconf.env().file({ file: './lib/config/production.json' });

require('./lib/app');