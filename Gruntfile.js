module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        apidoc: {
            serverapi: {
                src: "./server/",
                dest: "./docs/"
            }
        },
        jsbeautifier: {
            files: ["server/**/*.js",
                "server/**/*.json",
                "!node_modules/**",
                "!server/**/vendor/**",
                "client/**/*.js"
            ],
            options: {
                js: {
                    breakChainedMethods: true,
                    indentChar: " ",
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    maxPreserveNewlines: 2,
                    preserveNewlines: true,
                    endWithNewline: true
                }
            }
        },
        uglify: {
            adminpanel: {
                options: {
					sourceMap:true,
                    banner: "/*! <%= pkg.name %> - v<%= pkg.version %>*/",
                    mangle: true,
                    beautify: {
                        max_line_len: 32000,
                        quote_keys: false,
                        screw_ie8: true,
                        bracketize: false,
                        comments: false,
                        semicolons: true
                    }
                },
                files: [{
                    expand: true,
                    cwd: "server/static/scripts/pi-hole",
                    src: ["**/*.js",
                        "!**/*.min.js"
                    ],
                    dest: "server/static/scripts/pi-hole",
                    ext: ".min.js"
                }, {
					src:"./client/js/components/*.js",
					dest:"server/static/scripts/pi-hole/components.min.js"
                },{
					src:"./client/js/services/*.js",
					dest:"server/static/scripts/pi-hole/services.min.js"
                }, {
                    expand: true,
                    cwd: "./client/js",
                    src: ["**/*.js",
                        "!**/*.min.js",
                        "!components/**/*"
                    ],
                    dest: "server/static/scripts/pi-hole",
                    ext: ".min.js"
                }]
            }
        },
        pug: {
            compile: {
                options: {
                    data: {
                        debug: false
                    }
                },
                files: [{
                    expand: true,
                    cwd: "./client/pug/",
                    src: ["**/*.pug", "!**/includes/**"],
                    dest: "./server/static",
                    ext: ".html"
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-apidoc");
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-pug");

    grunt.registerTask("default", ["apidoc", "jsbeautifier", "uglify", "pug"]);

};
