const Planet = require('../models/Planet')

const getAllPlanets = async (req, res)=>{
    try{
        const planetData =  await Planet.find({}, {
            "_id": 0, "__v": 0
        })
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