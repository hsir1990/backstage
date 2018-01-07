var userChangePwdMod = {
    //初始化
    init: function () {
        var _this = this;

        _this.bindEvents();
    },

    //修改密码
    changePwd: function (params) {
        var _this = this;

        $.ajax({
            url: '/user/changePwd',
            method: 'post',
            type: 'json',
            timeout: 10000,
            data: params,
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    H.alert(re.msg, 2000, function () {
                        _this.logOut();
                    });
                } else {
                    H.alert(re.msg);
                }
            },
            error: function () {
                H.alert('修改密码接口调用失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //退出登录
    logOut: function () {
        $.ajax({
            url: '/user/logout',
            method: 'post',
            type: 'json',
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    window.parent.location.href = '/#/login';
                } else {
                    H.alert(re.msg);
                }
            },
            error: function () {
                H.alert('退出登录失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    bindEvents: function () {
        var _this = this;
        $('#J-form').on('submit', function (e) {
            e.preventDefault();

            var oldPwd = $(this).find('input[name=oldPwd]').val(),
                newPwd = $(this).find('input[name=newPwd]').val(),
                newPwdEx = $(this).find('input[name=newPwdEx]').val();

            if (oldPwd == '' || newPwd == '' || newPwdEx == '') {
                H.alert('请输全三次密码信息！');
                return;
            }

            if (newPwd == oldPwd) {
                H.alert('新旧密码不能相同！');
                return;
            }

            if (newPwd != newPwdEx) {
                H.alert('两次新密码输入不一致！');
                return;
            }

            if (newPwd.length < 6) {
                H.alert('密码不能小于6位数！');
                return;
            }

            if (newPwd.indexOf(' ') != -1) {
                H.alert('密码不能带空格符！');
                return;
            }

            userChangePwdMod.changePwd({
                oldPwd: oldPwd,
                newPwd: newPwd
            });
        });

        $('#J-btn-back').on('click', function () {
            location.href = 'home.html';
        })
    }
};

$(function () {
    userChangePwdMod.init();
});
