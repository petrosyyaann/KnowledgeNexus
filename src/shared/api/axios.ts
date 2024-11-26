import axios from 'axios'
import { RefreshResponse, TPromiseRefresh } from './types'

export function refresh(token: string) {
  return axios.post<RefreshResponse>(
    '/api/v1/auth/refresh',
    { refresh: token },
    {
      withCredentials: true,
    }
  )
}

let refreshPromise: TPromiseRefresh | null = null

export async function refreshWithoutRepeats() {
  if (refreshPromise) {
    return refreshPromise
  }

  const token = localStorage.getItem('refresh') || ''
  if (!token) throw new Error('No refresh token')

  refreshPromise = refresh(token)
  try {
    const response = await refreshPromise
    if (response.data?.refresh) {
      localStorage.setItem('refresh', response.data.refresh)
    } else {
      throw new Error('Failed to refresh token')
    }
    return response
  } finally {
    refreshPromise = null 
  }
}

const $api = axios.create({ withCredentials: true, responseType: 'json' })

/* ==$API with  response interceptors== */

$api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true

      try {
        await refreshWithoutRepeats() 
        return $api.request(originalRequest) 
      } catch (refreshError) {
        localStorage.removeItem('refresh')
        throw refreshError
      }
    }

    throw error
  }
)

export default $api
