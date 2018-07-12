/**
 * File:gruntfile.js
 * Youth is just a section of unoptimized code!
 * -------------------------------------------------------------------------
 * Created by BigQ on 2018/4/26.
 *--------------------------------------------------------------------------
 */
module.exports = function (grunt) {
    //初始化grunt 配置
    grunt.initConfig({
        //获取package.json的信息
        pkg: grunt.file.readJSON('package.json'),
         //压缩css
         cssmin:{
         options:{
         stripBanners:true, //合并时允许输出头部信息
          banner:'/**\n *<%= pkg.name %> <%= pkg.version %>\n* Created by BigQ on <%=grunt.template.today("yyyy-mm-dd") %>\n* Youth is just a section of unoptimized code!\n */'
         },
         build:{
         src:'src/css/bc.grid.css',//压缩
         dest:'dist/css/bc.grid-<%= pkg.version %>.min.css' //dest 是目的地输出
         }
         },
        //压缩js
        uglify: {
            options: {
                stripBanners: true, //合并时允许输出头部信息
                banner: '/**\n* <%= pkg.name %> <%= pkg.version %>\n* Created by BigQ on <%=grunt.template.today("yyyy-mm-dd") %>\n* Youth is just a section of unoptimized code!\n*/',
                mangle: true,
                output: {comments: false, ascii_only: true,max_line_len:5000}

            },
            build: {
                src: 'src/bc.grid.js',//压缩
                dest: 'dist/bc.grid.min.js' //dest 是目的地输出
            }

        },
      /*  jshint: {
            options: {
                jshintrc: '.jshint'
            },
            build: ['src/bc.grid.js']
        },*/
        /*
         csslint:{
         options:{
         csslintrc:'.csslint'
         },
         build:['src/css/!*.css']

         },*/
        //watch自动化
        watch: {
         build: {
         files: ['src/bc.grid.js'],
         tasks: ['uglify'],
         options: {spawn: false}
         }
         }

    });
    //告诉grunt我们将使用插件
   // grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
   // grunt.loadNpmTasks('grunt-contrib-jshint');
//    grunt.loadNpmTasks('grunt-contrib-csslint');
       grunt.loadNpmTasks('grunt-contrib-watch');
    //告诉grunt当我们在终端输入grunt时需要做些什么
    grunt.registerInitTask('default', ['cssmin:build','uglify:build']);//先进行语法检查，如果没有问题，再合并，再压缩
};