import axios from 'axios'

const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:3587'

export const getDayFull = async (id = null) => {
  const params = id ? `/${id}` : ''

  return await axios.get(`${apiUrl}/get-day-full${params}?lat=58.5812&lon=16.158`)
}

export const getDaysSummary = async (ids = null) => {
  const query = ids && Array.isArray(ids) ? `ids=${ids.join(',')}&` : ''

  return await axios.get(`${apiUrl}/get-days-summary?${query}lat=58.5812&lon=16.158`)
}
