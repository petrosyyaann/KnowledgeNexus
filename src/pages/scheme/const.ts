interface BackendNode {
  id: string
  type: 'connection' | 'transform' | 'rag'
  label: string
  connections: string[]
}

export const backendData: BackendNode[] = [
  {
    id: 'connection-1',
    type: 'connection',
    label: 'confluence',
    connections: ['transform-1'],
  },
  {
    id: 'connection-2',
    type: 'connection',
    label: 'url',
    connections: ['transform-2'],
  },
  {
    id: 'transform-1',
    type: 'transform',
    label: 'pdf parser',
    connections: [],
  },
  { id: 'transform-2', type: 'transform', label: 'ocr', connections: [] },
  { id: 'transform-3', type: 'transform', label: 'ASR', connections: [] },
  {
    id: 'transform-4',
    type: 'transform',
    label: 'txt_parser',
    connections: [],
  },
  { id: 'transform-5', type: 'transform', label: 'clip', connections: [] },
  { id: 'transform-6', type: 'transform', label: 'clap', connections: [] },
  {
    id: 'RAG-1',
    type: 'rag',
    label: 'chunker1',
    connections: [],
  },
  {
    id: 'RAG-2',
    type: 'rag',
    label: 'embedder',
    connections: [],
  },
  {
    id: 'RAG-3',
    type: 'rag',
    label: 'llm qa',
    connections: [],
  },
]
