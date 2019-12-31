"use strict";

import "webpack-dev-server";

import CopyWebpackPlugin from "copy-webpack-plugin";
import FileLoader from "file-loader";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import Path from "path";
import TerserWebpackPlugin from "terser-webpack-plugin";
import TSLoader from "ts-loader";
import Webpack from "webpack";
import WebpackBundleAnalyzer from "webpack-bundle-analyzer";

const DIRECTORY_ROOT: string = Path.resolve(__dirname, "../");

const DIRECTORY_DISTRIBUTION: string = Path.resolve(DIRECTORY_ROOT, "./dist");

const DIRECTORY_SOURCE: string = Path.resolve(DIRECTORY_ROOT, "./src");
const DIRECTORY_SOURCE_MAIN: string = Path.resolve(DIRECTORY_SOURCE, "./main");
const DIRECTORY_SOURCE_WORKER: string = Path.resolve(DIRECTORY_SOURCE, "./worker");

function ConfigurationFactory(env: string | Record<string, string | number | boolean>, argv: Webpack.CliConfigOptions): Webpack.Configuration
{
    const isProduction: boolean = (argv.mode === "production");

    const enableWatch: boolean = false;
    const enableSourceMap: boolean = true;

    const enableBundleAnalyzer: boolean = true;
    const openBundleAnalyzerReport: boolean = null;

    const configuration: Webpack.Configuration = {
        entry: {
            "main": [
                Path.resolve(DIRECTORY_SOURCE_MAIN ,"./App.tsx"),
            ],
        },
        output: {
            path: DIRECTORY_DISTRIBUTION,
            filename: "[name].js",
        },
        resolve: {
            extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx"],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/i,
                    include: [
                        DIRECTORY_SOURCE_MAIN,
                    ],
                    exclude: /node_modules/,
                    loader: "ts-loader",
                    options: {
                        instance: "main",
                        configFile: Path.resolve(DIRECTORY_SOURCE_MAIN, "tsconfig.json"),
                    } as TSLoader.Options,
                },
                {
                    test: /\.tsx?$/i,
                    include: [
                        DIRECTORY_SOURCE_WORKER,
                    ],
                    exclude: /node_modules/,
                    loader: "ts-loader",
                    options: {
                        instance: "worker",
                        configFile: Path.resolve(DIRECTORY_SOURCE_WORKER, "tsconfig.json"),
                    } as TSLoader.Options,
                },
                {
                    test: /\.(c|sa|sc)ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "postcss-loader",
                        "resolve-url-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.(eot|svg|ttf|woff2?)$/i,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "[name].[ext]",
                                outputPath: "fonts/"
                            } as FileLoader.Options,
                        },
                    ],
                }
            ],
        },
        plugins: [
            new CopyWebpackPlugin(
                [
                    { from: "src/index.html", to: "index.html" },
                ]),
            new MiniCssExtractPlugin(
                {
                    filename: "[name].css",
                }),
        ],
        optimization: {
            minimizer: [
                new TerserWebpackPlugin(
                    {
                        test: /\.m?js$/i,
                    }),
            ],
        },
        watch: enableWatch,
        devServer: {
            //host: "0.0.0.0",
            port: 2047,
            contentBase: DIRECTORY_DISTRIBUTION,
            inline: true,
        },
    };

    if (enableBundleAnalyzer)
    {
        configuration.plugins.push(
            new WebpackBundleAnalyzer.BundleAnalyzerPlugin(
                {
                    analyzerMode: "static",
                    openAnalyzer: (typeof openBundleAnalyzerReport === "boolean") ? openBundleAnalyzerReport : isProduction,
                }));
    }

    if (enableSourceMap)
    {
        configuration.module.rules.push(
            {
                enforce: "pre",
                test: /\.js$/i,
                loader: "source-map-loader",
            });

        configuration.devtool = "source-map";
    }

    return configuration;

    return configuration;
}

export = ConfigurationFactory;
