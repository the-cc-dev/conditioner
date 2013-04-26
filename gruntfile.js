module.exports = function(grunt) {

    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        path:{
            src:'src',
            spec:'spec',
            demo:'demo',
            conditioner:'<%= path.src %>/conditioner',
            wrapper:'<%= path.src %>/wrapper',
            tests:'<%= path.src %>/tests'
        },
        meta: {
            banner: '// <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n' +
                    '// Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.homepage %>\n' +
                    '// License: <%= _.map(pkg.licenses, function(x) {return x.type + " (" + x.url + ")";}).join(", ") %>\n'
        },
        jsdoc:{
            dist:{
                src:[
                    '<%= concat.dist.dest %>',
                    '<%= path.src %>/tests/*.js'
                ],
                options: {
                    destination: 'docs'
                }
            }
        },
        jasmine:{
            src:[
                '<%= path.conditioner %>/mergeObjects.js',
                '<%= path.conditioner %>/matchesSelector.js',
                '<%= path.conditioner %>/Observer.js',
                '<%= path.conditioner %>/Module.js',
                '<%= path.conditioner %>/Test.js',
                '<%= path.conditioner %>/ModuleRegister.js',
                '<%= path.conditioner %>/ConditionsManager.js',
                '<%= path.conditioner %>/ModuleController.js',
                '<%= path.conditioner %>/Node.js',
                '<%= path.conditioner %>/Conditioner.js',
            ],
            options:{
                specs:'<%= path.spec %>/*.js',
                helpers:'<%= path.spec %>/lib/require.js'
            }
        },
        concat:{
            options: {
                banner:'<%= meta.banner %>'
            },
            dist:{
                src:[
                    '<%= meta.banner %>',
                    '<%= path.wrapper %>/intro.js',

                    '<%= path.conditioner %>/Utils.js',
                    '<%= path.conditioner %>/Observer.js',

                    '<%= path.conditioner %>/ModuleBase.js',
                    '<%= path.conditioner %>/TestBase.js',
                    '<%= path.conditioner %>/ModuleRegister.js',
                    '<%= path.conditioner %>/ExpressionBase.js',
                    '<%= path.conditioner %>/UnaryExpression.js',
                    '<%= path.conditioner %>/BinaryExpression.js',
                    '<%= path.conditioner %>/ConditionsManager.js',
                    '<%= path.conditioner %>/ModuleController.js',
                    '<%= path.conditioner %>/Node.js',
                    '<%= path.conditioner %>/Conditioner.js',

                    '<%= path.wrapper %>/outro.js'
                ],
                dest:'dist/<%= pkg.name %>.js'
            }
        },
        copy: {
            tests: {
                expand:true,
                cwd: '<%= path.tests %>',
                src:'*',
                dest:'dist/tests/'
            },
            demo: {
                expand:true,
                cwd: '<%= path.tests %>',
                src:'*',
                dest:'<%= path.demo %>/js/tests/'
            }
        },
        uglify: {
            tests: {
                expand: true,
                src: '*',
                dest: 'dist/tests.min/',
                cwd: '<%= copy.tests.dest %>'
            },
            lib: {
                options: {
                    banner:'<%= meta.banner %>',
                    report:'gzip'
                },
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        requirejs: {
            compile: {
                options: {

                    preserveLicenseComments:false,
                    findNestedDependencies:true,
                    optimize:'none',

                    baseUrl:'<%= path.demo %>/js/',
                    paths:{
                        'Conditioner':'../../dist/conditioner'
                    },

                    name:'lib/jrburke/require',
                    out:'<%= path.demo %>/js.min/built.js',
                    include:[
                        'Conditioner',

                        'tests/connection',
                        'tests/cookies',
                        'tests/element',
                        'tests/media',
                        'tests/pointer',
                        'tests/window',

                        'ui/Clock',
                        'ui/StorageConsentSelect',
                        'security/StorageConsentGuard'
                    ]

                }
            }
        },
        watch: {
            files:['<%= path.src %>/**/*.js','<%= path.spec %>/*.js'],
            tasks:'test'
        }

    });


    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');


    // build everything
    grunt.registerTask('default',['jasmine','concat','copy','uglify','requirejs']);

    // test
    grunt.registerTask('docs',['concat','copy','jsdoc']);

    // test
    grunt.registerTask('test',['jasmine']);

    // task for building the library
    grunt.registerTask('lib',['concat','copy','uglify']);

    // task for optimizing the demo
    grunt.registerTask('demo',['requirejs']);

};