const dotenv = require('dotenv')
const axios = require('axios').default
const express = require('express')
const Redis = require('ioredis')

dotenv.config()
const app = express()
const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: '127.0.0.1'
})

const externalApiEndpoint = (lat, lon) => `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${process.env.EXTERNAL_API_KEY}`

app.get('/weather', async (req, res) => {
    let lat = parseFloat(req.query.lat)
    let lon = parseFloat(req.query.lon)
    let cacheKey = `weather-lat:${lat}-lon:${lon}`

    // look for entry in cache
    let cachedEntry = await redis.get(cacheKey)

    if (cachedEntry) {
        let parsedEntry = JSON.parse(cachedEntry)

        // cached entry found, return it
        res.send({ ...parsedEntry, source: 'cache' })
    } else {
        // no cached entry found, make request to external api
        try {
            let response = await axios.get(externalApiEndpoint(lat, lon))
            let responseEntry = response.data
            let stringifiedEntry = JSON.stringify(responseEntry)
        
            // write stringified response entry to redis cache (set to expire in 1 hour)
            redis.set(cacheKey, stringifiedEntry, 'EX', 3600)

            // TODO: format the return value in a more desirable way for the frontend
        
            // return response from external api
            res.send({ ...responseEntry, source: 'api' })
        } catch(error) {
            // TODO: improve error handling
            res.send(error)
        }
    }
})

app.listen(process.env.LOCAL_API_PORT, () => {
    console.log(`weather api is running on port ${process.env.LOCAL_API_PORT}...`)
})