// 类似于jq的一个类库
var _ = require('underscore'),

    // userMod = require('./modules/userMod'), //引入user（自己）模块
    // identityMode = require('./modules/identityMod'),//引入identity（身份）模块
    // menuMod = require('./modules/menuMod'),//引入menu（菜单）模块
    // competenceMod = require('./modules/competenceMod'),//引入competence（能力）模块
    simpleMod = require('./modules/simpleMod'),//引入simple（简单）模块
    config = {
        get: {
            '/set_v': simpleMod.setVersion,//设置静态资源版本号
            '/get_v': simpleMod.getVersion//获取静态资源版本号
        },
        post: {
            // '/user/save': userMod.save,//保存用户信用
            // '/user/del': userMod.delete//删除用户
        }
    };//路由配置

module.exports = function(app){
    // 分析路由配置对象，逐一处理
    // subConfig--json的内容，method--get或post的方法
    _.each(config, function(subConfig, method){
        // url--自己定义的路径，func--- simpleMod.setVersion方法
        _.each(subConfig, function(func, url){
            // app.get('/set_v',userMod.save)
            app[method](url, func);

        })

    })
}
    
    