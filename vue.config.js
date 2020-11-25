const webpack = require("webpack");
const FileManagerPlugin = require('filemanager-webpack-plugin');
const path = require('path')

module.exports = {
  transpileDependencies: ["vuetify"],

  publicPath: process.env.NODE_ENV === "production"
    ? "/FoundryModules/dist/"
    : "/",

  chainWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.plugin('ignore')
        .use(webpack.IgnorePlugin, [/(data\/modules\.json)/])

      config.module.rule('vue')
        .use('vuetify-loader')
          .loader('vuetify-loader')
    }

    config.plugin('html')
      .tap(args => {
        args[0].title = "Ardittristan's Foundry Modules";
        return args;
      })
  },

  configureWebpack: {
    plugins: process.env.NODE_ENV === "production"
      ?[
        new FileManagerPlugin({
          onEnd: [
            {
              copy: [
                {
                  source: path.resolve(__dirname, 'dist', 'index.html'),
                  destination: path.resolve(__dirname, 'index.html')
                }
              ]
            }
          ]
        })
      ]
      : []
  }
};
