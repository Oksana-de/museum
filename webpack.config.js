/* eslint-disable no-undef */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const tourPages = 6;

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

console.log('isDev:', isDev, 'isProd:', isProd);

const bableOptions = preset => {
    const options = {
        presets: [
            '@babel/preset-env'
        ]
    };
    
    if (preset) {
        options.presets.push(preset);
    }

    return options;
};

const plugins = () => {
    const base = [
        new HtmlWebpackPlugin({
            title: 'museum',
            filename: 'index.html',
            favicon: './assets/ico/favicon.ico',
            template: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        new CopyWebpackPlugin({
            patterns: [          
                {
                    from: path.resolve(__dirname, './src/assets/img/gallery'),
                    to: path.resolve(__dirname, 'dist/assets/img/gallery')
                }
            ]
        })
    ];

    for (let i = 1; i <= tourPages; i++) {
        base.push(
            new HtmlWebpackPlugin({
                filename: `tours/tour${i}.html`,
                favicon: './assets/ico/favicon.ico',
                template: `./tours/tour${i}.html`
            })
        )
    }

    if (isProd) {
        base.push(new BundleAnalyzerPlugin());
    }

    return base;
}

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: './index.ts',
        analytics: './analytics.ts'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        assetModuleFilename: '[path][name][ext]'
    },    
    // resolve: {
    //     extensions: ['.tsx', '.ts', '.js'],
    // },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    // devtool: isDev ? 'source-map' : '',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'src')
        },
        port: 4200,
        compress: true
    },
    plugins: plugins(),
    module: {
        rules: [                        
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }, 
            {
                test: /\.html$/i,
                loader: 'html-loader' 
            },           
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: bableOptions()
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: bableOptions('@babel/preset-typescript')
                }
            }
        ]
    }
}