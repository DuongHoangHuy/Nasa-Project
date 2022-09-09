const mongoose = require('mongoose')

const MONGODB_URL = process.env.MONGODB_URL
const connectMongoDB = async () => {
    await mongoose.connect(MONGODB_URL)
}

const disconnectMongoDB = async ()=> {
    await mongoose.disconnect()
}
mongoose.connection.once('open', ()=>{
    console.log('MongoDB connected!')
})

mongoose.connection.on('error', (err)=>{
    console.log(`Fail connection to MongoDB with error: ${err}`)
})

module.exports = {connectMongoDB, disconnectMongoDB}