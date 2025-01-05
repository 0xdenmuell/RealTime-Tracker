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
        publicPath: isProduction ? '/RealTime-Tracker/' : '/', // Dynamisch je nach Umgebung
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

        new FaviconsWebpackPlugin(path.resolve(__dirname, 'public/assets/favicon.ico')),
    ],
    module: {
        rules: [
            {
                test: /\.json$/,
                use: 'json-loader',
                type: 'javascript/auto',
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource', // Nutze den asset module
                generator: {
                    filename: 'public/assets/[name].[hash][ext]', // Oder ein anderer Ordner
                },
            }
        ],
    },
    resolve:{
        fallback: {
            crypto: require.resolve("crypto-browserify"),
            vm: require.resolve("vm-browserify"),
            stream: require.resolve("stream-browserify"),
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