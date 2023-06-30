const express = require('express')
const {httpGetAllLaunches, httpAddNewLaunch, httpDeleteLaunch} = require('../controllers/Launch')
const launchesRouter = express.Router()

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpAddNewLaunch)
launchesRouter.delete('/:id', httpDeleteLaunch)
module.exports = launchesRouter