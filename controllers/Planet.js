const Planet = require('../models/Planet')

const getAllPlanets = async ()=>{
    try{
        return await Planet.find({}, {
            "_id": 0, "__v": 0
        })
    }catch(err){
        console.log("Can not get all palnets: " + err)
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