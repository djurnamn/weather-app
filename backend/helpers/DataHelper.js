import { getIconNiceName } from './IconHelper.js'
import {
    formatTimestamp,
    timestampsAreSameDay,
    getDateDescriptionFromTimestamp,
} from './TimeHelper.js'

export const idExists = (data, id) => {
    const { daily: days } = data

    return (days.find((day) => formatTimestamp(day.dt) === id))
}

export const formatDaysSummary = (data, ids = null) => {
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

export const formatDayFull = (data, id = null) => {
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