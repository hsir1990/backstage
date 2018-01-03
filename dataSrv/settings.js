// 生产服务器
var distSettings = {
    host: 'ofc.mysql.qlk.com',
    port: 8888,
    database: 'ofc_admin_frame',
    user: 'ofc_python',
    password: 'Abcd@12qa_python',

    cookieName: 'qlk',
    cookieSecret: 'qlk',

    memcachedHost: 'memcached1.qlk.com',
    memcachedPort: 11211
};

//测试服务器
var testSettings = {
    host: '172.16.1.163',
    port: 3306,
    database: 'ofc_admin_frame',
    user: 'ofcpython',
    password: 'pydb@7lk.163',

    cookieName: 'qlk',
    cookieSecret: 'qlk',

    memcachedHost: '127.0.0.1',
    memcachedPort: 11211
};

//开发服务器
var devSettings = {
    host: '172.16.1.195',
    // host: '172.16.10.163',
    port: 3306,
    database: 'ofc_admin_frame',
    user: 'python',
    password: '7lk_root',
    // user: 'ofcpython',
    // password: 'pydb@7lk.163',

    cookieName: 'qlk',
    cookieSecret: 'qlk',

    memcachedHost: '127.0.0.1',
    memcachedPort: 11211
};

// 环境变量 DEV_ENV 的取值为1 的时候测试服配置，0的时候取生产服配置，2是开发环境
var envObj = {
    0: distSettings,
    1: testSetting,
    2: devSetting
}

var env = process.enc['DEV_ENV'];
if(env != 0 && env != 2 && env != 2) {
    env = 0;
}

var settings = envObj[env];


var db_host = process.env['OSS_DB_HOST'];
var db_port = process.env['OSS_DB_PORT'];
var db_name = process.env['OSS_DB_NAME'];
var db_user = process.env['OSS_DB_USER'];
var db_passwd = process.env['OSS_DB_PASSWD'];
var mcache_host = process.env['MCACHE_HOST'];
var mcache_port = process.env['MCACHE_PORT'];

// var settings = {
//     host: db_host,
//     port: db_port,
//     database: db_name,
//     user: db_user,
//     password: db_passwd,
// 
//     cookieName: 'qlk',
//     cookieSecret: 'qlk',
// 
//     memcachedHost: mcache_host,
//     memcachedPort: mcache_port
// };
// 

//开发服务器
/*var settings = {
    host: '127.0.0.1',
    port: 3306,
    database: 'ofc_admin_frame',
    user: 'root',
    password: 'root',

    cookieName: 'qlk',
    cookieSecret: 'qlk',

    memcachedHost: '127.0.0.1',
    memcachedPort: 11211
};*/

module.exports = settings;