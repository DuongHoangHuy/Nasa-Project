const express = require('express')
const app = express()
const cors = require('cors')
const v1Router = require('./routes/v1Router')
const path = require('path')
const whitelist = ['http://localhost:3000']
const morgan = require('morgan')
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(morgan('tiny'))

// app.use(cors(corsOptions))
app.use(cors({origin: 'http://localhost:3000'}))


app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/v1', v1Router)

app.get('/*', (req, res)=>{
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app

// API declaration