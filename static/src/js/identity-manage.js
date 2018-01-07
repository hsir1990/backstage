var identityManageMod = {
    //弹窗对象缓存
    popObj: null,
    //菜单数据缓存
    menuListData: null,
    //角色数据缓存
    identityData: null,
    //模块数据缓存
    pageData: null,
    //权限数据缓存
    competenceData: null,

    //初始化
    init: function () {
        var _this = this;

        _this.getIdentityList();
        _this.getMenuList();
        _this.getPageList();
        _this.bindEvents();

        _this.createMenu();
    },

    //角色数据获取
    getIdentityList: function () {
        var _this = this;

        $.ajax({
            url: '/identity/get',
            type: 'get',
            dataType: 'json',
            timeout: 10000,
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code = 1) {
                    var identityData = {};

                    $.each(re.data, function (i, item) {
                        identityData[item.id] = item;
                    });

                    _this.identityData = identityData;

                    $('#J-role-select').append(H.template($('#J-identity-option-tpl').html(), {
                        identityData: _this.identityData
                    }));

                    H.Monitor.trigger('getIdentityList');
                } else {
                    H.alert('请求用户身份字典失败');
                }
            },
            error: function () {
                H.alert('请求用户身份字典失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //菜单数据获取
    getMenuList: function () {
        var _this = this;

        $.ajax({
            type: 'get',
            dataType: 'json',
            url: 'menu/list',
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    _this.menuListData = _this.processData(re.data);
                    H.Monitor.trigger('getMenuList');
                } else {
                    H.alert(re.msg);
                }
            },
            error: function () {
                H.alert('获取用户菜单列表失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //菜单数据处理
    processData: function (data) {
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
    },

    //模块数据获取
    getPageList: function (callBack) {
        var _this = this;

        $.ajax({
            url: '/competence/pageList',
            type: 'get',
            dataType: 'json',
            timeout: 10000,
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code = 1) {

                    if (re.data.length > 0) {

                        var pageData = {};

                        $.each(re.data, function (i, item) {
                            pageData[item.id] = item;
                        });

                        _this.pageData = pageData;

                    } else {
                        _this.pageData = null;
                    }

                    _this.getCompetenceList();

                } else {
                    H.alert('模块数据获取失败');
                }
            },
            error: function () {
                H.alert('模块数据获取失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //权限数据获取
    getCompetenceList: function () {
        var _this = this;

        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/competence/competenceList',
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    var _data = re.data;

                    _.each(_this.pageData, function (page, pageId) {
                        page.competenceList = _.filter(_data, function (competence) {
                            return competence.page_id == pageId;
                        });
                    });

                    H.Monitor.trigger('getCompetenceList');
                } else {
                    H.alert('权限数据获取失败');
                }
            },
            error: function () {
                H.alert('权限数据获取失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //菜单生成
    createMenu: function () {
        H.Monitor.listen('getIdentityList, getMenuList, getCompetenceList', function () {
            var currentIdentity = identityManageMod.identityData[$('#J-role-select').val()];
            var menuHtml = H.template($('#J-menu-tpl').html(), {
                identityName: currentIdentity.identity_name,
                items: identityManageMod.menuListData,
                competence: currentIdentity.identity_competence.split(','),
                pageData: identityManageMod.pageData,
                limit: currentIdentity.identity_operating_limits.split(',')
            });
            $('#J-menu-wrap').html(menuHtml);
        });
    },

    //保存角色权限
    saveIdentityCompetence: function () {
        var _this = this,
            identityCompetenceArr = [],
            identityCompetence = '',
            identityOperatingLimitsArr = [],
            identityOperatingLimits = '',
            identityId = $('#J-role-select').val(),
            identityName = $('#J-menu-wrap').find('input[name=identityName]').val();

        if (identityName == '') {
            H.alert('角色名不能为空!');
            return;
        }

        $('#J-menu-wrap').find('input[name=identityCompetence]:checked').each(function () {
            identityCompetenceArr.push($(this).val());
        });

        identityCompetence = identityCompetenceArr.join(',');

        $('#J-menu-wrap').find('input[name=competenceList]:checked').each(function () {
            identityOperatingLimitsArr.push($(this).val());
        });

        identityOperatingLimits = identityOperatingLimitsArr.join(',');

        $.ajax({
            url: '/identity/update',
            type: 'post',
            dataType: 'json',
            timeout: 10000,
            data: {
                identityId: identityId,
                identityName: identityName,
                identityCompetence: identityCompetence,
                identityOperatingLimits: identityOperatingLimits
            },
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    _this.identityData[identityId].identity_competence = identityCompetence;
                    _this.identityData[identityId].identity_operating_limits = identityOperatingLimits;
                    $('#J-role-select').find('option:selected').text(identityName);
                    H.alert('保存成功!');
                } else {
                    H.alert(re.msg);
                }
            },
            error: function () {
                H.alert('保存角色权限接口调用失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //新增角色
    addIdentity: function (identityName) {
        var _this = this;

        $.ajax({
            url: '/identity/add',
            type: 'post',
            dataType: 'json',
            timeout: 10000,
            data: {
                identityName: identityName
            },
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    _this.popObj.remove();
                    H.alert(re.msg, 2000, function () {
                        var tplData = {};

                        _this.identityData[re.data.insertId] = tplData[re.data.insertId] = {
                            id: re.data.insertId,
                            identity_competence: '',
                            identity_name: identityName
                        };

                        $('#J-role-select').append(H.template($('#J-identity-option-tpl').html(), {
                            identityData: tplData
                        }));

                        $('#J-role-select').val(re.data.insertId);

                        _this.createMenu();
                    });
                } else {
                    H.alert(re.msg);
                }
            },
            error: function () {
                H.alert('用户信息保存接口调用失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //删除角色
    delIdentity: function (identityId) {
        $.ajax({
            url: '/identity/del',
            type: 'post',
            type: 'json',
            timeout: 10000,
            data: {
                identityId: identityId
            },
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    H.alert(re.msg, function () {
                        $('#J-role-select').find('option:selected').remove();
                        identityManageMod.createMenu();
                    });
                } else {
                    H.alert(re.msg);
                }
            },
            error: function () {
                H.alert('用户信息保存接口调用失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    bindEvents: function () {
        var _this = this;

        $(document)
            .on('mouseover', '#J-menu-wrap .J-menu-item', function (e) {
                e.stopPropagation();
                $('#J-menu-wrap .J-menu-item').removeClass('active');
                $(this).addClass('active');
            })
            .on('mouseleave', '#J-menu-wrap .J-menu-item', function (e) {
                $(this).removeClass('active');
            })
            .on('change', '#J-menu-wrap input[type=checkbox]', function (e) {
                if (this.checked) {
                    $(this).parents('.J-menu-item').not($(this).closest('.J-menu-item')).each(function () {
                        $(this).find('>span').find('input[type=checkbox]').prop('checked', true);
                    });
                } else {
                    $(this).closest('.J-menu-item').find('input[type=checkbox]').prop('checked', false);
                }
            })
            .on('submit', '#J-pop-form', function (e) {
                e.preventDefault();
                var identityName = $('#J-pop-form').find('input[name=identityName]').val();

                if (identityName == '') {
                    H.alert('角色名不能为空');
                    return;
                }

                _this.addIdentity(identityName);
            })
            .on('click', '#J-pop-cancel-btn', function () {
                _this.popObj.remove();
            })
            .on('click', '#J-nav-wrap li', function () {
                $(this).addClass('active').siblings().removeClass('active');
                $('#J-content-wrap').children().eq($(this).index()).show().siblings().hide();
            });

        $('#J-role-select').on('change', function () {
            _this.createMenu();
        });

        $('#J-save-btn').on('click', function () {
            _this.saveIdentityCompetence();
        });

        $('#J-add-btn').on('click', function () {
            _this.popObj = H.dialog({
                title: '新增角色',
                content: $('#J-pop-tpl').html(),//弹窗内容
                quickClose: true,//点击空白处快速关闭
                padding: 10,//弹窗内边距
                backdropOpacity: 0.3,//遮罩层透明度(默认0.7)
                onshow: function () {},
                onclose: function () {}
            }).show();
        });

        $('#J-del-btn').on('click', function () {
            H.confirm({
                content: '确定要删除此角色？',//弹窗内容
                quickClose: true,//点击空白处快速关闭
                width: 300,
                okValue: '确定',
                backdropOpacity: 0.3,//遮罩层透明度(默认0.7)
                ok: function () {
                    _this.delIdentity($('#J-role-select').val());
                },
                cancelValue: '取消',
                cancel: function () {
                    //alert('点击[取消]按钮执行的回调');
                }
            }).show();
        });
    }
};

$(function () {
    identityManageMod.init();
});
