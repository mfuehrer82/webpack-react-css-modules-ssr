const path = require('path');
const webpack = require('webpack');
const pkg = require('./../package.json');

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProdEnv = process.env.NODE_ENV === 'production';

const distPath = path.resolve('./dist/client');
const templatesPath = path.resolve('./src/templates');
const jsInputPath = path.resolve('./src/scripts/client.js');
const jsOutputPath = path.resolve('./dist/client/scripts/app.js');
const cssOutputPath = path.relative(
    path.dirname(jsOutputPath),
    './dist/client/styles/app.css'
);

// Webpack plugins
const plugins = [
    // Hook into watch task and sync browsers
    new BrowserSyncPlugin({
        host: 'localhost',
        port: 3001,
        open: false,
        proxy: 'localhost:3000',
        codeSync: false, // Don't reload as long nodemon and webpack both watch
        files: [distPath, templatesPath]
    }),
    // Create banner for generated files
    new webpack.BannerPlugin(
        `Copyright © Max Mustermann - v${pkg.version}`
    ),
    // Extract CSS modules
    new ExtractTextPlugin(cssOutputPath),
    // Static file copy
    new CopyWebpackPlugin([
        {
            from: path.resolve('./src/root'),
            to: distPath
        }
    ])
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
    // Add script compression
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                sequences: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true,
                drop_console: true
            },
            mangle: {
                except: ['exports', 'require']
            },
            output: {
                comments: false
            }
        }),
        new webpack.optimize.DedupePlugin()
    );
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
    entry: [
        jsInputPath
    ],
    devtool: 'source-map',
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
