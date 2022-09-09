require('dotenv').config()
const express = require('express')
const app = express()


const mongoDB = require('./services/connect_mongo')
const {loadPlanetsData} = require('./data/PlanetData')
const PORT = process.env.PORT || 8080 

app.get('*', (req, res)=> {
    res.send('hello')
})

const startServer = async ()=>{
    try {
        await mongoDB.connectMongoDB()
        await loadPlanetsData()
        app.listen(PORT, ()=>{
            console.log(`Listening at port ${PORT}`)
        })
    } catch(err){
        console.log(`Cannot start server with error: ${err}`)
    }
}

startServer()