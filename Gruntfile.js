/*jslint node: true */
"use strict";


module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bower: {
      dev: {
        dest: 'public/libs/',
        css_dest: 'public/libs/styles',
        js_dest: 'public/libs/js',
        fonts_dest: 'public/libs/fonts',
        less_dest: 'public/libs/less',
        options: {
          keepExpandedHierarchy: false,
          expand: false
        }
      }
    },
    apidoc: {
          mypp: {
              src: "app/Http/Controllers",
              dest: "public/docs",
              options: {
                  // debug: true,
                  includeFilters: [".*\\.php$"],
                  excludeFilters: ["node_modules/"]
              }
          }
      },

    uglify: {
      dist: {
        files: {
          'public/dist/app.js': ['public/dist/app.js']
        },
        options: {
          mangle: false
        }
      }
    },

    html2js: {
      dist: {
        src: ['public/app/partials/**/*.html'],
        dest: 'tmp/partials.js'
      }
    },

    clean: {
      temp: {
        src: ['tmp']
      },
      libs: {
        src: ['public/libs']
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/app/**/*.js', 'tmp/*.js'],
        dest: 'public/dist/app.js'
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'public/app/*.js', 'public/app/**/*.js']
    },

    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 8082
        }
      }
    },

    watch: {
      dev: {
        files: ['Gruntfile.js', 'public/app/**/*.js', '**/*.html',
          'resources/assets/sass/**/*.scss'
        ],
        tasks: ['html2js:dist', 'sass', 'concat:dist',
          'bower:dev'
        ],
        options: {
          atBegin: true,
          livereload: true
        }
      },
      docs: {
            files: ['Gruntfile.js', 'app/Http/Controllers/*.php'],
            tasks: ['apidoc'],
            options: {
                atBegin: true,
                livereload: true
            }
        },
      min: {
        files: ['Gruntfile.js', 'public/app/*.js', '*.html'],
        tasks: ['jshint', 'karma:unit', 'html2js:dist', 'concat:dist',
          'clean:temp', 'uglify:dist'
        ],
        options: {
          atBegin: true
        }
      }
    },
    jsdoc: {
      dist: {
        src: ['public/app/**/*.js'],
        options: {
          destination: 'public/build/docs/client',
          configure: './node_modules/angular-jsdoc/common/conf.json',
          template: './node_modules/angular-jsdoc/astro',
          readme: 'README.md'
        }
      }
    },
    compress: {
      dist: {
        options: {
          archive: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
        },
        files: [{
          src: ['index.html'],
          dest: '/'
        }, {
          src: ['dist/**'],
          dest: 'dist/'
        }, {
          src: ['assets/**'],
          dest: 'assets/'
        }, {
          src: ['libs/**'],
          dest: 'libs/'
        }]
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'resources/assets/sass',
          src: ['*.scss'],
          dest: 'public/dist/',
          ext: '.css'
        }]
      }
    },
    reload: {
      proxy: {
        host: 'localhost',
      }
    },
    karma: {
      options: {
        configFile: 'config/karma.conf.js'
      },
      unit: {
        singleRun: true
      },

      continuous: {
        singleRun: false,
        autoWatch: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-reload');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-apidoc');
  grunt.registerTask('api-docs', ['watch:docs']);
  grunt.registerTask('dev', ['connect:server', 'watch:dev']);
  grunt.registerTask('docs', ['watch:docs']);
  grunt.registerTask('test', ['bower', 'jshint', 'karma:continuous']);
  grunt.registerTask('minified', ['bower', 'connect:server', 'watch:min']);
  grunt.registerTask('package', ['bower', 'html2js:dist', 'concat:dist',
    'uglify:dist',
    'clean:temp', 'compress:dist'
  ]);
};
