import axios from 'axios'

export const getDayFull = async (id = null) => {
    const params = id ? `/${id}` : ''

    return await axios.get(`http://localhost:3587/get-day-full${params}?lat=58.5812&lon=16.158`)
}

export const getDaysSummary = async (ids = false) => {
    const query = ids && Array.isArray(ids) ? `ids=${ids.join(',')}&` : ''

    return await axios.get(`http://localhost:3587/get-days-summary?${query}lat=58.5812&lon=16.158`)
}