'use strict';

var paths = {
    js: {
        client: [
            'packages/*/public/**/*.js',
            '!packages/*/public/assets/js/libs/**/*.js',
            '!**/logo-data.js'
        ],
        server: [
            'packages/*/app.js',
            'packages/*/server/**/*.js',
            'config/**/*.js',
            'server.js',
            '!node_modules/**'
        ]
    },
    html: [
        'packages/**/public/**/views/**',
        'packages/**/server/views/**'
    ],
    css: [
        '!bower_components/**',
        'packages/**/public/**/css/*.css'
    ]
};

module.exports = function(grunt) {

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assets: grunt.file.readJSON('config/assets.json'),
        clean: ['build'],
        watch: {
            js: {
                files: [
                    paths.js.client,
                    paths.js.server,
                    '!build/**'
                ],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: paths.html,
                options: {
                    livereload: true,
                    interval: 500
                }
            },
            css: {
                files: paths.css,
                tasks: ['csslint'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            client: {
                src: paths.js.client,
                options: {
                    jshintrc: 'config/rules/.jshintrc-client'
                }
            },
            server: {
                src: paths.js.server,
                options: {
                    jshintrc: 'config/rules/.jshintrc-server'
                }
            }
        },
        uglify: {
            core: {
                options: {
                    // mangle: false
                },
                files: '<%= assets.js %>'
            }
        },
        csslint: {
            options: {
                csslintrc: 'config/rules/.csslintrc'
            },
            src: paths.css
        },
        cssmin: {
            core: {
                files: '<%= assets.css %>'
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: [],
                    ignore: ['node_modules/**'],
                    ext: 'js,html',
                    // nodeArgs: ['--debug'],
                    delayTime: 1,
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        filerev: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'build/.tmp',
                    src: ['**/*'],
                    dest: 'build/public'
                }]
            }
        },
        filerev_assets: {
            rev: {
                options: {
                    dest: 'build/rev.json',
                    cwd: 'build/public'
                }
            }
        },
        copy: {
            frontend: {
                files: [{
                    expand: true,
                    cwd: 'packages/frontend/public/assets/img',
                    src: ['**/*'],
                    dest: 'build/public/img'
                }]
            },
            backend: {
                files: [{
                    expand: true,
                    cwd: 'packages/backend/public/assets/img',
                    src: ['**/*'],
                    dest: 'build/public/img'
                }]
            },
            common: {
                files: '<%= assets.copy %>'
            }
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        }
    });

    //Load NPM tasks
    require('load-grunt-tasks')(grunt);

    //Default task(s).
    grunt.registerTask('verify', ['jshint', 'csslint']);

    grunt.registerTask('build', ['clean', 'cssmin', 'uglify', 'copy', 'filerev', 'filerev_assets']);

    grunt.registerTask('default', ['verify', 'concurrent']);

    grunt.registerTask('test', ['env:test', 'verify', 'build', 'concurrent']);
};
