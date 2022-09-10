const express = require('express')
const { model } = require('mongoose')
const planetRouter= require('./Planet')
const v1Router = express.Router()

v1Router.use('/planet', planetRouter)

module.exports = v1Router