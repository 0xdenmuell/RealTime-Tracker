// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const isProduction = process.env.NODE_ENV == 'production';


const config = {
    entry: './src/ui.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
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
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '/[name].[ext]'
                },
            }
        ],
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