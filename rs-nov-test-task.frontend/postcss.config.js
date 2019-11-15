module.exports = {
    "plugins": [
        require("autoprefixer"),
        require('postcss-import'),
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
            autoprefixer: {
                flexbox: 'no-2009'
            },
            stage: 3
        }),
        process.env.NODE_ENV === 'production' &&
        require('@fullhuman/postcss-purgecss')({
            content: ['./src/main/resources/static/js/**/*.vue'],
            defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
        }) &&
        require('cssnano')
    ],
}