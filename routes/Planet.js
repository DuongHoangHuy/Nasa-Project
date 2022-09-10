const express = require('express')
const planetRouter = express.Router()

const {getAllPlanets} = require('../controllers/Planet')

planetRouter.get('/', getAllPlanets)

module.exports = planetRouter