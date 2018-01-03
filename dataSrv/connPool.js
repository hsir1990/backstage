var settings = require('./settings'),
    mysql = require('mysql'),
    // 使用连接池的方式，才不会报错，  连接池是将已经创建好的连接保存在池中，当有请求来时，直接使用已经创建好的连接对数据库进行访问，这样省略了创建连接和销毁连接的过程，这样养性能上得到了提高。
    pool = mysql.createPool(settings);

module.exports = pool;