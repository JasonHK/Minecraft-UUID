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
                Path.resolve(DIRECTORY_SOURCE_MAIN ,"./index.ts"),
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
            new Webpack.DefinePlugin(
                {
                    "process.env.NODE_ENV": JSON.stringify("production"),
                }),
            new CopyWebpackPlugin(
                [
                    { from: "src/index.html", to: "index.html" },
                    { from: "assets/manifest.json", to: "." },
                    { from: "assets/icons/favicon.ico", to: "." },
                    {
                        from: "assets/icons/",
                        to: "icons",
                        ignore: ["*.svg", "favicon.ico"],
                    },
                    { from: "assets/masks/safari.svg", to: "icons" },
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

    return configuration;
}

(env, argv) => {
    const isProduction = (argv.mode === "production");

    const config = {
        entry: {
            "main":  Path.resolve(__dirname, "src/App.tsx"),
            "theme": Path.resolve(__dirname, "src/theme/theme.scss"),
        },
        output: {
            chunkFilename: "[name].[id].js",
            filename:      "[name].js",
            path:          Path.resolve(__dirname, "dist"),
        },
        module: {
            rules: [{
                test:    /.tsx?$/,
                exclude: /node_modules/,
                loader:  "ts-loader"
            }, {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ]
            }, {
                test: /\.(eot|svg|ttf|woff(2)?)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name:       "[name].[ext]",
                        outputPath: "fonts/"
                    }
                }]
            }]
        },
        resolve: {
            extensions: [ ".ts", ".tsx", ".js" ]
        },
        plugins: [
            new CopyWebpackPlugin([
                { from: "src/index.html", to: "index.html" },
                { from: "src/worker.js", to: "." },
                { from: "res/logo/favicon.ico", to: "." },
                { from: "res/icon", to: "icon" },
                { from: "res/social", to: "social" },
            ]),
            //new HTMLWebpackPlugin({
            //    template:      "!!handlebars-loader!src/index.hbs",
            //    excludeChunks: ["theme"],
            //    inject:        false,
            //    title:         "What's my Minecraft UUID?"
            //}),
            new MiniCssExtractPlugin({
                chunkFilename: "[id].css",
                filename:      "[name].css",
            }),
            new WebpackPWAManifest({
                filename:         "manifest.json",
                fingerprints:     false,
                inject:           false,
                name:             "What's my Minecraft UUID?",
                short_name:       "Minecraft UUID",
                description:      "Check the UUID of your Minecraft username with a click of a button!",
                display:          "standalone",
                theme_color:      "#16222A",
                background_color: "#16222A",
                orientation:      "any",
                icons: [{
                    src:         Path.resolve("res/logo/favicon-16.png"),
                    size:        16,
                    destination: Path.join("icon"),
                }, {
                    src:         Path.resolve("res/logo/favicon-32.png"),
                    size:        32,
                    destination: Path.join("icon"),
                }, {
                    src:         Path.resolve("res/logo/logo-192.png"),
                    size:        192,
                    destination: Path.join("icon"),
                }, {
                    src:         Path.resolve("res/logo/logo-512.png"),
                    size:        512,
                    destination: Path.join("icon"),
                }],
            })
        ],
        watch: false,
        devtool: "",
        devServer: {
            contentBase: Path.resolve(__dirname, "dist"),
            host: "0.0.0.0",
            inline: true,
            port: 8080
        }
    }

    if (!isProduction) {
        config.module.rules.push({ 
            enforce: "pre", 
            test:    /\.js$/, 
            loader:  "source-map-loader" 
        });

        config.plugins.push(new WebpackBundleAnalyzer.BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false
        }));

        config.devtool = "source-map";
    } else if (isProduction) {
        config.plugins.push(new WebpackBundleAnalyzer.BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false
        }));
    }

    return config;
};
