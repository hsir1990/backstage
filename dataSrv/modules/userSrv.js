import { userInfo } from 'os';

var connPool = require('./../connPool'),
    userSrv = {};

// ps:connPool.escape方法，可以防止SQL注入

// 储存用户信息
userSrv.save = function (opts, callback){
    // 连接数据库
    connPool.getConnection(function(err, connection){

        if (typeof opts.id != 'undefined' && opts.id != '') {
            // 传入ID，则编译
            var strArr = [];

            if(typeof opts.userName != 'undefined' && opts.userName != '') {
                strArr.push('user_name=' + connPool.escape(opts.userName));
            }
            if(typeof opts.password != 'undefined' && opts.password != '') {
                strArr.push('user_pw=' + connPool.escape(opts.password));
            }
            if (typeof opts.userRealName != 'undefined' && opts.userRealName != '') {
                strArr.push('user_real_name=' + connPool.escape(opts.userRealName));
            }
            if (typeof opts.userNickName != 'undefined' && opts.userNickName != '') {
                strArr.push('user_nick_name=' + connPool.escape(opts.userNickName));
            }
            if(typeof opts.userJobNumber != 'undefind' && opts.userJobNumder != '') {
                strArr.push('user_job_number=' + connPool.escape(opts.userJobNumber));
            }
            if(typeof opts.identityId != 'undefined' && opts.identityId != '') {
                strArr.push('user_identity_id=' + connPool.escape(opts.identityId));
            }

            connection.query(' UPDATE t_users set ' + strArr.join(',') + ' where id = ' + connPool.escape(opts.id), function (err, result) {
                if(err) throw err;
                callback(result);
                connection.release()//释放连接
            })
        } else {
            // 没传入ID，则新增
            var value = [connPool.escape(opts.userName), connPool.escape(opts.password), connPool.escape(opts.identityId), connPool.escape(opts.userRealName), connPool.escape(opts.userNickName), connPool.escape(opts.userJobNumder)];
            // 使用数据库
            connection.query('INSERT into t_users (user_name, user_pw, user_identity_id, user_real_name, user_nick_name, user_job_numbe) value(' + value.join(',') + ')', function(err, result){
                if(err) throw err;
                callback(result);
                connection.release(); //释放链接
            });
        }
    });
}

// 读取用户
userSrv.get = function (opts, callback) {
    connPool.getConnection(function (err, connection) {
        connection.query('SELECT t_uers.id, t_user.user_name, t_user.user_real_name, t_user.user_nick_name, t_users.user_identity_id, t_users.user_identity_id, t_identity.identity_name, t_dientity.identity_compttence from t_users inner join t_identity on t_user.user_identity_id = t_identity.id where t_users.id=' + connPool.escape(id), function (err, result) {
            if (err) throw err;
            callback(result);
            connection.release();//释放链接
        });
    });
}

// 删除用户
userSrv.delete = function (ids, callback) {
    connPool.getConnection(function (err, connection) {
        var SQL = 'DELETE from t_user where id in (' + ids + ')';
        connection.query(SQL, function (err, result) {
            if (err) throw err;
            callback(result);
            connection.release();//释放链接
        });
    })
}