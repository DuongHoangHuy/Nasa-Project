const express = require('express')
const launchesRouter = express.Router()

launchesRouter.get('/launches', httpGetAllLaunches)
launchesRouter.post('/launches', httpAddNewLaunch)
launchesRouter.delete('/launches/:id', httpDeleteLaunch)
module.exports = launchesRouter