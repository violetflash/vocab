const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ESLintPlugin = require('eslint-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if (isProduction) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ];
    }

    return config;
};

const filename = ext => (isDevelopment ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            //     hmr: isDevelopment,
            //     reloadAll: true
            // }
        }, 'css-loader'
    ];

    if (extra) {
        loaders.push(extra);
    }

    return loaders;
};

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProduction
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets/images/favicon.ico'),
                    to: path.resolve(__dirname, 'dist/assets/images/')
                },
                // {
                //     from: path.resolve(__dirname, 'src/assets'),
                //     to: path.resolve(__dirname, 'dist/assets')
                // },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: `css/${filename('css')}`
        }),

    ];

    if (isDevelopment) {
        base.push(new ESLintPlugin());
    }

    if (isProduction) {
        base.push(new BundleAnalyzerPlugin());
    }

    return base;
};

module.exports = {
    target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './js/index.js'],
    },
    output: {
        filename: `js/${filename('js')}`,
        path: path.resolve(__dirname, 'dist/')
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    devServer: {
        contentBase: './dist',
        port: 8888,
        hot: isDevelopment,
        open: true,  // открывать браузер при запуске
        compress: true,  // gzip компрессия
        overlay: true,  // оверлей при ошибках
        writeToDisk: true,  // записывать файлы в папку build
        historyApiFallback: true,  // использование history HTML5
    },
    devtool: isDevelopment && 'source-map',
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(ico|png|jpg|svg|gif)$/,
                // use: ['file-loader']
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            publicPath: '../',
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/i,
                // use: ['file-loader']
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            // publicPath: 'assets/',
                            // outputPath: 'fonts/'
                        },
                    },
                ],
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // loader: jsLoaders()
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }

            },
            // {
            //     test: /\.ts$/,
            //     exclude: /node_modules/,
            //     loader: {
            //         loader: 'babel-loader',
            //         options: babelOptions('@babel/preset-typescript')
            //     }
            // },
            // {
            //     test: /\.jsx$/,
            //     exclude: /node_modules/,
            //     loader: {
            //         loader: 'babel-loader',
            //         options: babelOptions('@babel/preset-react')
            //     }
            // }
        ]
    }
};
