/* eslint no-console: "off" */

'use strict';

const path = require( 'path' );

const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const less = require( 'gulp-less' );
const sourcemaps = require( 'gulp-sourcemaps' );

const postcss = require( 'gulp-postcss' );
const autoprefixer = require( 'autoprefixer' );
const cssnano = require( 'cssnano' );

const source = require( 'vinyl-source-stream' );
const buffer = require( 'vinyl-buffer' );
const browserify = require( 'browserify' );



//////// Settings

// Cross platform pathing handeled by gulp.

const sourceDir = 'client';
const scriptsSourceDir = `${ sourceDir }/app`;
const stylesSourceDir = `${ sourceDir }/styles`;

const outputDir = 'public';
const scriptsOutputDir = `${ outputDir }/js`;
const stylesOutputDir = `${ outputDir }/css`;

const buildEnv = process.env.NODE_ENV;




//////// General

gulp.task( 'default', [ 'site' ]);
gulp.task( 'watch', [ 'watch-site' ]);

gulp.task( 'site', [
	'site:assets',
	'site:styles',
	'site:scripts',
]);

gulp.task( 'watch-site', [ 'site:assets', 'site:styles' ], () => {
	gulp.watch([ `${ sourceDir }/assets/**/*` ], [
		'site:assets:site',
	]);

	gulp.watch([ `${ stylesSourceDir }/**/*` ], [
		'site:styles',
	]);

	site_scripts_main( true );
});



//////// Scripts

gulp.task( 'site:scripts', [
	'site:scripts:main'
]);

gulp.task( 'site:scripts:main', () => site_scripts_main() );

function site_scripts_main( watch ) {
	let bundler = browserify( `${ scriptsSourceDir }/index.js`, {
		debug: buildEnv !== 'production',
		cache: {}, packageCache: {}
	})
		.transform( 'envify' )
		.transform( 'babelify' )
		;

	if( buildEnv === 'production' ) {
		bundler = bundler.transform( 'uglifyify' );
	}

	if( watch ) {
		bundler = bundler.plugin( 'watchify' );
		bundler.on( 'update', execBundle );
		bundler.on( 'log', function() { gutil.log.apply( gutil, [ 'watch:app:scripts:combined/bundler:' ].concat( [].slice.call( arguments, 0 ) ) ); });
	}

	return execBundle();

	function execBundle() {
		let stream = bundler
			.bundle()
			.on( 'error', function( err ) {
				console.error( err.message );
				if( err.codeFrame ) console.error( err.codeFrame );
				this.emit( 'end' );
			})
			.pipe( source( 'app.js' ) )
			.pipe( buffer() )
			;

		if( buildEnv !== 'production' ) {
			stream = stream
				.pipe( sourcemaps.init({ loadMaps: true }) )
				.pipe( sourcemaps.write( './' ) )
		}

		stream = stream
			.pipe( gulp.dest( `${ scriptsOutputDir }` ) )
			;

		return stream;
	}
}



//////// Assets

gulp.task( 'site:assets', [
	'site:assets:site',
	'site:assets:bootstrap:fonts',
]);

gulp.task( 'site:assets:site', () => {
	return gulp.src([ `${ sourceDir }/assets/**/*` ])
		.pipe( gulp.dest( `${ outputDir }` ) )
		;
});

gulp.task( 'site:assets:bootstrap:fonts', () => {
	return gulp.src([ 'node_modules/bootstrap/dist/fonts/**/*' ])
		.pipe( gulp.dest( `${ outputDir }/fonts` ) )
		;
});



//////// Styles

gulp.task( 'site:styles', () => {
	return gulp.src([
		`${ stylesSourceDir }/*.less`
	])
		.pipe( buildEnv !== 'production' ? sourcemaps.init() : gutil.noop() )
		.pipe( less({
			paths: [
				path.join( __dirname, 'node_modules', 'bootstrap', 'less' )
			],
		}))
		.pipe( postcss([
				autoprefixer({ browsers: [ 'last 2 versions' ] }),
			].concat(
				buildEnv === 'production'
				? [ cssnano({ safe: true }) ]
				: []
		)))
		.on( 'error', function( err ) { console.error( err.message ); console.error( err.codeFrame ); this.emit( 'end' ); })
		.pipe( buildEnv !== 'production' ? sourcemaps.write( './' ) : gutil.noop() )
		.pipe( gulp.dest( `${ stylesOutputDir }` ) )
		;
});
