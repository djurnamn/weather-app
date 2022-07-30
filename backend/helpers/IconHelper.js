export const getIconNiceName = (icon) => {
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