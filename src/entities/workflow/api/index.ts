import { BackendNode } from 'pages/scheme/types'
import axios from 'shared/api/axios'

export function postWorkflow(updatedBackendData: BackendNode[]) {
  return axios.post('/api/v1/workflow/settings', updatedBackendData, {
    withCredentials: true,
  })
}

export const postFiles = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post('/api/v1/integration/file/upload', formData, {
    withCredentials: true,
  })
}

// GET /api/v1/workflow/settings
export function getWorkflowSettings() {
  return axios.get('/api/v1/workflow/settings', {
    withCredentials: true,
  })
}

// PUT /api/v1/workflow/settings
export function putWorkflowSettings(updatedBackendData: BackendNode[]) {
  return axios.put('/api/v1/workflow/settings', updatedBackendData, {
    withCredentials: true,
  })
}

// DELETE /api/v1/workflow/settings
export function deleteWorkflowSettings() {
  return axios.delete('/api/v1/workflow/settings', {
    withCredentials: true,
  })
}

// PUT /api/v1/workflow/agent/settings
// export function putWorkflowAgentSettings(agentSettings: any) {
//   return axios.put('/api/v1/workflow/agent/settings', agentSettings, {
//     withCredentials: true,
//   })
// }

// GET /api/v1/workflow/all
export function getAllWorkflows() {
  return axios.get('/api/v1/workflow/all', {
    withCredentials: true,
  })
}
