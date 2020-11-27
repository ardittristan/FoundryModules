const webpack = require("webpack");
const jsonImporter = require("node-sass-json-importer");
const options = require("./data/options.json");

module.exports = {
  transpileDependencies: ["vuetify"],

  publicPath: process.env.NODE_ENV === "production" ? options.publicPath : "/",

  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.plugin("ignore").use(webpack.IgnorePlugin, [/(data\/modules\.json)/]);

      config.module
        .rule("vue")
        .use("vuetify-loader")
        .loader("vuetify-loader");
    }

    config.plugin("html").tap((args) => {
      args[0].title = options.title;
      return args;
    });
  },

  css: {
    loaderOptions: {
      css: {
        importLoaders: 3,
      },
      scss: {
        sassOptions: {
          importer: jsonImporter(),
        },
      },
    },
  },
};
