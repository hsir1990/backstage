var menuManageMod = {
    //弹窗对象缓存
    popObj: null,

    //初始化
    init: function () {
        var _this = this;

        _this.getMenuList();
        _this.bindEvents();
    },

    //菜单列表数据获取
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
                    _this.createMenu(_this.processData(re.data));
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

    //菜单生成
    createMenu: function (data) {
        var menuHtml = H.template($('#J-menu-tpl').html(), {
            items: data
        });
        $('#J-menu-wrap').html(menuHtml);
    },

    //保存（新增，修改）菜单
    saveMenuMsg: function (params) {
        var _this = this;

        $.ajax({
            url: '/menu/save',
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
                    H.alert(re.msg, 2000, function () {
                        _this.getMenuList();
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

    //删除菜单
    delMenu: function (ids) {
        var _this = this;

        $.ajax({
            url: '/menu/del',
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
                        _this.getMenuList();
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

    bindEvents: function () {
        var _this = this;

        $(document)
            .on('mouseover', '#J-menu-wrap .J-menu-item', function () {
                $(this).addClass('active');
            })
            .on('mouseleave', '#J-menu-wrap .J-menu-item', function () {
                $(this).removeClass('active');
            })
            .on('change', '#J-check-all', function () {
                var checked = this.checked;
                $('#J-menu-wrap').find('input[type=checkbox]').each(function () {
                    $(this).prop('checked', checked);
                })
            })
            .on('change', '#J-menu-wrap input[type=checkbox]', function () {
                if ($('#J-menu-wrap').find('input[type=checkbox]').length == $('#J-menu-wrap').find('input[type=checkbox]:checked').length) {
                    $('#J-check-all').prop('checked', true);
                } else {
                    $('#J-check-all').prop('checked', false);
                }
            })
            .on('click', '#J-add-btn, #J-menu-wrap a.J-add-btn, #J-menu-wrap a.J-edit-btn', function (e) {
                e.preventDefault();

                var $this = $(this);
                //定义一个弹窗
                _this.popObj = H.dialog({
                    title: $this.data('type') == 'add' ? '新增菜单' : '修改菜单',
                    content: $('#J-pop-tpl').html(),//弹窗内容
                    quickClose: true,//点击空白处快速关闭
                    padding: 10,//弹窗内边距
                    backdropOpacity: 0.3,//遮罩层透明度(默认0.7)
                    onshow: function () {
                        if ($this.data('type') == 'edit') {
                            var $form = $('#J-pop-form'),
                                $menuItem = $this.closest('p.J-menu-item');
                            $form.find('input[name=id]').val($this.data('id'));
                            $form.find('input[name=name]').val($menuItem.find('.J-menu-name').text());
                            $form.find('input[name=href]').val($menuItem.find('.J-menu-href').text());
                            $form.find('select[name=target]').val($this.data('target'));
                        } else {
                            $('#J-pop-form').find('input[name=pid]').val($this.data('pid') || 0);
                        }
                    },
                    onclose: function () {
                        //alert('弹窗关闭后执行的回调');
                    }
                }).show();
            })
            .on('submit', '#J-pop-form', function (e) {
                e.preventDefault();
                _this.saveMenuMsg($(this).serialize());
            })
            .on('click', '#J-pop-cancel-btn', function () {
                _this.popObj.remove();
            })
            .on('click', '#J-menu-wrap a.J-del-btn', function (e) {
                e.preventDefault();

                var $this = $(this);

                H.confirm({
                    content: '确定要删除此菜单？',//弹窗内容
                    quickClose: true,//点击空白处快速关闭
                    width: 300,
                    okValue: '确定',
                    backdropOpacity: 0.3,//遮罩层透明度(默认0.7)
                    ok: function () {
                        _this.delMenu($this.data('id'));
                    },
                    cancelValue: '取消',
                    cancel: function () {
                        //alert('点击[取消]按钮执行的回调');
                    }
                }).show();
            });

        $('#J-multi-del-btn').on('click', function () {
            var $checkedInput = $('#J-menu-wrap').find('input[type=checkbox]:checked');

            if ($checkedInput.length == 0) {
                H.alert('没有勾选任何菜单');
            } else {
                var ids = [],
                    params = $('#J-menu-wrap').serializeArray();

                $.each(params, function (i, item) {
                    ids.push(item.value);
                });

                H.confirm({
                    content: '确定要删除所有选中的菜单？',//弹窗内容
                    quickClose: true,//点击空白处快速关闭
                    width: 300,
                    okValue: '确定',
                    backdropOpacity: 0.3,//遮罩层透明度(默认0.7)
                    ok: function () {
                        _this.delMenu(ids.join(','));
                    },
                    cancelValue: '取消',
                    cancel: function () {
                        //alert('点击[取消]按钮执行的回调');
                    }
                }).show();
            }

        });
    }
};

$(function () {
    menuManageMod.init();
});
