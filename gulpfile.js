const gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    browserSync = require('browser-sync'),
    cssnano = require('gulp-cssnano'), 
	rename = require('gulp-rename'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer');
    

gulp.task('scss', function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('script', function() {
    return gulp.src('app/js/**/*.js')
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/mixitup/dist/mixitup.min.js',
        'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js'

      
        
        
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('code', function() {
    return gulp.src('app/*.html')
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('css-libs', function() {
    return gulp.src('app/scss/libs.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'));
});

gulp.task('clean', async function() {
    return del.sync('dist');
});

gulp.task('prebuild', async function() {
    let buildCss = gulp.src([
        'app/css/main.css',
        'app/css/libs.min.css'
    ])
    .pipe(gulp.dest('dist/css'));

    let buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

    let buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

    let buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

    let buildImg = gulp.src('app/img/**/*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function() {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
    gulp.watch('app/*.html', gulp.parallel('code'));
    gulp.watch('app/js/**/*.js', gulp.parallel('script'));
});

gulp.task('default', gulp.parallel('css-libs', 'scss', 'scripts', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'scss', 'scripts'));