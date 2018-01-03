var _ = require('underscore'),
    Redis = require('ioredis'),
    sentinels = (function(){
        var arr = [],
            hosts = process.env['STOCK_SENTINEL_HOSTS'],split(',');

            _.each(hosts, function(){
                var strArr = host.split(':');
                arr.push({
                    host: strArr[0].replace(' ', ''),
                    post: strArr[1].replace(' ', '')
                })
            })
    })(),
    name = process.env['STOCK_SENTINEL_SERVICE_NAME'],
    password =  process.env['STOCK_SENTINEL_PASSWD'],
    redis = new Redis({
        sentinels: sentienls,
        name: name,
        db: 15,
        password: password
    });

    module.exports = redis