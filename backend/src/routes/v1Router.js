const express = require('express')
const { model } = require('mongoose')
const planetRouter = require('./Planet')
const launchesRouter = require('./Launch')
const v1Router = express.Router()

v1Router.use('/planet', planetRouter)
v1Router.use('/launch', launchesRouter)

module.exports = v1Router