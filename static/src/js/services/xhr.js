var app = angular.module('app');

app.factory('xhr', ['$http', '$q', function ($http, $q) {
    return {
        ajax: function (opts) {
            var deferred = $q.defer();

            //设置请求的 timeout 属性为一个 promise 对象（这样后面就可以手动中断请求了）
            opts.timeout = deferred.promise;

            if (typeof xhrPool[opts.url] != 'undefined') {
                //如果请求池里已经有同样的请求，先将它中断
                xhrPool[opts.url].resolve();
            }

            //把请求的 deferred 对象放入请求池
            xhrPool[opts.url] = deferred;

            return $http(opts);
        }
    };
}]);
