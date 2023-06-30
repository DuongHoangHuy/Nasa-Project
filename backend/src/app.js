const express = require('express')
const app = express()
const cors = require('cors')
const v1Router = require('./routes/v1Router')
const path = require('path')
const whitelist = ['http://localhost:3000']

const corsOptions = {
  origin: function (origin, callback) {
    console.log(origin)
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))
// app.use(cors({origin: 'http://localhost:3000'}))


app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/v1', v1Router)

module.exports = app

// API declaration