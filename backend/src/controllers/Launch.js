const Launch = require('../models/Launch')
const Planet = require('../models/Planet')
const axios =require('axios')
const DEFAULT_FLIGHT_NUMBER = 100
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

const getPagination = (query) => {
  console.log('query', query)
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

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
        error: "Planet is not exist"
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

const httpGetAllLaunches = async (req, res)=>{
  try {
    const allLaunches = await getAllLaunches(getPagination(req.query))
    res.status(200).json(allLaunches)
  } catch(err){
    console.log(err)
  }
}

const httpAddNewLaunch = async (req, res)=> {
  try {
    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.launchDate
      || !launch.target) {
        return res.status(400).json({
          error: 'Missing required launch property',
        });
      }
  
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
      return res.status(400).json({
        error: 'Invalid launch date',
      });
    }
  
    await addNewLaunch (launch);
    return res.status(201).json(launch);

  } catch (err){
    console.log("Add new launch error:", err)
  }
}

const httpDeleteLaunch = async (req, res)=>{
  try {
    const launchId = Number(req.params.id);

    const existsLaunch = await Launch.findOne({flightNumber: launchId})

    if (!existsLaunch) {
      return res.status(404).json({
        error: 'Launch not found',
      });
    }
  
    const aborted = await deleteLaunch(launchId);
    if (!aborted) {
      return res.status(400).json({
        error: 'Launch not aborted',
      });
    }
  
    return res.status(200).json({
      ok: true,
    });
  } catch (err){
    console.log("Delete launch error:", err)
  }
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
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpDeleteLaunch,
  loadLaunchesData
}

