"use strict"

const config = require('./config')

//set to express or koa
const app = require('./' + config.framework) 

module.exports = app
