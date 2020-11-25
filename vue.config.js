const webpack = require("webpack");

module.exports = {
  transpileDependencies: ["vuetify"],

  publicPath: process.env.NODE_ENV === "production" ? "/FoundryModules/" : "/",

  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.plugin("ignore").use(webpack.IgnorePlugin, [/(data\/modules\.json)/]);

      config.module
        .rule("vue")
        .use("vuetify-loader")
        .loader("vuetify-loader");
    }

    config.plugin("html").tap((args) => {
      args[0].title = "Ardittristan's Foundry Modules";
      return args;
    });
  },
};
