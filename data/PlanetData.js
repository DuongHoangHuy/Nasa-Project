const fs = require('fs')
const path = require('path')
const {parse} = require('csv-parse')

const {savePlanet} = require('../controllers/Planet')

const isHabitablePlanet = (planet)=>{
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6
}

const loadPlanetsData = ()=>{
    try {
    return new Promise((resolve, reject)=>{
        fs.createReadStream(path.join(__dirname, 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true 
        }))
        .on('data', async (data)=>{
            if(isHabitablePlanet(data)){
                await savePlanet(data)
            }
        })
        .on('error', (err)=>{
            reject(err)
        })
        .on('end', async ()=>{ 
            resolve()
        })
    })
    }catch (err){
        console.log(`Load planet failed with error: ${err}`)
    }
}


module.exports  = {loadPlanetsData}