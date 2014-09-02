/**
 * Grunt file
 *
 * Grunt can be used in on of these fields
 *
 * <ul>
 * <li> create a local web server using nodejs </li>
 * <li> watch file changes, thus refresh automatically </li>
 * <li> concating different javascript files for network optimization</li>
 * <li> run javascript lint tools </li>
 * <li> clean up directories </li>
 * <li> template processing </li>
 * </ul>
 *
 * @link http://gruntjs.com/api/grunt
 * @author Wang, Yan I <yan.i.wang@intel.com>
 */
module.exports = function(grunt) {
    grunt.initConfig({

        /**
         * start the server which is located at localhost
         *
         * @link https://github.com/gruntjs/grunt-contrib-connect
         */
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: '',
                    /**
                     * default:false, the server will shutdown after the task finishes
                     * if a watch task is started later, it is not necessary to overide this default value
                     */
                     keepalive:false,



                    // Open Chrome Browser
                    open:{
                        target:"http://localhost:<%= connect.server.options.port%>/index.html",
                        // for windows:
                        //     remeber to create a short cut
                        //         [   C:\Windows\System32\Chrome  ]
                        //     and pont it to the read chrome.exe files
                        appName:"Chrome"
                    }
                }
            }
        },
        // develop
        //develop:{
        //    server:{
        //        file:"app/backend/server.js"
        //    }
        //},
        // Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),
        // Directory Metadata.
        meta: {
            basePath: './',
            srcPath: './',
            bgPath: 'app/backend',
            deployPath: 'app/deploy'
        },
        //clean
        clean:["<%= meta.deployPath %>"],
        // Task Configuration.
        concat: {
            options: {
                stripBanners: true,
                process:true,
                banner: '/* <%= pkg.name %>\n'+
                        ' * v<%= pkg.version %>\n' +
                        ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        ' * Copyright (c) <%= grunt.template.today("yyyy") %>\n'+
                        ' */\n'
            },
            dist: {
                files:{
                    '<%= meta.deployPath %>/app.js':['<%= meta.srcPath %>/**/*.js']
                }
            }
        },
        // jshint
        jshint: {
            all: ['<%= meta.srcPath %>/main/**/*.js','<%= meta.srcPath %>/components/**/*.js']
        },
        /**
         * watch for file changes
         *
         * @link https://github.com/gruntjs/grunt-contrib-watch
         */
        watch:{
           /**
            * install this chrome extension will release you from keep refreshing
            *
            * @link https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
            */
            files:['<%= meta.srcPath %>/**/*.js', '<%= meta.srcPath %>/**/*.html'],
            options: {
                livereload: true,
                nospawn: true,
                interrupt: true,
                debounceDelay: 250
            },
            srcScripts:{
                files:['<%= meta.srcPath %>/**/*.js'],
                tasks:['jshint']
            },
            bgScripts:{
                files:['<%= meta.bgPath %>/**/*.js'],
                tasks:['develop'],
                options: {
                }
            },
            html:{
                files:['app/**/*.html','app/main/**/*.tpl.html'],
                tasks:['html2js']
            },
            grunt: {
                files:['Gruntfile.js']
            },
            css: {
                files: ['app/css/*.css'],
                tasks: []
              }
        },
        /*
        auto deploy to VM server when watch task detects changes to files.

        */
        'sftp-deploy': {
          build: {
            auth: {
              host: '10.239.21.92',
              port: 22,
              authKey: 'key1'
            },
            src: 'C:/Users/hejuntan/Projects/ilabnewui-code',
            dest: '~/PhpstormProjects/ilabnewui-code',
            exclusions: ['C:/Users/hejuntan/Projects/ilabnewui-code/**/.DS_Store', 'C:/Users/hejuntan/Projects/ilabnewui-code/node_modules', 'dist/tmp'],
            server_sep: '/'
          }
        },
        /*
          This plugin converts a group of templates to JavaScript and assembles them into an Angular module that primes the cache directly when the module is loaded.
          You can concatenate this module with your main application code so that Angular does not need to make any additional server requests to initialize the application.
          Note that this plugin does not compile the templates. It simply caches the template source code.
        */
        html2js: {
            options: {
              /*custom options*/
              //remame modual identifier for the template
              rename: function(tplname){
                return tplname.replace('../app/main/user/', '');
              }

            },
            main: {
              src: ['app/main/**/*.tpl.html'],
              dest: 'app/main/tmp/templates.js'
            },
        },
        /**
         * Source line of codes plugin
         *
         * @link https://github.com/rhiokim/grunt-sloc
         */
        sloc: {
            'app':{
                files:{
                    "app":[
                        "components/**/*.js",
                        "css/iconfont.css",
                        "css/li.css",
                        "css/loading-bar.css",
                        "css/site.css",
                        "css/tooltip.css",
                        "main/user/**/*.js",
                        "main/user/app.js",
                        "main/**/*.html",
                        "main/**/*.css"
                    ]
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    //    grunt.loadNpmTasks('grunt-contrib-concat');
    //    grunt.loadNpmTasks('grunt-contrib-jshint');
    //    grunt.loadNpmTasks('grunt-contrib-watch');
    //    grunt.loadNpmTasks('grunt-contrib-clean');
    //    grunt.loadNpmTasks('grunt-contrib-connect');
    //    grunt.loadNpmTasks('grunt-open');
    //    grunt.loadNpmTasks('grunt-beep');
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // cleanup task
    grunt.registerTask('build.app.js', ['clean','jshint','concat','beep:error']);

    grunt.registerTask('default',["connect","watch"]);

    grunt.registerTask('serve',['html2js','connect','watch']);
};

