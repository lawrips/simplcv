'use strict';

const nconf = require('nconf'),
    fs = require('fs'),
    async = require('async'),
    debug = require('debug')('simplcv');

let Redis, redisOptions, redis;

if (nconf.get('redis')) {
    debug('loading redis');
    Redis = require('ioredis');
    redisOptions = nconf.get('redis');
    redis = new Redis(redisOptions);
}

let defaultContent = fs.readFileSync('./content/content.md', 'utf8');
let defaultLinks = fs.readFileSync('./content/links.md', 'utf8');
let defaultFooter = fs.readFileSync('./content/footer.md', 'utf8');
let defaultTitle = fs.readFileSync('./content/title.md', 'utf8');

module.exports = {
    get : function(user, callback) {
        let content, title,  links, footer;

        // if redis not enabled, single user mode
        if (!redis) {
            debug('got all content from files, returning');
            return callback(null, {
                content: fs.readFileSync('./content/content.md', 'utf8'),
                links: fs.readFileSync('./content/links.md', 'utf8'),
                footer: fs.readFileSync('./content/footer.md', 'utf8'),
                title: fs.readFileSync('./content/title.md', 'utf8')
            });
        }        

        // if redis enabled
        else {
            async.waterfall([
                (callback) => {
                    redis.get(user + ':content', (err, result) => {
                        content = result ? result : defaultContent;
                        return callback (err, null);
                    });
                }, (data, callback) => {
                    redis.get(user + ':title', (err, result) => {
                        title = result ? result : defaultTitle
                        return callback (err, null);
                    });
                }, (data, callback) => {
                    redis.get(user + ':links', (err, result) => {
                        links = result ? result : defaultLinks;
                        return callback (err, null)
                    });
                }, (data, callback) => {
                    redis.get(user + ':footer', (err, result)  => {
                        footer = result ? result : defaultFooter;
                        return callback (err, null)
                    });
                }], (err) => {
                    debug('got all content from redis, returning');
                    return callback(err, {
                        content: content,
                        links: links,
                        footer: footer,
                        title: title
                    });
            });
        }
        
    }, 

    save: function(user, type, content) {
        if (!redis) {
            fs.writeFileSync('./content/' + type + '.md', content);
            debug('saved content in files');
        }
        else {
            redis.set(user + ':' + type, content);
            debug('saved content in redis');
        }
    }
}