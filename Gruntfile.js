module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    sass: {
      compile: {
        files: {
          './dist/www/css/main.css' : ['app/css/main.scss']
        }
      }
    },
    copy:{
      main:{
        files:[
          {expand:true, flatten:true, src:['app/*/*.html'], dest:"./dist/www/html", filter:'isFile'},
          {expand:true, flatten:true, src:['app/lib/*'], dest:"./dist/www/lib"},
          {expand:true, flatten:true, src:['app/*.html', 'server/getgameinfo.php'], dest:"./dist/www/"},
          {expand:true, flatten:true, src:['app/img/*.gif', 'app/img/*.png'], dest:"./dist/www/img"}
        ]
      }
    },
    concat: {
      js: {
        src: 'app/js/**/*.js',
        dest: './dist/www/js/app.js'
      }
    },
    clean:{
      options: { force:true },
      release:["./dist/www"]
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'copy', 'sass', 'concat']);

};