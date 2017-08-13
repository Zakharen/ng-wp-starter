/**
 * The webpack.common.js configuration file does most of the heavy lifting.
 * Create separate, environment-specific configuration files that build on 
 * webpack.common by merging into it the peculiarities particular to the target
 * environments.
 */

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');


/**
 * Polyfills.
 * You'll need polyfills to run an Angular application
 * in most browsers as explained in the Browser Support guide.
 * 
 * Polyfills should be bundled separately from the application and vendor bundles.
 * Add a polyfills.ts like this one to the src/ folder.
 * 
 * Loading polyfills. 
 * Load zone.js early within polyfills.ts,
 * immediately after the other ES6 and metadata shims.
 */


module.exports = {
    // entry—the entry-point files that define the bundles.
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/main.ts'
    },

    // resolve—how to resolve file names when they lack extensions.
    // If Webpack should resolve extension-less files for styles and HTML,
    // add .css and .html to the list.
    resolve: {
        extensions: ['.ts', '.js']
    },

    // module.rules— module is an object with rules for deciding how files are loaded.
    /**
     * - awesome-typescript-loader—a loader to transpile the Typescript code to ES5,
     *      guided by the tsconfig.json file.
     * 
     * - angular2-template-loader—loads angular components' template and styles.
     * 
     * - html-loader—for component templates.
     * 
     * - images/fonts—Images and fonts are bundled as well. 
     * 
     * - CSS—the first pattern matches application-wide styles; the second handles component-scoped styles
     *      (the ones specified in a component's styleUrls metadata property).
     */
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: { configFileName: helpers.root('tsconfig.json') }
                    }, 
                    'angular2-template-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract({ 
                    fallbackLoader: 'style-loader', 
                    loader: 'css-loader?sourceMap' 
                })
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loader: 'raw-loader'
            }
        ]
    },

    // plugins—creates instances of the plugins.
    plugins: [

        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('tsconfig.json'), // location of your src
            {} // a map of your routes
        ),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })        

    ],


};