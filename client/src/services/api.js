import axios from 'axios'

const backend = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const api = axios.create({
  baseURL: backend ? `${backend}/api` : '/api',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || 'Ошибка сервера'
    return Promise.reject(new Error(msg))
  }
)

export const getSkills    = ()           => api.get('/skills')
export const createSkill  = (data)       => api.post('/skills', data)
export const updateSkill  = (id, data)   => api.put(`/skills/${id}`, data)
export const deleteSkill  = (id)         => api.delete(`/skills/${id}`)

export const getProjects   = ()          => api.get('/projects')
export const createProject = (data)      => api.post('/projects', data)
export const updateProject = (id, data)  => api.put(`/projects/${id}`, data)
export const deleteProject = (id)        => api.delete(`/projects/${id}`)

export const sendMessage    = (data)     => api.post('/messages', data)
export const getMessages    = ()         => api.get('/messages')
export const deleteMessage  = (id)       => api.delete(`/messages/${id}`)
export const markRead       = (id)       => api.patch(`/messages/${id}/read`)

export const login = (data) => api.post('/auth/login', data)

export default api
