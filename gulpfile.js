var gulp = require('gulp'),

    copy = require('gulp-copy'),
    replace = require('gulp-replace'),

    uglify = require('gulp-uglify'),

    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),

    util = require('gulp-util'),
    notify = require('gulp-notify'),

    argv = require('minimist')(process.argv.slice(2)),
    path = require('path'),
    fs = require('fs');

//【内部调用函数】控制台错误处理
function handleErrors () {
    var args = Array.prototype.slice.call(arguments);

    notify.onError({
        title : 'compile error',
        message : '<%=error.message %>'
    }).apply(this, args);//替换为当前对象

    this.emit();//提交
}

/*
*任务：为html文件中的css 和 js 外链添加版本号
**/
gulp.task('replace', function () {
    var now = new Date().valueOf(),
    stream = gulp.src('static/*.html')
        .pipe(replace(/href="(.*?).css"/g, 'href="$1.css?v=' + now + '"'))
        .pipe(replace(/src="(.*?).js"/g, 'src="$1.js?v=' + now + '"'))
        .pipe(replace(/href="(.*?).css\?v=(\d*?)"/g, 'href="$1.css?v=' + now +'"'))
        .pipe(replace(/src="(.*?).js\?v=(\d*?)"/g, 'src="$1.js?v=' + now + '"'))
        .pipe(gulp.dest('static'));

    return stream;
});

/*
 * 任务：将 less 编译成 css
 * */
gulp.task('less', function () {
    // 引入less文件，压缩可以合并成css文件
    var stream = gulp.src('static/src/less/*.less')
        .pipe(less())
        .on("error", handleErrors)
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .on('error', handleErrors)
        .pipe(minifycss())
        .pipe(gulp.dest('static/dist/css'));

    return stream;
});

/*
 * 任务：uglify 压缩 js
 * */
gulp.task('uglify', function () {
    var stream = gulp.src('static/src/js/**/*.js')
        .pipe(uglify())
        .on("error", handleErrors)
        .pipe(gulp.dest('static/dist/js'));

    return stream;
});

/*
 * 任务：模版复制
 * */
gulp.task('coyp:tpl', function () {
    var stream = gulp.src(['static/src/view/**/*.html'])
        .pipe(copy('static/dist', {
            prefix : 2
        }));

    return stream;
});

/*
 * 任务：dist 任务的子任务，用来复制必要文件到 dist 目录
 * */
gulp.task('copy:other', function () {
    var stream = gulp.src(['static/src/img/**/*', 'static/src/lib/**/*', 'static/src/font/**/*'])
        .pipe(copy('static/dist', {
            prefix : 2
        }));

    return stream;
});

/*
 * 任务：dist 构建
 * */
gulp.task('dist', function () {
    gulp.start('uglify', 'less', 'coyp:tpl', 'copy:other', 'replace');
});

gulp.task('watch:js', function () {
    gulp.watch(['static/src/js/**/*.js'], function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running uglify tasks...');
        gulp.start('uglify');
    });
});

gulp.task('watch:less', function () {
    gulp.watch('static/src/less/**/*.less', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running less tasks...');
        gulp.start('less');
    });
});

gulp.task('watch:tpl', function () {
    gulp.watch('static/src/view/**/*.html', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', coyp:tpl less tasks...');
        gulp.start('coyp:tpl');
    });
});

gulp.task('watch', function () {
    gulp.start('watch:js', 'watch:less', 'watch:tpl');
});

/*
 * 任务：自定义任务
 * 描述：可根据自己需要自定义常用任务
 * */
gulp.task('default', function () {
    gulp.start('dist');
});
