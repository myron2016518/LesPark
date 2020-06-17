'use strict'
process.env.NODE_ENV = 'production'
const rm = require('rimraf')
const path = require('path')
const config = require('../config')

rm(path.resolve(__dirname,'../',config.dist || './dist'), err => {
  if (err) throw err
})
rm(path.resolve(__dirname,'../',config.htmlDist || './dist'), err => {
  if (err) throw err
})
