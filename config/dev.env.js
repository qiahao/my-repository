var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var isTest = process.argv[2] == 'test'
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEV_TEST: isTest
})
