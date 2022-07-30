import dotenv from 'dotenv'
import axios from 'axios'
import express from 'express'
import Redis from 'ioredis'
import {
    idExists,
    formatDaysSummary,
    formatDayFull
} from './helpers/DataHelper.js'

dotenv.config()
const app = express()
const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: '127.0.0.1'
})

const externalApiEndpoint = (lat, lon) => `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=current,minutely,alerts&appid=${process.env.EXTERNAL_API_KEY}`

/**
 * Get data from external API, if we don't have it in cache
 */

const getDataFromCacheOrExternalApi = async (lat, lon) => {
    let cacheKey = `weather-lat:${lat}-lon:${lon}`

    // look for entry in cache
    let cachedEntry = await redis.get(cacheKey)

    if (cachedEntry) {
        let parsedEntry = JSON.parse(cachedEntry)

        // cached entry found, return it
        return { ...parsedEntry, source: 'cache' }
    } else {
        // no cached entry found, make request to external api
        try {
            let response = await axios.get(externalApiEndpoint(lat, lon))
            let responseEntry = response.data
            let stringifiedEntry = JSON.stringify(responseEntry)
        
            // write stringified response entry to redis cache (set to expire in 1 hour)
            redis.set(cacheKey, stringifiedEntry, 'EX', 3600)
        
            // return response from external api
            return { ...responseEntry, source: 'api' }
        } catch(error) {
            // TODO: improve external request related error handling
            return error
        }
    }
}

/**
 * Set up CORS proxy
 */

app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")

    next()
})

/**
 * Get weather by date based id
 */

app.get('/get-day-full/:id?', async (req, res) => {
    const data = await getDataFromCacheOrExternalApi(
        parseFloat(req.query.lat),
        parseFloat(req.query.lon)
    )

    if (req.params.id && !idExists(data, req.params.id)) {
        return res.sendStatus(404)
    }

    const formattedData = formatDayFull(data, req.params.id || null)

    res.send(formattedData)
})

/**
 * Get weather by date based ids
 */

app.get('/get-days-summary/:ids?', async (req, res) => {
    const data = await getDataFromCacheOrExternalApi(
        parseFloat(req.query.lat),
        parseFloat(req.query.lon)
    )

    const ids = req.query.ids ? req.query.ids.split(',') : null
    const formattedData = formatDaysSummary(data, ids)

    res.send(formattedData)
})

app.listen(process.env.LOCAL_API_PORT, () => {
    console.log(`weather api is running on port ${process.env.LOCAL_API_PORT}...`)
})