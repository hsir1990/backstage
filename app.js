// 引入node写的express框架
var express = require('express'),
    // // 'connect-flash'与'express-session'配合使用,flash方法储存值需要依赖express-sesion中，一般在使用redirect的时候使用
    // flash = require('connect-flash'),
    // session = require('express-session'),
    path = require('path'),
    // 设置标题栏的小图标
    favicon = require('serve-favicon'),
    // 写入日志的
    logger = require('morgan'),
    // 设置cookie用的
    cookieParser = require('cookie-parser'),
    // 
    bodyParser = require('body-parser'),

    // 引用路由，在routes中使用get或者post
    routes = require('./routes/main'),


    //引用函数并初始化 
    app = express();

// // 引用flash方法
// app.use(flash());

// 设置标题栏小图标   path.join()让路径./practice.ico连接起来，__dirname的方法是表示当前路径，__filename表示代码所在的位置，module.filename：开发期间，该行代码所在的文件。__filename：始终等于 module.filename。__dirname：开发期间，该行代码所在的目录。process.cwd()：运行node的工作目录，可以使用  cd /d 修改工作目录。require.main.filename：用node命令启动的module的filename, 如 node xxx，这里的filename就是这个xxx。
app.use(favicon(path.join(__dirname, 'practice.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));


routes(app);

// 404异常处理
app.use(function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 打印错误信息
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    })
})

// 暴露app的接口
module.exports = app;