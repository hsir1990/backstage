require.config({baseUrl:"",urlArgs:""});var app=angular.module("app",["ui.router","oc.lazyLoad"]),xhrPool={};app.config(["$ocLazyLoadProvider",function(o){o.config({loadedModules:["app"],jsLoader:requirejs,files:[],debug:!1})}]),app.config(["$stateProvider","$urlRouterProvider","$controllerProvider",function(o,e,r){function t(o,e){var r=(H.Storage.get("version"),{loadStaticRes:["$ocLazyLoad",function(r){return r.load({name:e,cache:!1,files:o.files})}]});return r}o.state("login",{url:"/login",templateUrl:"dist/view/login.html",controller:"loginCtrl",resolve:t({files:["dist/js/controllers/login","dist/js/services/xhr"]},"app.login")}).state("platform",{url:"/platform",templateUrl:"dist/view/wrap.html",controller:"wrapCtrl",resolve:t({files:["dist/js/controllers/wrap","dist/js/services/xhr","dist/js/directives/wrap","dist/js/filters/wrap"]},"app.platform")}).state("platform.main",{url:"/main",templateUrl:"dist/view/main.html"}).state("addjobnum",{url:"/addjobnum",templateUrl:"dist/view/addjobnum.html",controller:"addjobnumCtrl",resolve:t({files:["dist/js/controllers/addjobnum","dist/js/services/xhr"]},"app.addjobnum")}),e.otherwise(moRouter)}]),app.run(["$rootScope","$window","$location","$log","$http",function(o,e,r,t,l){o.$on("$stateChangeStart",function(o,e,r,t,l){angular.forEach(xhrPool,function(o,e){o.resolve(),delete xhrPool[e]})}),o.$on("$stateChangeSuccess",function(o,e,r,t,l){"login"==e.name||"addjobnum"==e.name?($("html").css({height:"100%"}),$("body").addClass("login-bg")):($("html").css({height:"auto"}),$("body").removeClass("login-bg"))})}]),angular.bootstrap(document,["app"]);