var webpack = require('webpack');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'postcss-loader'],
            }
        ]
    },
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        new webpack.IgnorePlugin(/jsdom$/)
    ]
};
