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
export function getWorkflowSettings(workflow_id: number) {
  return axios.get(`/api/v1/workflow/settings?workflow_id=${workflow_id}`, {
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
export function deleteWorkflowSettings(workflow_id: number) {
  return axios.delete(`/api/v1/workflow/settings?workflow_id=${workflow_id}`, {
    withCredentials: true,
  })
}

// PUT /api/v1/workflow/agent/settings
export function putWorkflowAgentSettings(
  workflow_id: number,
  title: string,
  color: string,
  iconUr: string,
  customCss: string,
  domains: string[],
  ips: string[]
) {
  return axios.put(
    `/api/v1/workflow/agent/settings?workflow_id=${workflow_id}`,
    {
      host_permissions: { domens: domains, ipaddress: ips },
      style_settings: {
        title,
        theme_colour: color,
        icon_url: iconUr,
        style_css: customCss,
      },
    },
    {
      withCredentials: true,
    }
  )
}

// GET /api/v1/workflow/all
export function getAllWorkflows() {
  return axios.get('/api/v1/workflow/all', {
    withCredentials: true,
  })
}
