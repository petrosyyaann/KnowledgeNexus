import axios from 'shared/api/axios'

export function login(login: string, password: string) {
  return axios.post(
    '/api/v1/auth/login',
    {
      login,
      password,
    },
    {
      withCredentials: true,
    }
  )
}

export const registerUser = async (userData: {
  username: string
  email: string
  password: string
  name: string
  surname: string
}) => {
  return axios.post('/api/v1/auth/signup', userData, {
    withCredentials: true,
  })
}

export function logout() {
  return axios.delete('/api/v1/auth/logout', {
    withCredentials: true,
  })
}

export function getUserInfo() {
  return axios.get('/api/v1/user/me', {
    withCredentials: true,
  })
}

export function getUsers(project_id: number) {
  return axios.get(`/api/v1/project/${project_id}/users`, {
    withCredentials: true,
  })
}
