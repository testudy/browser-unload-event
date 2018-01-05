const path = require('path');
const _ = require('lodash');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


const config = {
    entry: './src/index.js',
    output: {
        filename: 'browser-unload-event.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'browserUnload',
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /(?:src|test)\/.*\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    //useEslintrc: false,
                },
            },
            {
                test: /(?:src|test)\/.*\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'stage-2']
                    }
                }
            },
        ],
    },
};

module.exports = function (environment, options) {
    if (environment.development) {
        return _.defaultsDeep({ }, config);
    }
    return [
        _.defaultsDeep({ }, config),
        _.defaultsDeep({
            output: {
                filename: 'browser-unload-event.min.js',
            },
            plugins: [
                new UglifyJSPlugin({
                    sourceMap: true,
                }),
            ],
        }, config),
    ];
};
