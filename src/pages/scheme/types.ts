export enum EnumConnectionDBTypes {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
  SQLITE = 'sqlite',
}

export interface PdfParser {
  max_symbols: number
}

export interface Ocr {
  endpoint_url: string
  headers: string
  max_symbols: number
}

export interface Asr {
  endpoint_url: string
  headers: string
  max_symbols: number
}

export interface TxtParser {
  max_symbols: number
}

export interface Notion {
  url: string
  api_key: string
  user_space: string
}

export interface Confluence {
  url: string
  api_token: string
  email: string
}

export interface Db {
  db_port: number
  db_username: string
  db_password: string
  db_type: EnumConnectionDBTypes
  db_address: string
  sql_query: string
}

export interface Url {
  url: string
  search_depth: number
}

export interface S3 {
  s3_path: string[]
}

export interface Clip {
  url: string
}

export interface Clap {
  url: string
}

export interface RagChunker {
  chunk_size: number
  chunk_overlap: number
}

export interface RagEmbedder {
  url: string
  modal_name: string
  headers: string
}

export interface RagLLMQa {
  url: string
  modal_name: string
  api_token: string
  headers: string
  rag_n: string
  use_additional_instruction: boolean
  additional_instruction: string
  prompt_template: string
}

export type NodeData =
  | PdfParser
  | Ocr
  | Asr
  | TxtParser
  | Notion
  | Confluence
  | Db
  | Url
  | S3
  | RagChunker
  | RagEmbedder
  | RagLLMQa
  | Clip
  | Clap

export interface BackendNode {
  id: string
  type: 'connection' | 'transform' | 'rag'
  label: string
  connections: string[]
  data: NodeData
}

export const defaultData: BackendNode[] = [
  {
    id: 'connection-1',
    type: 'connection',
    label: 'notion',
    connections: [],
    data: { url: '', api_key: '', user_space: '' },
  },
  {
    id: 'connection-2',
    type: 'connection',
    label: 'confluence',
    connections: [],
    data: { url: '', api_token: '', email: '' },
  },
  {
    id: 'connection-3',
    type: 'connection',
    label: 'db',
    connections: [],
    data: {
      db_port: 0,
      db_username: '',
      db_password: '',
      db_type: EnumConnectionDBTypes.POSTGRES,
      db_address: '',
      sql_query: '',
    },
  },
  {
    id: 'connection-4',
    type: 'connection',
    label: 'url',
    connections: [],
    data: { url: '', search_depth: 0 },
  },
  {
    id: 'connection-5',
    type: 'connection',
    label: 's3',
    connections: [],
    data: { s3_path: [] },
  },
  {
    id: 'transform-1',
    type: 'transform',
    label: 'pdf_parser',
    connections: [],
    data: { max_symbols: 0 },
  },
  {
    id: 'transform-2',
    type: 'transform',
    label: 'ocr',
    connections: [],
    data: { endpoint_url: '', headers: '', max_symbols: 0 },
  },
  {
    id: 'transform-3',
    type: 'transform',
    label: 'asr',
    connections: [],
    data: { endpoint_url: '', headers: '', max_symbols: 0 },
  },
  {
    id: 'transform-4',
    type: 'transform',
    label: 'txt_parser',
    connections: [],
    data: { max_symbols: 0 },
  },
  {
    id: 'transform-5',
    type: 'transform',
    label: 'clip',
    connections: [],
    data: { url: '' },
  },
  {
    id: 'transform-6',
    type: 'transform',
    label: 'clap',
    connections: [],
    data: { url: '' },
  },
  {
    id: 'RAG-1',
    type: 'rag',
    label: 'chunker',
    connections: [],
    data: { chunk_size: 0, chunk_overlap: 0 },
  },
  {
    id: 'RAG-2',
    type: 'rag',
    label: 'embedder',
    connections: [],
    data: { url: '', modal_name: '', headers: '' },
  },
  {
    id: 'RAG-3',
    type: 'rag',
    label: 'llm_qa',
    connections: [],
    data: {
      url: '',
      modal_name: '',
      api_token: '',
      headers: '',
      rag_n: '',
      use_additional_instruction: false,
      additional_instruction: '',
      prompt_template: '',
    },
  },
]

export const startData: BackendNode[] = [
  {
    id: 'connection-1',
    type: 'connection',
    label: 's3',
    connections: [],
    data: { s3_path: [] },
  },
  {
    id: 'transform-1',
    type: 'transform',
    label: 'txt_parser',
    connections: [],
    data: { url: '' },
  },
  {
    id: 'RAG-1',
    type: 'rag',
    label: 'chunker',
    connections: [],
    data: { chunk_size: 0, chunk_overlap: 0 },
  },
  {
    id: 'RAG-2',
    type: 'rag',
    label: 'embedder',
    connections: [],
    data: { url: '', modal_name: '', headers: '' },
  },
  {
    id: 'RAG-3',
    type: 'rag',
    label: 'llm_qa',
    connections: [],
    data: {
      url: '',
      modal_name: '',
      api_token: '',
      headers: '',
      rag_n: '',
      use_additional_instruction: false,
      additional_instruction: '',
      prompt_template: '',
    },
  },
]
