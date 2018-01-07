var userManageMod = {
    //用户身份字典信息
    identityData: null,
    //分页对象
    pagerObj: null,
    //调用获取用户列表接口要传的参数
    userListParams: {
        userName: '',
        createTimeStart: '',
        createTimeEnd: '',
        identityId: '',
        pageSize: 20,
        currentPage: ''
    },
    //用户列表信息缓存
    userListData: null,
    //新增、修改弹窗对象缓存
    popObj: null,
    //导入用户弹窗缓存
    importPop: null,
    //弹窗的内容html缓存
    popInnerHtml: '',

    //初始化
    init: function () {
        var _this = this;

        _this.getIdentityData();
        _this.getUserList();
        _this.bindEvents();

        $('#J-form').datepicker({
            language: 'zh-CN',
            autoclose: true,
            format: 'yyyy-mm-dd',
            inputs: $('#J-form').find('input.J-date-picker')
        });
    },

    //获取身份数据
    getIdentityData: function () {
        var _this = this;
        $.ajax({
            url: '/identity/get',
            method: 'get',
            type: 'json',
            timeout: 10000,
            success: function (re) {
                if (re.code = 1) {
                    var identityData = {};

                    $.each(re.data, function (i, item) {
                        identityData[item.id] = item.identity_name;
                    });

                    _this.identityData = identityData;

                    _this.popInnerHtml = H.template($('#J-pop-tpl').html(), {
                        identityData: _this.identityData
                    });

                    $('#J-form').find('select[name=identityId]').append(H.template($('#J-identity-option-tpl').html(), {
                        identityData: _this.identityData
                    }));

                    H.Monitor.trigger('getIdentityData');
                } else {
                    H.alert('请求用户身份字典失败');
                }
            },
            error: function () {
                H.alert('请求用户身份字典失败');
            }
        });
    },

    //获取用户列表数据
    getUserList: function () {
        var _this = this;

        $.ajax({
            url: '/user/list',
            method: 'get',
            type: 'json',
            cache: false,
            timeout: 10000,
            data: _this.userListParams,
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code = 1) {
                    _this.userListData = re.data;
                    _this.renderUserList(re.data);
                } else {
                    H.alert('请求用户列表失败');
                }
            },
            error: function () {
                H.alert('请求用户列表失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //渲染用户列表
    renderUserList: function (data) {
        var _this = this;

        //当用户身份信息接口返回数据之后，才会执行下面的回调
        H.Monitor.listen('getIdentityData', function () {
            var tableHtml = H.template($('#J-table-tpl').html(), data);
            $('#J-table-wrap').html(tableHtml);

            if (data.totalCount > 0) {
                if (_this.pagerObj == null) {
                    _this.pagerObj = new H.Pager({
                        tplB : $('#J-pager-tpl').html(),//模版
                        wrapB : $('#J-pager-wrap'),//分页插入目标
                        goToPageFunc : function (pageNum) {
                            _this.userListParams.currentPage = pageNum;
                            _this.getUserList();
                        }//点击分页按钮后触发的回调函数
                    });
                }

                //分页渲染
                _this.pagerObj.render({
                    pg: data.currentPage,
                    total: data.totalCount,
                    ps: data.pageSize
                });
            } else {
                $('#J-pager-wrap').html('');
            }
        });
    },

    //保存（新增，修改）用户信息
    saveUserMsg: function (params) {
        var _this = this;

        $.ajax({
            url: '/user/save',
            method: 'post',
            type: 'json',
            timeout: 10000,
            data: params,
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    _this.popObj.remove();
                }
                H.alert(re.msg, 2000, function () {
                    _this.getUserList();
                });
            },
            error: function () {
                H.alert('用户信息保存接口调用失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //删除用户
    delUser: function (ids) {
        var _this = this;

        $.ajax({
            url: '/user/del',
            method: 'post',
            type: 'json',
            timeout: 10000,
            data: {
                ids: ids
            },
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    H.alert(re.msg, 2000, function () {
                        _this.getUserList();
                    });
                } else {
                    H.alert(re.msg);
                }
            },
            error: function () {
                H.alert('用户删除接口调用失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //显示导入用户弹窗
    showImportPop: function () {
        var _this = this;

        _this.importPop = H.dialog({
            title: '批量导入用户',
            content: $('#J-import-pop-tpl').html(),//弹窗内容
            quickClose: true,//点击空白处快速关闭
            padding: 10,//弹窗内边距
            backdropOpacity: 0.3//遮罩层透明度(默认0.7)
        }).show();
    },

    //导入用户
    importUsers: function () {
        var _this = this,
            formData = new FormData(document.getElementById('J-import-form'));

        $.ajax({
            url: '/user/import' ,
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    var msg = re.msg;

                    if (re.data.fails.length != 0) {
                        $.each(re.data.fails, function (i, item) {
                            msg += '<br/>' + item.userName + item.msg;
                        });
                    }

                    H.alert(msg, function () {
                        _this.importPop.remove();
                        _this.getUserList();
                    });
                } else {
                    H.alert(re.msg);
                }
            },
            error: function () {
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //绑定事件
    bindEvents: function () {
        var _this = this;

        $('#J-date-wrap').datepicker({
            language: 'zh-CN',
            autoclose: true,
            format: 'yyyy-mm-dd',
            inputs: $('#J-date-wrap').find('input.J-date-picker')
        });

        $('#J-import-btn').on('click', function () {
            _this.showImportPop();
        });

        $(document)
            .on('click', '#J-add-btn, #J-table-wrap a.J-edit-btn', function (e) {
                e.preventDefault();
                var $this = $(this);
                //定义一个弹窗
                _this.popObj = H.dialog({
                    title: $this.data('type') == 'add' ? '新增用户' : '修改用户信息',
                    content: _this.popInnerHtml,//弹窗内容
                    quickClose: true,//点击空白处快速关闭
                    padding: 10,//弹窗内边距
                    backdropOpacity: 0.3,//遮罩层透明度(默认0.7)
                    onshow: function () {
                        if ($this.data('type') == 'edit') {
                            var curData = userManageMod.userListData.list[$this.data('index') * 1],
                                $form = $('#J-pop-form');

                            $form.find('input[name=id]').val(curData.id);
                            $form.find('input[name=userName]').val(curData.user_name);
                            $form.find('input[name=userRealName]').val(curData.user_real_name);
                            $form.find('input[name=userNickName]').val(curData.user_nick_name);
                            $form.find('input[name=userJobNumber]').val(curData.user_job_number);
                            $form.find('select[name=identityId]').val(curData.user_identity_id);
                        }
                    },
                    onclose: function () {
                        //alert('弹窗关闭后执行的回调');
                    }
                }).show();
            })
            .on('submit', '#J-form', function (e) {
                e.preventDefault();
                var params = $(this).serializeArray();
                $.each(params, function (i, item) {
                    userManageMod.userListParams[item.name] = item.value;
                });
                userManageMod.userListParams.currentPage = 1;
                _this.getUserList();
            })
            .on('submit', '#J-pop-form', function (e) {
                e.preventDefault();
                _this.saveUserMsg($(this).serialize());
            })
            .on('click', '#J-pop-cancel-btn', function () {
                _this.popObj.remove();
            })
            .on('click', '#J-table-wrap a.J-del-btn', function (e) {
                e.preventDefault();
                var $this = $(this);

                H.confirm({
                    content: '确定要删除此用户？',//弹窗内容
                    quickClose: true,//点击空白处快速关闭
                    width: 300,
                    okValue: '确定',
                    backdropOpacity: 0.3,//遮罩层透明度(默认0.7)
                    ok: function () {
                        _this.delUser($this.data('id'));
                    },
                    cancelValue: '取消',
                    cancel: function () {
                        //alert('点击[取消]按钮执行的回调');
                    }
                }).show();

            })
            .on('change', '#J-import-form input[type=file]', function (e) {
                $(this).next().text(e.currentTarget.files[0].name);
            })
            .on('click', '#J-import-cancel-btn', function () {
                _this.importPop.remove();
            })
            .on('click', '#J-import-do-btn', function () {
                _this.importUsers();
            });
    }
};

$(function () {
    userManageMod.init();
});
