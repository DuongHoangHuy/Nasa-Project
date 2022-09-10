const Launch = require('../models/Launch')
const Planet = require('../models/Planet')
const axios =require('axios')
const DEFAULT_FLIGHT_NUMBER = 100

const getAllLaunches = async ({page, limit})=>{
  return await Launch.find({}, {
    "_id": 0, "__v": 0
  })
  .sort({flightNumber: 1})
  .skip((page-1)*limit)
  .limit(limit)
}

const addNewLaunch = async (newLaunch)=>{
  try{
    const isTargetExist = await Planet.findOne({keplerName: newLaunch.target})
    if(!isTargetExist){
      return {
        ok: false,
        error: "Target is not exist"
      }
    }

    const latestFlightNumber = await getLatestFlightNumber()
    Object.assign(newLaunch, {
      launchDate: new Date(newLaunch.launchDate),
      flightNumber: latestFlightNumber+1,
      customers: ['NASA'],
      upcoming: true,
      success: true,
    })
    await saveLaunch(newLaunch)
    return {
      ok: true
    }
  }catch(err){
    console.log("Adding error: " + err)
  }
}

const deleteLaunch = async (deleteId)=>{
  const res = await Launch.updateOne({
    flightNumber: deleteId
  }, { 
    upcoming: false,
    success: false,
  })
  return (res.modifiedCount === 1)
}

//_______________________UTILS_______________________
const getLatestFlightNumber = async ()=>{
    const latest = await Launch.findOne({}).sort('-flightNumber')
    if(!latest){
      return DEFAULT_FLIGHT_NUMBER
    }
    return latest.flightNumber
  }
  
  const saveLaunch = async(launch)=>{
    await Launch.updateOne({
      flightNumber: launch.flightNumber
    }, {
      ...launch
    }, {
      upsert: true
    })
  }


//_______________________SPACE X API______________________
const SPACEX_URL_API = "https://api.spacexdata.com/v4/launches/query"

const downloadLaunches = async ()=>{
  console.log('Loading launches data ...')
  const res = await axios.post(SPACEX_URL_API, {
    query: {},
    options: {
      pagination: false, 
      populate: [
       {
        path: "rocket",
        select: {
          name: 1
        }
       },{
        path: "payloads",
        select: {
          customers: 1
        }
       }
      ]
    }
  })

  const launchDocs = res.data.docs

  for(let launchDoc of launchDocs){
    const customers = launchDoc.payloads.flatMap(payload => payload.customers)

    const launchData = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      customers,
      upcoming: launchDoc.upcoming, 
      success: launchDoc.success, 
    }

    await saveLaunch(launchData)
  }
  console.log("Load completely")
}

const loadLaunchesData = async ()=>{
  const firstLaunch = await Launch.findOne({
    rocket: "Falcon 1",
    flightNumber: 1,
    mission: "FalconSat",
  })

  if(firstLaunch){
    console.log("Launches already loaded")
  }else{
    await downloadLaunches()
  }
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  deleteLaunch,
  loadLaunchesData
}

