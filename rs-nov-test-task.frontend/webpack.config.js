const path = require("path")
const glob = require('glob')
const VueLoaderPlugin = require("vue-loader/lib/plugin")
MiniCssExtractPlugin = require("mini-css-extract-plugin")


module.exports = {
    mode: "development",
    context: __dirname,
    devtool: "source-map",
    entry: {
        main:[
            path.join(__dirname, "src", "main.js"),
            path.join(__dirname, "src", "styles", "main.sass")
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: "/",
        filename: "[name].js"
    },
    devServer: {
        contentBase: "./",
        compress: true,
        port: 8000,
        allowedHosts: [
            "localhost:8080"
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    "css-loader",
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                indentedSyntax: true
                            },
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })
/*        new PurgecssPlugin({
            paths: glob.sync(`${path.join(__dirname, 'src')}/!**!/!*`,  { nodir: true }),
        })*/
    ],
    resolve: {
        modules: [
            path.join(__dirname, "src"),
            path.join(__dirname, 'src', 'styles'),
            path.join(__dirname, "node_modules")
        ]
    }
}