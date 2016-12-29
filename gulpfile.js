var gulp = require('gulp');
var ts = require('gulp-typescript');
 
gulp.task('default', function () {
    return gulp.src('cncnet/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            target: 'ES5',
            out: 'cncnet-twitch-app.js'
        }))
        .pipe(gulp.dest('example/'));
});