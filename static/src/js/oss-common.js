'use strict';
document.domain = '7lk.com';

window.xhrPool = window.xhrPool || {};
window.appCompetenceMod = window.appCompetenceMod || {};

appCompetenceMod.getCompetenceList = function (opts, successCB, errorCB) {
    var nextToDo = function (data) {
        $.ajax({
            type: 'get',
            dataType: 'jsonp',
            url: 'http://oss.7lk.com/competence/competenceList',
            data: data,
            _beforeSend: function () {
                H.Loading.show();
            },
            success: function (re) {
                var result = [];
                $.each(re.data, function (i, item) {
                    result.push(item.selector);
                });
                successCB && successCB(result);
            },
            error: function () {
                errorCB && errorCB();
            },
            complete: function () {
                H.Loading.hide();
            }
        });
    };

    $.ajax({
        type: 'get',
        dataType: 'jsonp',
        url: 'http://oss.7lk.com/identity/get',
        data: {
            id: opts.identityId
        },
        _beforeSend: function () {
            H.Loading.show();
        },
        success: function (re) {
            if (re.code == 1) {
                var operatingLimits = re.data[0].identity_operating_limits;

                if (operatingLimits == '') {
                    successCB && successCB([]);
                } else {
                    nextToDo({
                        pageId: opts.pageId,
                        limit: operatingLimits
                    });
                }
            }
        },
        error: function () {
            errorCB && errorCB();
        },
        complete: function () {
            H.Loading.hide();
        }
    });
};

appCompetenceMod.render = function (selectorList, flag) {
    var selector = selectorList.join(',');
    if (flag) {
        $(selector).remove();
    } else {
        $(selector).hide();
    }
};

$.ajaxSetup({
    timeout: 60 * 1000,
    beforeSend: function (xhr, config) {
        if (!H.Cookie.get('userToken')) {
            //中断当前请求
            xhr.abort();
            //中断请求池中的所有请求
            $.each(window.xhrPool, function (xhrName, xhr) {
                xhr.abort();
            });

            H.alert('用户票据信息已过期，请刷新页面重新登录！');
        } else {
            if (typeof window.xhrPool[config.url] != 'undefined') {
                //如果请求池里已经有同样的请求，先将它中断
                window.xhrPool[config.url].abort();
            }

            //把请求的 deferred 对象放入请求池
            window.xhrPool[config.url] = xhr;

            if (config._beforeSend && typeof config._beforeSend == 'function') {
                config._beforeSend();
            }
        }
    }
});

$.ajax({
    url: 'http://oss.7lk.com/get_v',
    type: 'get',
    dataType: 'jsonp',
    success: function (re) {
        var curVer = re.data,
            odlVer = H.Storage.get('version');

        if (curVer != odlVer) {
            H.Storage.set('version', curVer);
        }
    },
    error: function () {
        console.info('get version fail');
    }
});

$(document)
    .on('click', '.col-checkbox', function (e) {
        if (e.target.tagName.toLocaleLowerCase() == 'input' && e.target.type == 'checkbox') {
            return;
        }

        $(this).find('input[type=checkbox]').click();
    });

H.Monitor.trigger('commonInit');
