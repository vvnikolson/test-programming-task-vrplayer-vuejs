const merge = require('webpack-merge')
const config = require('./webpack.common.js')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//const PurgecssPlugin =  require('purgecss-webpack-plugin')
const glob = require('glob-all')
module.exports = merge(config, {
    mode: "production",
    output:
        {
            path: path.join(__dirname, '..', 'rs-nov-test-task.backend', 'src', 'main', 'resources', 'static'),
            filename: "assets/js/[name].js"
        },
    plugins: [
        new TerserPlugin({
            terserOptions: {
                parse: {
                    ecma: 8
                },
                compress: {
                    ecma       : 5,
                    warnings   : false,
                    comparisons: false,
                    inline     : 2
                },
                mangle: {
                    safari10: true
                },
                output: {
                    ecma      : 5,
                    comments  : false,
                    ascii_only: true
                }
            },
            cache: true,
            parallel: true,
            sourceMap: false,
        }),
/*           new PurgecssPlugin({
            paths: glob.sync([
                path.join(__dirname, './src/!**!/!*.vue'),
                path.join(__dirname, './src/!**!/!*.js'),
            ])
        }),*/
        new OptimizeCssAssetsPlugin({})

    ]
})
