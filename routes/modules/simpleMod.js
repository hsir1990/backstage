var simpleMod = {
    // 设置静态资源版本号
    setVersion: function(req, res, next){
        res.jsonp({
            code: 0,
            msg: 'success'
        })
    },

    // 获取静态资源版本号
    getVersion: function(req, res, next){
        var now = new Date().valueOf();

        res.jsonp({
            data: now
        })
    },

    // 监听接口直接返回报文
    monitor: function(req, res, next){
        res.send({
            code: 200,
            data: null,
            msg: ''
        });
    }
};

module.exports = simpleMod;