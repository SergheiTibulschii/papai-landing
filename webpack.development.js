const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/js/app.js',
    output: {
        path: path.resolve(__dirname, './tmp/assets/js/'),
        filename: 'bundle.js',
        publicPath: '/assets/js/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    compact: true,
                },
            },
            {
                test: /\.(txt|glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: ['raw-loader'],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            ASSETS_PATH: JSON.stringify(process.env.ASSETS_PATH || '/assets'),
        }),
    ],
    mode: 'development',
    devtool: 'eval-source-map',
};
