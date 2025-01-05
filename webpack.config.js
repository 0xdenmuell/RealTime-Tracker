// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const isProduction = process.env.NODE_ENV == 'production';


const config = {
    entry: './src/ui.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: "/"
    },
    devServer: {
        host: '0.0.0.0',  // Dies stellt sicher, dass die App von außen zugänglich ist
        port: 3000,
        hot: true,
        open: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),

        //todo fix favicon with docker
        //new FaviconsWebpackPlugin('./src/favicon.ico'),
    ],
    module: {
        rules: [
            {
                test: /\.json$/,
                loader: 'json-loader',  // JSON-Dateien laden
                type: 'javascript/auto',
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]',
                            outputPath: 'assets/',  // oder ein beliebiger Ordner
                        },
                    },
                ],
            },
        ],
    },
    resolve:{
        fallback: {
            crypto: require.resolve("crypto-browserify"),
            vm: require.resolve("vm-browserify"),
            fs: false,
        }
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
    } else {
        config.mode = 'development';
    }
    return config;
};