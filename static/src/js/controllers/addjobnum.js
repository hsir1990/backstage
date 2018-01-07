var app = angular.module('app');

app.controller('addjobnumCtrl', ['$scope', '$location', '$timeout', 'xhr', function ($scope, $location, $timeout, xhr) {

    var timeOut = null;
    $scope.userName = '';
    $scope.password = '';
    $scope.errMsg = '';
    var flag = true;

    $scope.login = function () {

        if ($scope.userName == '') {
            showErrMsg('请输入用户名！');
            return;
        }

        if ($scope.password == '') {
            showErrMsg('请输入密码！');
            return;
        }
        if(flag){
            flag = false;
            xhr.ajax({
                method: 'POST',
                url: '/user/validate',
                data:{
                    name:$scope.userName,
                    password:$scope.password
                },
                dataType: 'json'    
            }).success(function (re) {
                if(re.code ==1 ){
                    xhr.ajax({
                        method: 'POST',
                        url: '/user/addJobNumber',
                        data: {
                            userName: H.Storage.get('userNameCha'),
                            staff_no: $scope.userName
                        }
                    }).success(function (res) {
                        H.Storage.set('userName', H.Storage.get('userNameCha'));
                        flag = true;                                                
                        $location.url('/platform/main');
                    }).error(function () {
                        flag = true;
                        H.alert('数据请求失败！');
                    });
                }else{
                    flag = true;
                    showErrMsg(re.msg);
                }
            }).error(function () {
                H.alert('数据请求失败！');
            });
        }
        
    };

    function showErrMsg (msg) {
        $scope.errMsg = msg;
        $timeout.cancel(timeOut);
        timeOut = $timeout(function () {
            $scope.errMsg = '';
        }, 3000);
    }

}]);
