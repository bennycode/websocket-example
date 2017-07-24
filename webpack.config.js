const webpack = require('webpack');

module.exports = {
  entry: {
    filename: `${__dirname}/node_modules/@wireapp/queue-priority/dist/commonjs/index.js`
  },
  output: {
    filename: `priority-queue-bundle.js`,
    library: 'PriorityQueueModule',
    path: `${__dirname}/src/main/public`
  },
  target: 'web'
};
