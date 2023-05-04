module.exports = {
  webpack(config, options) {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300
    };
    config.module.rules.push({
      loader: '@svgr/webpack',
      issuer: /\.[jt]sx?$/,
      options: {
        prettier: true,
        svgo: true,
        svgoConfig: {
          plugins: [{
            name: 'preset-default',
            params: {
              override: {
                removeViewBox: false
              }
            }
          }]
        },
        titleProp: true
      },
      test: /\.svg$/
    });

    return config;
  }
};
