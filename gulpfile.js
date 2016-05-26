var gulp        = require('gulp');
var gutil       = require('gulp-util');
var sass        = require('gulp-sass');
var browserSync = require('browser-sync');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var plumber     = require('gulp-plumber');
var imagemin    = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');

var exec = cp.exec;
var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Beep function on Ubuntu

gulp.task('beep', function () {
	exec('paplay /usr/share/sounds/ubuntu/stereo/system-ready.ogg');
})

// Build the jekyll site

gulp.task('jekyll-build', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
    .on('close', done);
});

// rebuild jekyll & do page reload

gulp.task('jekyll-rebuild', ['jekyll-build'], function (){
  browserSync.reload();
})

// wait for jekyll build, then launch the server

gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

// compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)

gulp.task('sass', function() {
  return gulp.src('_scss/main.scss')
    .pipe(plumber(function(error) {
      gulp.start('beep');
      gutil.log(gutil.colors.red(error.message));
      this.emit('end');
    }))
    .pipe(sass({
      includePaths: ['scss'],
      onError: browserSync.notify
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('_site/css'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('css'));
})

// workflow for processing images - resize and imagemin

gulp.task('image', function () {
  return gulp.src('assets/src/images/*')
    .pipe(imageResize({
       width : 1920,
       height : 1920,
       sharpen : true
     }))
    .pipe(imagemin())
    .pipe(gulp.dest('assets/img'))
})

// watch scss files for changes and recompile
// watch html/md files, run jekyll & reload BrowserSync

gulp.task('watch', function () {
  gulp.watch('_scss/*.scss', ['sass']);
  gulp.watch('_scss/*/*.scss', ['sass']);
  gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html', '_posts/*'], ['jekyll-rebuild']);
});

// default task

gulp.task('default', ['browser-sync', 'watch']);
