const analyze = require('rollup-plugin-analyzer');

module.exports = {
  rollup(config, options) {
    config.plugins.push(analyze());
    return config;
  },
};