import { AxiosResponse } from 'axios'

export interface RefreshResponse {
  refresh: string
}

export type TRefresh = AxiosResponse<RefreshResponse>

export type TPromiseRefresh = Promise<TRefresh>
