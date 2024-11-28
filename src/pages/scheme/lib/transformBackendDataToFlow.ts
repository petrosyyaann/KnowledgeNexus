import { Edge, Node, Position, CoordinateExtent } from '@xyflow/react'
import { BackendNode } from '../types'

type TransformBackendDataResult = {
  nodes: Node[]
  edges: Edge[]
}

export function transformBackendDataToFlow(
  defaultData: BackendNode[]
): TransformBackendDataResult {
  const generatePosition = (x: number, yIndex: number) => ({
    x,
    y: 100 + yIndex * 80,
  })

  const generatePositionGroup = (x: number, yIndex: number) => ({
    x: x + yIndex * 80 + 25,
    y: 300,
  })
  console.log(defaultData)
  const addableNodes = defaultData
    .filter((node) => node.type === 'connection')
    .map((node, index) => ({
      id: node.id,
      type: 'default',
      label: node.label,
      connectionsts: node.connections,
      data: { ...node.data, label: node.label },
      position: generatePosition(100, index),
      draggable: false,
      sourcePosition: 'right' as Position,
      targetPosition: 'right' as Position,
      style: { cursor: 'pointer' },
    }))

  const staticSection: Node = {
    id: 'static-section',
    draggable: false,
    data: { label: 'transform' },
    position: { x: 375, y: 50 },
    sourcePosition: 'right' as Position,
    targetPosition: 'top' as Position,
    style: { width: 200, height: 550, background: 'transparent' },
  }

  const staticNodes = defaultData
    .filter((node) => node.type === 'transform')
    .map((node, index) => ({
      id: node.id,
      type: 'default',
      label: node.label,
      connectionsts: node.connections,
      data: { ...node.data, label: node.label },
      position: generatePosition(400, index),
      draggable: false,
      sourcePosition: 'left' as Position,
      targetPosition: 'left' as Position,
      style: { cursor: 'pointer' },
    }))

  const groupedSection: Node = {
    id: 'RAG-section',
    draggable: false,
    data: { label: 'RAG' },
    position: { x: 700, y: 200 },
    sourcePosition: 'left' as Position,
    targetPosition: 'left' as Position,
    style: { width: 600, height: 250, background: 'transparent' },
  }

  const groupedNodes = defaultData
    .filter((node) => node.type === 'rag')
    .map((node, index) => ({
      id: node.id,
      label: node.label,
      connectionsts: node.connections,
      type: 'default',
      extent: 'parent' as 'parent' | CoordinateExtent,
      data: { ...node.data, label: node.label },
      position: generatePositionGroup(700 + index * 120, index),
      draggable: false,
      sourcePosition:
        node.id === 'RAG-3' ? ('left' as Position) : ('right' as Position),
      targetPosition:
        node.id === 'RAG-1' ? ('right' as Position) : ('left' as Position),
      style: { cursor: 'pointer' },
    }))

  const groupedInternalEdges = [
    {
      id: 'e-static-section-RAG-section',
      source: 'static-section',
      target: 'RAG-section',
    },
    { id: 'e-RAG-1-RAG-2', source: 'RAG-1', target: 'RAG-2' },
    { id: 'e-RAG-2-RAG-3', source: 'RAG-2', target: 'RAG-3' },
  ]

  const connectionEdges = defaultData.flatMap((node) =>
    node.connections.map((targetId) => ({
      id: `e-${node.id}-${targetId}`,
      source: node.id,
      target: targetId,
    }))
  )

  const nodes = [
    groupedSection,
    staticSection,
    ...addableNodes,
    ...staticNodes,
    ...groupedNodes,
  ]

  const edges = [...groupedInternalEdges, ...connectionEdges]

  console.log(nodes)
  console.log(edges)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return { nodes, edges }
}
