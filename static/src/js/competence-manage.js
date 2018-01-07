var competenceManageMod = {
    //弹窗对象缓存
    pagePopObj: null,
    //弹窗对象缓存
    competencePopObj: null,
    //模块数据缓存
    pageData: null,
    //权限数据缓存
    competenceData: null,
    //当前选择的模块
    curPage: '',

    //初始化
    init: function () {
        var _this = this;

        _this.getPageList(function () {
            if (_this.pageData != null) {
                _this.getCompetenceList();
            }
        });
        _this.bindEvents();
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

                        $('#J-page-select').html(H.template($('#J-page-option-tpl').html(), {
                            pageData: _this.pageData
                        }));

                    } else {
                        _this.pageData = null;

                        $('#J-page-select').html('<option value="">请先创建权限管理模块</option>');
                    }

                    if (_this.curPage) {
                        $('#J-page-select').val(_this.curPage);
                    }

                    callBack && callBack();

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

        if ($('#J-page-select').val() == '') {
            H.alert('请先创建模块');
            return;
        }

        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/competence/competenceList',
            data: {
                pageId: $('#J-page-select').val()
            },
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    _this.competenceData = re.data;
                    _this.renderCompetenceList();
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

    //权限列表渲染
    renderCompetenceList: function () {
        var _this = this,
            competenceHtml = H.template($('#J-competence-tpl').html(), {
            pageName: _this.pageData[$('#J-page-select').val()]['name'],
            items: _this.competenceData
        });
        $('#J-competence-wrap').html(competenceHtml);
    },

    //保存模块信息
    savePage: function (data) {
        var _this = this;

        $.ajax({
            url: '/competence/savePage',
            type: 'post',
            dataType: 'json',
            timeout: 10000,
            data: data,
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    _this.pagePopObj && _this.pagePopObj.remove();
                    H.alert('操作成功！', function () {
                        _this.getPageList();
                    });
                } else {
                    H.alert(re.msg);
                }
            },
            error: function () {
                H.alert('操作失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //删除模块
    delPage: function (id) {
        var _this = this;

        $.ajax({
            url: '/competence/deletePage',
            type: 'post',
            dataType: 'json',
            timeout: 10000,
            data: {
                id: id
            },
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    H.alert('删除模块成功', function () {
                        _this.curPage = '';
                        _this.getPageList(function () {
                            if (_this.pageData != null) {
                                _this.getCompetenceList();
                            }
                        });
                    });
                } else {
                    H.alert(re.msg);
                }
            },
            error: function () {
                H.alert('删除模块失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //保存权限
    saveCompetence: function (data) {
        var _this = this;

        $.ajax({
            url: '/competence/saveCompetence',
            type: 'post',
            dataType: 'json',
            timeout: 10000,
            data: data,
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    _this.competencePopObj.remove();
                    H.alert('操作成功', function () {
                        _this.getCompetenceList();
                    });
                } else {
                    H.alert(re.msg);
                }
            },
            error: function () {
                H.alert('操作失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    //删除权限
    delCompetence: function (id) {
        var _this = this;

        $.ajax({
            url: '/competence/deleteCompetence',
            type: 'post',
            dataType: 'json',
            timeout: 10000,
            data: {
                id: id
            },
            beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                if (re.code == 1) {
                    H.alert('删除权限成功', function () {
                        _this.getCompetenceList();
                    });
                } else {
                    H.alert(re.msg);
                }
            },
            error: function () {
                H.alert('删除权限失败');
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    },

    showCompetencePop: function (flag, index) {
        var _this = this;

        _this.competencePopObj = H.dialog({
            title: flag ? '新增权限' : '修改权限',
            content: $('#J-competence-pop-tpl').html(),//弹窗内容
            quickClose: true,//点击空白处快速关闭
            padding: 10,//弹窗内边距
            backdropOpacity: 0.3,//遮罩层透明度(默认0.7)
            onshow: function () {
                var $form = $('#J-competence-form');

                $form.find('select[name=page_id]').html(H.template($('#J-page-option-tpl').html(), {
                    pageData: _this.pageData
                }));

                if (flag) {
                    var curCompetence = _this.competenceData[index];

                    $form.find('input[name=id]').val(curCompetence.id);
                    $form.find('input[name=name]').val(curCompetence.name);
                    $form.find('select[name=page_id]').val(curCompetence.page_id);
                    $form.find('textarea[name=description]').val(curCompetence.description);
                    $form.find('input[name=selector]').val(curCompetence.selector);
                }
            },
            onclose: function () {}
        }).show();
    },

    bindEvents: function () {
        var _this = this;

        $(document)
            .on('submit', '#J-page-form', function (e) {
                e.preventDefault();
                var name = $('#J-page-form').find('input[name=name]').val();

                if (name == '') {
                    H.alert('模块名不能为空');
                    return;
                }

                _this.savePage({
                    name: name
                });
            })
            .on('click', '#J-page-cancel-btn', function () {
                _this.pagePopObj.remove();
            })
            .on('submit', '#J-competence-form', function (e) {
                e.preventDefault();
                var $form = $('#J-competence-form'),
                    id = $form.find('input[name=id]').val(),
                    name = $form.find('input[name=name]').val(),
                    pageId = $form.find('select[name=page_id]').val(),
                    description = $form.find('textarea[name=description]').val(),
                    selector = $form.find('input[name=selector]').val();

                if (name == '') {
                    H.alert('权限名不能为空');
                    return;
                } else if (selector == '') {
                    H.alert('选择器不能为空');
                    return;
                }

                _this.saveCompetence({
                    id: id,
                    name: name,
                    pageId: pageId,
                    description: description,
                    selector: selector
                });
            })
            .on('click', '#J-competence-cancel-btn', function () {
                _this.competencePopObj.remove();
            })
            .on('click', '#J-competence-wrap .J-edit-btn', function (e) {
                e.preventDefault();
                _this.showCompetencePop(true, $(this).data('index'));
            })
            .on('click', '#J-competence-wrap .J-del-btn', function (e) {
                e.preventDefault();
                var id = $(this).data('id');

                H.confirm({
                    content: '确定要删除此权限？',//弹窗内容
                    quickClose: true,//点击空白处快速关闭
                    width: 300,
                    okValue: '确定',
                    backdropOpacity: 0.3,//遮罩层透明度(默认0.7)
                    ok: function () {
                        _this.delCompetence(id);
                    },
                    cancelValue: '取消',
                    cancel: function () {
                        //alert('点击[取消]按钮执行的回调');
                    }
                }).show();
            })
            .on('click', '#J-save-btn', function () {
                var name = $('#J-page-name').val();

                if (name == '') {
                    H.alert('模块名不能为空');
                    return;
                }

                _this.savePage({
                    id: $('#J-page-select').val(),
                    name: name
                });
            });

        $('#J-page-select').on('change', function () {
            _this.curPage = $(this).val();
            _this.getCompetenceList();
        });

        $('#J-add-btn').on('click', function () {
            _this.pagePopObj = H.dialog({
                title: '新增权限管理模块',
                content: $('#J-page-pop-tpl').html(),//弹窗内容
                quickClose: true,//点击空白处快速关闭
                padding: 10,//弹窗内边距
                backdropOpacity: 0.3,//遮罩层透明度(默认0.7)
                onshow: function () {},
                onclose: function () {}
            }).show();
        });

        $('#J-del-btn').on('click', function () {
            if ($('#J-page-select').val() == '') {
                H.alert('没有模块可删除，请先创建模块');
                return;
            }

            H.confirm({
                content: '确定要删除此模块？',//弹窗内容
                quickClose: true,//点击空白处快速关闭
                width: 300,
                okValue: '确定',
                backdropOpacity: 0.3,//遮罩层透明度(默认0.7)
                ok: function () {
                    _this.delPage($('#J-page-select').val());
                },
                cancelValue: '取消',
                cancel: function () {
                    //alert('点击[取消]按钮执行的回调');
                }
            }).show();
        });

        $('#J-create-btn').on('click', function () {
            if ($('#J-page-select').val() == '') {
                H.alert('请先创建模块');
                return;
            }

            _this.showCompetencePop();
        });
    }
};

$(function () {
    competenceManageMod.init();
});
