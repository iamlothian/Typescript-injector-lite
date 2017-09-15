module.exports = function(config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],

        coverageReporter: {
            instrumenterOptions: {
                istanbul: { noCompact: true }
            }
        },

        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.json"
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