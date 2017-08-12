module.exports = function (config) {
    config.set({
        frameworks: ["mocha", "chai", "sinon"],
        files: [
            { pattern: "src/**/*.spec.ts" }, // *.tsx for React Jsx 
        ],
        preprocessors: {
            "**/*.ts": ["karma-typescript"], // *.tsx for React Jsx 
        },
        reporters: ["progress", "karma-typescript"],
        browsers: ["Chrome"]
    });
};