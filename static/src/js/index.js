require.config({
    baseUrl: '',
    urlArgs: ''
});

var app = angular.module('app', ['ui.router', 'oc.lazyLoad']),
    xhrPool = {};//请求池

//配置期
app.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        loadedModules: ['app'], //主模块名,和 ng.bootstrap(document, ['app']) 相同
        jsLoader: requirejs, //使用 requirejs 去加载文件
        files: [], //主模块依赖的资源（主要子模块的声明文件）
        debug: false
    });
}]);

app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', function ($stateProvider, $urlRouterProvider, $controllerProvider) {
    /**
     * 路由切换时调用
     * @param param.file 懒加载文件数组
     * @param tpl 子模块view视图
     * @param module 子模块名
     */
    function resovleDep (param, module) {
        var v = H.Storage.get('version'),
            resolves = {
                loadStaticRes: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: module,
                        cache: false,
                        files: param.files
                    });
                }]
            };

        return resolves;
    }

    //路由配置
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'dist/view/login.html',
            controller: 'loginCtrl',
            resolve: resovleDep({
                files: ['dist/js/controllers/login', 'dist/js/services/xhr']
            }, 'app.login')
        })
        .state('platform', {
            url: '/platform',
            templateUrl: 'dist/view/wrap.html',
            controller: 'wrapCtrl',
            resolve: resovleDep({
                files: ['dist/js/controllers/wrap', 'dist/js/services/xhr', 'dist/js/directives/wrap', 'dist/js/filters/wrap']
            }, 'app.platform')
        })
        .state('platform.main', {
            url: '/main',
            templateUrl: 'dist/view/main.html'
        })
        .state('addjobnum', {
            url: '/addjobnum',
            templateUrl: 'dist/view/addjobnum.html',
            controller: 'addjobnumCtrl',
            resolve: resovleDep({
                files: ['dist/js/controllers/addjobnum', 'dist/js/services/xhr']
            }, 'app.addjobnum')
        });

    $urlRouterProvider.otherwise(moRouter);
}]);

//运行期期
app.run(['$rootScope', '$window', '$location', '$log', '$http', function ($rootScope, $window, $location, $log, $http) {
    //为 ui-router 的相关事件添加回调
    $rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {
        angular.forEach(xhrPool, function (value, key) {
            value.resolve();
            delete xhrPool[key];
        });
    });

    $rootScope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
        if (toState.name == 'login' || toState.name == 'addjobnum') {
            $('html').css({
                'height': '100%'
            });
            $('body').addClass('login-bg');
        } else {
            $('html').css({
                'height': 'auto'
            });
            $('body').removeClass('login-bg');
        }
    });
}]);

angular.bootstrap(document, ['app']);
