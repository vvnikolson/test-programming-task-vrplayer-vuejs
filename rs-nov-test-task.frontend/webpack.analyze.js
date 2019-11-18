const merge = require('webpack-merge')
const config = require('./webpack.common.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path')

module.exports = merge(config, {
    mode: "development",
    output:
        {
            path: path.join(__dirname, '/dist'),
            filename: "[name].js"
        },
    plugins: [
        new BundleAnalyzerPlugin()
    ]
})