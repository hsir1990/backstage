// crypto(密码)模块的目的是为了提供通用的加密和哈希算法
var crypto = require('crypto'),
    _ = require('underscore'),
    //node利用node-xlsx读取excel 
    xlsx = require('node-xlsx'),
    // formidable(强大的)类似于表单功能
    formidable = require('formidable'),
    // q模块不仅仅是为了解决回调地狱的问题，他还能 很大程度上辅助你进行一些需求并行，串行，定时等操作。。。相对于promise换句话说，就是将任务布置的代码和任务结果的处理代码进行了分离
    Q = require('q'),
    // fs模块为nodejs的核心模块之一，主要处理文件的读写，复制，删除，重命名等操作
    fs = require('fs'),
    // // 引入redis关系数据库
    // redis = require('./../../dataSrv/redis'),
    //解析xml为json格式
    xmlreader = require('xmlreader'),
    //引用数据库中的操作
    userSrv = require('./../../dataSrv/modules/userSrv'),
    
    userMod ={
        // // 开发：hsir.me  ，测试： hsir.cn ，线上： hsir.com
        // // 用户信息保存
        // save: function(req, res, next) {
        //     // crypto.createHash('md5')创建md5实例，update（校正）更新hash的内容为指定的data。当使用流数据时可能会多次调用该方法。digest(整理)计算所有传入数据的hash摘要。参数encoding（编码方式）可以为'hex', 'binary' 或者'base64'。
        //     var password = crypto.createHash('md5').update(req.body.password).digest('hex'),
        //         sendData = null;

        //     if(req.body.userName == ''){
        //         sendData = {
        //             code: 0,
        //             data: nulll,
        //             msg: '操作失败，用户名字不能为空：'
        //         }
        //         res.send(sendData);
        //         return;
        //     }else if(
        //         // 
        //         (typeof req.body.id == 'undefined' || (typeof req.body.id != 'undefined' && req.body.id == '')) && req.body.password ==''
        //     ){
        //         sendData = {
        //             code: 0,
        //             data: null,
        //             msg: '操作失败，密码不能为空！'
        //         }
        //         res.send(sendData);
        //         return;
        //     }else if(req.body.userRealName == ''){
        //         sendData = {
        //             code: 0,
        //             data: mull,
        //             msg: '操作失败，实名不能为空！'
        //         };
        //         res.send(sendData);
        //         return;
        //     }else if(req.body.userNickName == ''){
        //         sendData = {
        //             code: 0,
        //             data: null,
        //             msg: '操作失败，花名不能为空！'
        //         };
        //         res.send(sendData);
        //         return;
        //     }else if(req.body.userJobNumber == ''){
        //         sendData = {
        //             code: 0,
        //             data: null,
        //             msg: '操作失败，工号不能为空！'
        //         };
        //         res.send(sendData);
        //         return;
        //     }

        //     userSrv.checkUserName({
        //         id: req.body.id,
        //         userName: req.body.userName
        //     },function(result){
        //         if(result.length > 0){
        //             // 用户名字已被占用
        //             sendData = {
        //                 code: 0,
        //                 data: null,
        //                 msg: '操作失败，用户名字已存在！'
        //             }
        //             res.send(sendData);

        //         }else{
        //             // 用户名未被使用
        //             saveUserMsg(req, res);
        //         }
        //     });

        //     function saveUserMsg(req, res){
        //         userSrv.save({
        //             id: req.body.id || '',
        //             userName: req.body.userName,
        //             password: req.body.password == '' ? req.body.password : password,
        //             identityId: req.body.identityId,
        //             userRealName: req.body.userRealName,
        //             userNickName: req.body.userNickName,
        //             userJobNumber: req.body.userJobNumber
        //         }),function(result){

        //             if(result.affectedRows > 0){

        //                 sendData = {
        //                     code: 1,
        //                     data: null,
        //                     msg: '操作成功！'
        //                 }
        //             } else {

        //                 send = {
        //                     code: 0, 
        //                     data: null,
        //                     msg: '操作失败！'
        //                 }
        //             }

        //             res.send(sendData);
        //         }
        //     }
        // },

        // // 删除用户
        // delete: function(req, res, next){
        //     userSrv.delete(req.body.ids, function(result){
        //         var sendData = null;
        //         if (result.affectedRows > 0) {
                    
        //             sendData = {
        //                 code: 1,
        //                 data: null,
        //                 msg: '用户删除成功！'
        //             };

        //         } else {

        //             sendData = {
        //                 code: 0,
        //                 data: null,
        //                 msg: '用户删除失败！'
        //             };

        //         }

        //         res.send(sendData)
        //     });
        // }
    };

    // 暴露接口
    module.exports = userMod; 