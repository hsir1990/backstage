var app = angular.module('app');

app.controller('wrapCtrl', ['$scope', '$location', 'xhr', function ($scope, $location, xhr) {

    $scope.userName = '';
    $scope.identityName = '';
    $scope.identityCompetence = '';
    $scope.isSupperUser = false;
    $scope.noticeCount = 0;
    $scope.menuList = [];

    $scope.logout = function () {
        xhr.ajax({
            method: 'POST',
            url: '/user/logout'
        }).success(function (re) {
            if (re.code == 1) {
                window.CHAT && window.CHAT.logout();
                $location.url('/login')
            } else {
                H.alert(re.msg);
            }
        }).error(function () {
            H.alert('数据请求失败！');
        });
    };

    xhr.ajax({
        method: 'GET',
        url: '/user/msg',
        params: {
            userId: H.Cookie.get('userId')
        }
    }).success(function (re) {
        if (re.code == 1) {
            $scope.userName = re.data.user_real_name;
            $scope.identityName = re.data.identity_name;
            $scope.identityCompetence = re.data.identity_competence;
            if (re.data.identity_competence == '*') {
                $scope.isSupperUser = true;
            }

            xhr.ajax({
                method: 'GET',
                url: '/menu/list'
            }).success(function (re) {
                if (re.code == 1) {
                    $scope.menuList = processData(re.data);
                }
            });

        } else {
            $location.url('/login');
        }
    });

    function processData (data) {
        var result = [],
            process = function (pid, list, targetList) {
                $.each(list, function (i, item) {

                    if (typeof item.submenu == 'undefined') {
                        item.submenu = [];
                    }

                    if (item.parent_id == pid) {
                        targetList.push(item);
                        process(item.id, list, item.submenu);
                    }

                });
            };

        process(0, data, result);

        return result;
    }

}]);
