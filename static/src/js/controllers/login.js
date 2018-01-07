var app = angular.module('app');

app.controller('loginCtrl', ['$scope', '$location', '$timeout', 'xhr', function ($scope, $location, $timeout, xhr) {

    var timeOut = null;
    $scope.userName = H.Storage.get('userName') || '';
    $scope.password = '';
    $scope.errMsg = '';
    
    $scope.login = function () {
        if ($scope.userName == '') {
            showErrMsg('请输入用户名！');
            return;
        }

        if ($scope.password == '') {
            showErrMsg('请输入密码！');
            return;
        }
        xhr.ajax({
            method: 'POST',
            url: '/user/login',
            data: {
                userName: $scope.userName,
                password: $scope.password
            }
        }).success(function (re) {
            if (re.code == 1 && GetQueryString('staff_no') != null) {
                xhr.ajax({
                    method: 'POST',
                    url: '/user/addJobNumber',
                    data: {
                        userName: re.data[0].user_name,
                        staff_no: GetQueryString('staff_no')
                    }
                }).success(function (re) {
                    H.Storage.set('userName', $scope.userName);
                    $location.url('/platform/main');
                }).error(function () {
                    H.alert('数据请求失败！');
                });
            } else if (re.code == 1 && GetQueryString('staff_no') == null){
                H.Storage.set('userName', $scope.userName);
                $location.url('/platform/main');
            } else {
                showErrMsg(re.msg);
            }
        }).error(function () {
            H.alert('数据请求失败！');
        });
    };
    $scope.xhrAjax = function (){
        xhr.ajax({
            method: 'POST',
            url: '/user/seeJobNumber',
            data: {"staff_no": GetQueryString('staff_no'),"key": GetQueryString('key')}
        }).success(function (re) {
            if(re.data.length > 1){
                $('#divBox').css('display', 'block')
            }
            $scope.dataMsg = re.data;
            $scope.oncc = function(){
                xhr.ajax({
                    method: 'POST',
                    url: '/user/selectFun',
                    data: {"user_name": $(this)[0].$$watchers[2].last}
                }).success(function (res) {
                    H.Storage.set('userName', res.data[0].user_name);
                    $location.url('/platform/main')
                }).error(function () {
                    H.alert('数据请求失败！');
                });
            }
            $scope.onHide = function(){
                $('#divBox').css('display', 'none');
            }
        }).error(function () {
            H.alert('数据请求失败！');
        });
    }
    if(GetQueryString('staff_no') != null){
        $scope.xhrAjax();
    }
    

    //点击跳转添加工号 
    $scope.addJobNum = function() {
        if ($scope.userName == '') {
            showErrMsg('请输入用户名！');
            return;
        }

        if ($scope.password == '') {
            showErrMsg('请输入密码！');
            return;
        }
        xhr.ajax({
            method: 'POST',
            url: '/user/login',
            data: {
                userName: $scope.userName,
                password: $scope.password
            }
        }).success(function (re) {
            if (re.code == 1){
                H.Storage.set('userNameCha', $scope.userName);
                $location.url('/addjobnum');
            } else {
                showErrMsg(re.msg);
            }
        }).error(function () {
            H.alert('数据请求失败！');
        });
    }
    function showErrMsg (msg) {
        $scope.errMsg = msg;
        $timeout.cancel(timeOut);
        timeOut = $timeout(function () {
            $scope.errMsg = '';
        }, 3000);
    }

}]);
