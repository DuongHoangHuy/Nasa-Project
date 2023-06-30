require('dotenv').config()
const http = require('http')
const app = require('./app')
const mongoDB = require('./services/connect_mongo')
const {loadPlanetsData} = require('./data/PlanetData')
const {loadLaunchesData} = require('./controllers/Launch')
const PORT = process.env.PORT || 8080 

const server = http.createServer(app)

const startServer = async ()=>{
    try {
        await mongoDB.connectMongoDB()
        await loadPlanetsData()
        await loadLaunchesData()
        server.listen(PORT, ()=>{
            console.log(`Listening at port ${PORT}`)
        })
    } catch(err){
        console.log(`Cannot start server with error: ${err}`)
    }
}

startServer()

// network related configuration