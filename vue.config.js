module.exports = {
  transpileDependencies: ["vuetify"],
  chainWebpack: (config) => {
    config.plugin("copy").tap(([options]) => {
      options[0].ignore.push("data/**/*");
      return [options];
    });
  },
};
