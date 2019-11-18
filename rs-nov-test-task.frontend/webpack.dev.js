const merge = require('webpack-merge')
const config = require('./webpack.common.js')
const path = require('path')

module.exports = merge(config, {
    mode: "development",
    devtool: "source-map",
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8000,
        allowedHosts: [
            "localhost:8080",
            "localhost:80"
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'assets/js/[name].js'
    }

})