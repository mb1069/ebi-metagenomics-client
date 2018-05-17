const webpack = require('webpack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const subfolder = process.env.DEPLOYMENT_SUBFOLDER;
const apiUrl = process.env.API_URL;
const sequenceSearchUrl = process.env.SEQUENCE_SEARCH_URL;

const templateFixtures = {
    subfolder: subfolder,
    apiUrl: apiUrl,
    sequenceSearchUrl: sequenceSearchUrl
};

module.exports = {
    entry: {
        mydata: 'src/js/modules/mydata.js',
        index: 'src/js/modules/index.js',
        search:
            'src/js/modules/search.js',
        healthcheck:
            'src/js/modules/healthcheck.js',
        submit:
            'src/js/modules/submit.js',
        study:
            'src/js/modules/study.js',
        browse:
            'src/js/modules/browse.js',
        sample:
            'src/js/modules/sample.js',
        run:
            'src/js/modules/run.js',
        analysis:
            'src/js/modules/analysis.js',
        compare:
            'src/js/modules/compare.js',
        about:
            'src/js/modules/about.js',
        help:
            'src/js/modules/help.js',
        biomes: 'src/js/modules/biomes.js',
        pipelines:
            'src/js/modules/pipelines.js',
        pipeline:
            'src/js/modules/pipeline.js'
    },
    plugins: [
        new HardSourceWebpackPlugin({
            // Either an absolute path or relative to webpack's options.context.
            cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
            configHash: function(webpackConfig) {
                // node-object-hash on npm can be used to build this.
                return require('node-object-hash')({sort: false}).hash(webpackConfig);
            },
            // Either false, a string, an object, or a project hashing function.
            environmentHash: {
                root: process.cwd(),
                directories: [],
                files: ['package-lock.json', 'yarn.lock']
            }
        }),
        new CopyWebpackPlugin([
            {from: 'static/images', to: '../static/images'},
            {from: 'static/fonts', to: '../static/fonts'},
            {from: 'static/js', to: '../static/js'},
            {from: 'static/krona', to: ''}
        ]),
        new HtmlWebpackPlugin({
            title: 'My data page',
            inject: true,
            filename: 'mydata.html',
            template: 'handlebars-loader!./src/mydata.html',
            chunks: ['mydata', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'About page',
            inject: true,
            filename: 'about.html',
            template: 'handlebars-loader!./src/about.html',
            chunks: ['about', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Biomes page',
            inject: true,
            filename: 'biomes.html',
            template: 'handlebars-loader!./src/biomes.html',
            chunks: ['biomes', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Browse page',
            inject: true,
            filename: 'browse.html',
            template: 'handlebars-loader!./src/browse.html',
            chunks: ['browse', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Compare page',
            inject: true,
            filename: 'compare.html',
            template: 'handlebars-loader!./src/compare.html',
            chunks: ['compare', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Healthcheck page',
            inject: true,
            filename: 'healthcheck.html',
            template: 'handlebars-loader!./src/healthcheck.html',
            chunks: ['healthcheck', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Help page',
            inject: true,
            filename: 'help.html',
            template: 'handlebars-loader!./src/help.html',
            chunks: ['help', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Index page',
            inject: true,
            filename: 'index.html',
            template: 'handlebars-loader!./src/index.html',
            chunks: ['index', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Login page',
            inject: true,
            filename: 'login.html',
            template: 'handlebars-loader!./src/login.html',
            chunks: ['login', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Pipeline page',
            inject: true,
            filename: 'pipeline.html',
            template: 'handlebars-loader!./src/pipeline.html',
            chunks: ['pipeline', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Pipelines page',
            inject: true,
            filename: 'pipelines.html',
            template: 'handlebars-loader!./src/pipelines.html',
            chunks: ['pipelines', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Run page',
            inject: true,
            filename: 'run.html',
            template: 'handlebars-loader!./src/run.html',
            chunks: ['run', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Analysis page',
            inject: true,
            filename: 'analysis.html',
            template: 'handlebars-loader!./src/analysis.html',
            chunks: ['analysis', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Sample page',
            inject: true,
            filename: 'sample.html',
            template: 'handlebars-loader!./src/sample.html',
            chunks: ['sample', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Search page',
            inject: true,
            filename: 'search.html',
            template: 'handlebars-loader!./src/search.html',
            chunks: ['search', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Study page',
            inject: true,
            filename: 'study.html',
            template: 'handlebars-loader!./src/study.html',
            chunks: ['study', 'commons'],
            templateData: templateFixtures
        }),
        new HtmlWebpackPlugin({
            title: 'Submit page',
            inject: true,
            filename: 'submit.html',
            template: 'handlebars-loader!./src/submit.html',
            chunks: ['submit', 'commons'],
            templateData: templateFixtures
        }),
        new ScriptExtHtmlWebpackPlugin({
            // Used to ensure map API callback exists
            defer: ['sample.js', 'study.js']
        }),
        new webpack.EnvironmentPlugin([
            'API_URL',
            'SEARCH_URL',
            'INTERPRO_URL',
            'SEQUENCE_SEARCH_URL',
            'ENA_URL',
            'DEPLOYMENT_SUBFOLDER']
        ),
        new CleanWebpackPlugin(['dist']),
        new webpack.ProvidePlugin({
            '$': 'jquery', 'jQuery': 'jquery', 'window.jQuery': 'jquery'
        }),
        new ExtractTextPlugin('[name].css')
    ],
    output: {
        filename: '[name].[hash].js',
        path:
        __dirname + '/dist',
        publicPath: process.env.DEPLOYMENT_SUBFOLDER + '/'
    },
    resolve: {
        modules: [__dirname, 'node_modules'],
        alias: {handlebars: 'handlebars/dist/handlebars.min.js'}
    },
    module: {
        rules: [
            {
                test: /\.(handlebars)$/,
                loader: 'handlebars-loader',
                query: {inlineRequires: '/images/'}
            }, {
                test: /\.(woff|woff2|eot|ttf)$/,
                use: {loader: 'file-loader', options: {name: '[path][name].[hash].[ext]'}}
            }, {
                test: /\.(jpe?g|png|gif|svg|ico)$/,
                loader: 'file-loader',
                options: {name: '[path][name].[ext]', context: ''}
            }]
    },
    node: {
        fs: 'empty'
    }
};
