// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';


const config = {
    entry: './src/ui.js',
    output: {
        path: __dirname + '/build',
        filename: "bundle.js"
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'build')
        }
    },
    devtool: "source-map",
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'public/models'), // Quelle
                    to: path.resolve(__dirname, 'build/public/models'),  // Ziel im Build-Ordner
                },
            ],
        }),

        new FaviconsWebpackPlugin(path.resolve(__dirname, './public/assets/favicon.ico')),
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf|ico)$/,
                type: 'asset/resource', // Nutze den asset module
                generator: {
                    filename: './public/assets/[name][ext]', // Oder ein anderer Ordner
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