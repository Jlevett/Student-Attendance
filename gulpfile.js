var gulp = require('gulp');

var browserSync = require('browser-sync').create();

//Live editing intialization
gulp.task('browserSync', function() {
	browserSync.init({
		server: './'//Base directory for css, jss folder and index.html
	})
})

gulp.task('default', ['browserSync'], function(){ //Made to work on gulp 4.0
	gulp.watch('index.html').on('change', browserSync.reload);
	gulp.watch('css/styles.css').on('change', browserSync.reload);
	gulp.watch('js/app.js').on('change', browserSync.reload);
})
