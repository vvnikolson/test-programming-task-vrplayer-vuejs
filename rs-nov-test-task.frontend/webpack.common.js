const path = require("path")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
MiniCssExtractPlugin = require("mini-css-extract-plugin")


module.exports = {
    context: __dirname,
    entry: {
        main:[
            path.join(__dirname, "src", "main.js"),
            path.join(__dirname, "src","styles", "main.scss"),
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
                    MiniCssExtractPlugin.loader,//'vue-style-loader',
                    "css-loader",
                ]
            },
            {
                test: /\.(scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: "assets/css/[name].css"
        })
    ],
    resolve: {
        modules: [
            path.join(__dirname, "src"),
            path.join(__dirname, "node_modules")
        ]
    }
}