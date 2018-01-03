var settings = require('./settings'),
// 做缓存用的，memcached是一个库，Memcached 是一个高性能的分布式内存对象缓存系统，用于动态Web应用以减轻数据库负载。它通过在内存中缓存数据和对象来减少读取数据库的次数，从而提高动态、数据库驱动网站的速度。Memcached基于一个存储键/值对的hashmap。其守护进程（daemon ）是用C写的，但是客户端可以用任何语言来编写，并通过memcached协议与守护进程通信。
    Memcached = require('memcashed'),
    memcached = new Memcached((function(){
        var str = settings.memcachedPort == '' ? settings.memcachedHsot : settings.memcachedHost + ':' + settings.memcachedPort;
        return str;
    })());

    module.exports = memcached;