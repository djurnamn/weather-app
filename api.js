const dotenv = require('dotenv')
const axios = require('axios').default
const express = require('express')
const Redis = require('ioredis')
const moment = require('moment')
const { ids } = require('webpack')

dotenv.config()
const app = express()
const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: '127.0.0.1'
})

const externalApiEndpoint = (lat, lon) => `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=current,minutely,alerts&appid=${process.env.EXTERNAL_API_KEY}`

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
            // TODO: improve error handling
            return error
        }
    }
}

// TODO: move to helper
const getIconNiceName = (icon) => {
    const icons = {
        "01d": "clear-day",
        "01n": "clear-night",
        "02d": "partly-cloudy-day",
        "02n": "partly-cloudy-night",
        "03d": "cloudy",
        "03n": "cloudy",
        "04d": "overcast",
        "04n": "overcast",
        "09d": "overcast-rain",
        "09n": "overcast-rain",
        "10d": "partly-cloudy-day-rain",
        "10n": "partly-cloudy-night-rain",
        "11d": "thunderstorms",
        "11n": "thunderstorms",
        "13d": "partly-cloudy-day-snow",
        "13n": "partly-cloudy-day-snow",
        "50d": "fog-day",
        "50n": "fog-night"
    }

    const niceName = icons[icon] ? icons[icon] : Object.values(icons)[0]

    return niceName
}

const formatTimestamp = (timestamp, format = 'YYMMDD') => {
    return moment(timestamp * 1000).format(format)
}

const timestampsAreSameDay = (a, b) => {
    return moment(a * 1000).isSame(b * 1000, 'day')
}

const getDateDescriptionFromTimestamp = (timestamp) => {
    const startOfToday = moment().startOf('day')
    const startOfDate = moment(timestamp * 1000).startOf('day')
    let dateDescription = moment(timestamp * 1000)
        .format(`dddd${(!startOfDate.isSame(startOfToday, 'week') ? ' (Do)' : '')}`) // TODO: add shortened month before (Do)
    const daysDiff = startOfDate.diff(startOfToday, 'days')
    
    const days = {
        '0': 'Today',
        '1': 'Tomorrow'
    }

    if (Math.abs(daysDiff) <= 1) {
        dateDescription = days[daysDiff]
    }

    return dateDescription
}

const idExists = (data, id) => {
    const { daily: days } = data

    return (days.find((day) => formatTimestamp(day.dt) === id))
}

const formatDaysSummary = (data, ids = null) => {
    let { daily: days } = data
    
    // if ids, replace any non-matching days with blank entries
    if (ids) {
        days = ids.map((id) => !idExists(data, id)
            ? { blank: true }
            : days.find((day) => id === formatTimestamp(day.dt))
        )
    }

    // return formatted data
    return days.map((day) => (
        day.blank
            ? day
            : {
                id: formatTimestamp(day.dt),
                icon: getIconNiceName(day.weather[0].icon),
                temperatureDay: Math.round(day.temp.day),
                temperatureNight: Math.round(day.temp.night),
                dateDescription: getDateDescriptionFromTimestamp(day.dt),
            }
    ))
}

const formatDayFull = (data, id = null) => {
    const { hourly: hours, daily: days } = data

    // find day matching date based id
    const matchingDay = days.find(
        (day) => id === formatTimestamp(day.dt)
    ) || days[0]

    // find hours matching day
    const matchingHours = hours.filter(
        (hour) => timestampsAreSameDay(hour.dt, matchingDay.dt)
    )

    // format matching hours
    const formattedHours = matchingHours.map((hour) => ({
        id: formatTimestamp(hour.dt, 'YYMMDDhhmm'),
        dayId: formatTimestamp(hour.dt),
        time: formatTimestamp(hour.dt, 'HH:mm'),
        icon: getIconNiceName(hour.weather[0].icon),
        temperature: Math.round(hour.temp),
        description: hour.weather[0].description,
    }))

    const formattedDays = formatDaysSummary(data)

    const attributeProperties = {
        humidity: {
            icon: 'humidity',
            unit: '%'
        },
        pressure: {
            icon: 'barometer',
            unit: 'hPa'
        },
        wind_speed: {
            icon: 'windsock',
            unit: 'm/s'
        }
    }

    // return formatted data
    return {
        id: formatTimestamp(matchingDay.dt),
        icon: getIconNiceName(matchingDay.weather[0].icon),
        temperatureDay: Math.round(matchingDay.temp.day),
        temperatureNight: Math.round(matchingDay.temp.night),
        description: matchingDay.weather[0].description,
        sunrise: formatTimestamp(matchingDay.sunrise, 'HH:mm'),
        sunset: formatTimestamp(matchingDay.sunset, 'HH:mm'),
        attributes: Object.keys(attributeProperties).map((key) => ({
            key: key,
            value: matchingDay[key],
            unit: attributeProperties[key].unit,
            icon: attributeProperties[key].icon
        })),
        dateDescription: getDateDescriptionFromTimestamp(matchingDay.dt),
        hours: formattedHours,
        days: formattedDays,
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