var webpack = require('webpack');

module.exports = {
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        new webpack.IgnorePlugin(/jsdom$/)
    ]
};
