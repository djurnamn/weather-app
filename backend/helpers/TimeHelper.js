import moment from 'moment'

export const formatTimestamp = (timestamp, format = 'YYMMDD') => {
    return moment(timestamp * 1000).format(format)
}

export const timestampsAreSameDay = (a, b) => {
    return moment(a * 1000).isSame(b * 1000, 'day')
}

export const getDateDescriptionFromTimestamp = (timestamp) => {
    const startOfToday = moment().startOf('day')
    const startOfDate = moment(timestamp * 1000).startOf('day')
    let dateDescription = moment(timestamp * 1000)
        .format(`dddd${(!startOfDate.isSame(startOfToday, 'week') ? ' (MMM Do)' : '')}`)
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