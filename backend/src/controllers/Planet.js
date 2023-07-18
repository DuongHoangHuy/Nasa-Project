const Planet = require('../models/Planet')
const {redisGet, redisSet} = require('../services/connect_redis')

const getAllPlanets = async (req, res)=>{
    try{
        let planetData
        let cacheInfo = await redisGet('all-planets')
        if (cacheInfo.isCached) {
            planetData = cacheInfo.cachedData
        } else {
            planetData =  await Planet.find({}, {
                "_id": 0, "__v": 0
            })
          redisSet('all-planets', planetData)
        }
        console.log('Cached planets', cacheInfo.isCached)
        return res.status(200).json(planetData)
    }catch(err){
        console.log(`Cannot get all planets with error: ${err}`)
    }
}

const savePlanet = async (planet)=>{
    try{
        await Planet.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        },{
            upsert: true
        })
    }catch(err){
        console.log(`Cannot save with error: ${err}`)
    }
}

module.exports = {getAllPlanets, savePlanet}