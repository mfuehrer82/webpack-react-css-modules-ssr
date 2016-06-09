const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const isProdEnv = process.env.NODE_ENV === 'production';

const distPath = path.resolve('./dist');
const jsInputPath = path.resolve('./src/scripts/server.js');
const jsOutputPath = path.resolve('./dist/server/app.js');
const cssOutputPath = path.relative(
    path.dirname(jsOutputPath),
    './dist/client/styles/app.css'
);

// Modules to exclude
const nodeModules = {};
fs.readdirSync('node_modules')
    .filter((x) => ['.bin'].indexOf(x) === -1)
    .forEach((mod) => {
        nodeModules[mod] = 'commonjs ' + mod;
    });

// Webpack plugins
const plugins = [
    // Extract CSS modules
    new ExtractTextPlugin(cssOutputPath)
];

// PostCSS plugins configuration
const postcssNext = require('postcss-cssnext');
const postcssNano = require('cssnano');
const postcssImport = require('postcss-import');
const postcssCustomProperties = require('postcss-custom-properties');
let cssModulesIdentName = '[path][name]---[local]---[hash:base64:5]';

// Configure production
if (isProdEnv) {
    // Set css modules naming
    cssModulesIdentName = '[hash:base64:4]';
}

// Webpack file loaders
const loaders = [
    {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
    },
    {
        test: /\.css$/,
        exclude: distPath,
        loader: ExtractTextPlugin.extract(
            'style-loader',
            [
                'css-loader',
                '?modules',
                '&sourceMap',
                '&importLoaders=1',
                `&localIdentName=${cssModulesIdentName}`,
                '&context=./src/styles!postcss-loader'
            ].join('')
        )
    }
];

// Export the webpack configuration
module.exports = {
    entry: jsInputPath,
    target: 'node',
    externals: nodeModules,
    module: {
        loaders
    },
    output: {
        filename: path.basename(jsOutputPath),
        path: path.dirname(jsOutputPath)
    },
    resolve: {
        modulesDirectories: [
            'node_modules'
        ]
    },
    postcss: function (webpack) {
        const postcssPlugins = [
            postcssNext({
                browsers: [
                    'last 2 versions',
                    'not IE < 10'
                ],
                features: {
                    customProperties: false
                }
            }),
            require('postcss-extend'),
            require('postcss-strip-units'),
            postcssImport({
                addDependencyTo: webpack
            }),
            postcssCustomProperties({
                variables: {} // Pass variables to CSS :root
            })
        ];

        // Compress CSS output
        if (isProdEnv) {
            postcssPlugins.push(postcssNano({
                autoprefixer: false
            }));
        }

        return postcssPlugins;
    },
    plugins
};
