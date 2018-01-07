var app = angular.module('app');

app.directive('fitScreen', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr, controller) {
            $(element).height($(window).height());
        }
    }
});

app.directive('realTime', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr, controller) {
            /*window.CHAT = {
                socket: null,
                init: function () {
                    var _this = this;
                    //连接websocket后端服务器
                    _this.socket = io.connect('http://localhost:3000');

                    scope.$watch('userName', function (newValue, oldValue) {
                        if (newValue != '') {
                            //告诉服务器端有用户登录
                            _this.socket.emit('login', {
                                username: scope.userName
                            });
                        }
                    });

                    //监听消息发送
                    this.socket.on('noticeUpdate', function (obj) {
                        scope.noticeCount = obj.noticeCount;
                        scope.$apply();
                    });
                },
                logout: function () {
                    //告诉服务器端有用户退出登录
                    this.socket.emit('login', {
                        username: scope.userName
                    });
                }
            };

            CHAT.init();*/
        }
    }
});

app.directive('wrapFit', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr, controller) {
            if (!window.wrapMod) {
                window.wrapMod = {
                    clickX: 0,
                    clickY: 0,
                    mainScroll: null,
                    tabScroll: null,
                    subScroll: null,
                    eventFlag: false,

                    //模块初始化
                    init: function () {
                        var _this = this;

                        _this.setContMinHeight();

                        _this.tabScroll = new iScroll('J-frame-tab', {
                            snap: 'li',
                            bounce: false, //是否超过实际位置反弹
                            bounceLock: false, //当内容少于滚动是否可以反弹，这个实际用处不大
                            momentum: true, //动量效果，拖动惯性
                            hideScrollbar: true, //隐藏滚动条
                            hScroll: true, //是否水平滚动
                            vScroll: false, //是否垂直滚动
                            hScrollbar: false, //是否显示水平滚动条
                            vScrollbar: false, //是否显示垂直滚动条
                            onBeforeScrollStart: function (e) {
                                e.preventDefault();
                            }
                        });

                        if (!_this.eventFlag) {
                            _this.addEvents();
                        }
                    },

                    //设置内容区的最小高度
                    setContMinHeight: function () {
                        var _this = this,
                            h = $(window).height() - $('#J-header').outerHeight() - $('#J-footer').outerHeight(),
                            containerH = h - $('#J-frame-tab').outerHeight();

                        $('#J-sidebar, #J-submenu-wrap').height(h);
                        $('#J-container').height(containerH);

                        _this.mainScroll && _this.mainScroll.refresh();
                    },

                    //展示页面
                    showPage: function (opts) {
                        var _this = this;

                        if (!window.frames[opts.target]) {
                            var frame = document.createElement('iframe'),
                                $frameTabUl = $('#J-frame-tab').find('ul.inner'),
                                v = H.Storage.get('version');

                            frame.className = 'iframe';
                            frame.frameborder = 0;
                            frame.scrolling = 'auto';
                            frame.name = opts.target;
                            frame.src = opts.href + '?token=' + H.Cookie.get('userToken') + '&v=' + v;

                            $('#J-container').append(frame);

                            $frameTabUl.find('li').removeClass('active');
                            $frameTabUl
                                .append('<li class="item active" data-name="' + opts.target + '">' + opts.name + '</li>')
                                .width($frameTabUl.find('li').length * $frameTabUl.find('li').outerWidth());
                            _this.tabScroll && _this.tabScroll.refresh();
                            _this.tabScroll && _this.tabScroll.scrollToElement($frameTabUl.find('li').last()[0]);
                        } else {
                            var $li = $('#J-frame-tab').find('li[data-name=' + opts.target + ']');
                            $li.addClass('active').siblings().removeClass('active');
                            _this.tabScroll && _this.tabScroll.scrollToElement($li[0]);

                            window.frames[opts.target].location.href = opts.href + '?token=' + H.Cookie.get('userToken');
                        }

                        $('#J-container').find('iframe').width(0).height(0).css('position', 'absolute');
                        $('#J-container').find('iframe[name=' + opts.target + ']').width('100%').height('100%').css('position', 'relative');
                    },

                    //事件绑定
                    addEvents: function () {
                        var _this = this;

                        $(document)
                            .on('mouseover', '#J-sidebar li', function (e) {
                                var $this = $(this);

                                $this.addClass('active');

                                if ($this.hasClass('J-has-submenu')) {
                                    $('#J-submenu-wrap')
                                        .show()
                                        .html($this.find('ul.J-submenu').clone());

                                    wrapMod.subScroll = null;
                                    wrapMod.subScroll = new iScroll('J-submenu-wrap', {
                                        snap: 'li',
                                        bounce: false, //是否超过实际位置反弹
                                        bounceLock: false, //当内容少于滚动是否可以反弹，这个实际用处不大
                                        momentum: true, //动量效果，拖动惯性
                                        hideScrollbar: true, //隐藏滚动条
                                        onBeforeScrollStart: function (e) {
                                            e.preventDefault();
                                        }
                                    });

                                } else {
                                    $('#J-submenu-wrap').hide();
                                }
                            })
                            .on('mouseleave', '#J-sidebar li', function (e) {
                                var $this = $(this),
                                    $toElement = e.toElement ? $(e.toElement) : $(e.relatedTarget);

                                $this.removeClass('active');

                                if ($toElement.closest('#J-submenu-wrap').length < 1) {
                                    $('#J-submenu-wrap').hide();
                                }
                            })
                            .on('mouseleave', '#J-submenu-wrap', function (e) {
                                var $toElement = $(e.toElement);
                                if ($toElement.closest('#J-sidebar li.J-has-submenu').length < 1) {
                                    $(this).hide();
                                }
                            })
                            .on('click', '#J-submenu-wrap div.J-can-open', function (e) {
                                var $this = $(this),
                                    callBack = function () {
                                        wrapMod.subScroll && wrapMod.subScroll.refresh();
                                    };
                                if ($this.hasClass('active')) {
                                    $this.removeClass('active').next().slideUp(50, callBack);
                                } else {
                                    $this.addClass('active').next().slideDown(50, callBack);
                                }
                            })
                            .on('click', '#J-sidebar a, #J-submenu-wrap a', function (e) {
                                if (e.target.target != '_blank') {
                                    e.preventDefault();
                                }
                            })
                            .on('mousedown', '#J-sidebar a, #J-submenu-wrap a', function (e) {
                                wrapMod.clickY = e.pageY;
                            })
                            .on('mouseup', '#J-sidebar a, #J-submenu-wrap a, #J-link-change-pwd', function (e) {
                                if (Math.abs(wrapMod.clickY - e.pageY) < 50) {
                                    if (!!H.Cookie.get('userToken')) {
                                        if (e.target.target != '_blank') {
                                            _this.showPage({
                                                target: e.target.target,
                                                href: e.target.href,
                                                name: e.target.name
                                            });
                                        }
                                    } else {
                                        location.href = '/#/login';
                                    }
                                }
                            })
                            .on('mousedown', '#J-frame-tab li', function (e) {
                                wrapMod.clickX = e.pageX;
                            })
                            .on('mouseup', '#J-frame-tab li', function (e) {
                                if (Math.abs(wrapMod.clickX - e.pageX) < 50) {
                                    var $target = $(e.target);
                                    if (!$target.hasClass('active')) {
                                        $target.addClass('active').siblings().removeClass('active');

                                        $('#J-container').find('iframe').width(0).height(0).css('position', 'absolute');
                                        $('#J-container').find('iframe[name=' + $target.data('name') + ']').width('100%').height('100%').css('position', 'relative');
                                    }
                                }
                            })
                            .on('dblclick', '#J-frame-tab li', function (e) {
                                var $target = $(e.target),
                                    $ul = $target.parent();

                                if ($target.data('name') != 'home') {
                                    $target
                                        .prev().addClass('active')
                                        .end().remove();

                                    $ul.width($ul.find('li').length * $ul.find('li').outerWidth());

                                    $('#J-container')
                                        .find('iframe[name=' + $target.data('name') + ']')
                                        .prev().width('100%').height('100%').css('position', 'relative')
                                        .end().remove();

                                    _this.tabScroll && _this.tabScroll.refresh();
                                }
                            });

                        $(window).on('resize', function () {
                            wrapMod.setContMinHeight();
                        });

                        wrapMod.eventFlag = true;
                    }
                };
            }

            wrapMod.init();
        }
    }
});

app.directive('setSideScroll', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr, controller) {
            wrapMod.mainScroll = new iScroll('J-sidebar', {
                snap: 'li',
                bounce: false, //是否超过实际位置反弹
                bounceLock: false, //当内容少于滚动是否可以反弹，这个实际用处不大
                momentum: true, //动量效果，拖动惯性
                hideScrollbar: true, //隐藏滚动条
                onBeforeScrollStart: function (e) {
                    e.preventDefault();
                }
            });
        }
    }
});

