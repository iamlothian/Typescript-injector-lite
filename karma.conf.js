module.exports = function(config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],

        coverageReporter: {
            instrumenterOptions: {
                istanbul: { noCompact: true }
            }
        },

        karmaTypescriptConfig: {
            compilerOptions:{
                "compileOnSave": true,
                "compilerOptions": {
                  "outDir": "dist",
                  "sourceMap": true,
                  "declaration": true,
                  "module": "commonjs",
                  "target": "ES5",
                  "experimentalDecorators": true,
                  "emitDecoratorMetadata":true,
                  "types": ["reflect-metadata"]
                },
                "include": [
                  "src/**/*"
                ],
                "exclude": [
                  "node_modules",
                  "dist"
                ]
              }
        },

        files: [
            { pattern: "./src/**/*.ts" },
            { pattern: "./tests/**/*.ts" },
        ],
        preprocessors: {
            "./src/**/*.ts": ["karma-typescript", "coverage"],
            "./tests/**/*.ts": ["karma-typescript"],
        },
        reporters: ["progress", "karma-typescript", "coverage"],
        browsers: ["Chrome"]
        
    });
};