const server = require('./build/webpack.config.server');
const client = require('./build/webpack.config.client');

module.exports = [
    server,
    client
];
