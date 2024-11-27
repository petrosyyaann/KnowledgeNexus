import { BackendNode } from '../types'
function determineNodeType(
  node: BackendNode
): 'connection' | 'transform' | 'rag' {
  if (node.id.startsWith('connection')) return 'connection'
  if (node.id.startsWith('transform')) return 'transform'
  return 'rag'
}

export function transformFlowToBackendData(flowData: BackendNode[]) {
  return flowData
    .filter((node) => !node.id?.includes('section')) // Исключить узлы с "section" в label
    .map((node) => ({
      id: node.id,
      type: determineNodeType(node), // Определяем тип узла
      label: node.label,
      connections: node.connections || [],
      data: node.data || {},
    }))
}

export function filterNodes(nodes: BackendNode[]) {
  // Собираем все id из поля connections нод с типом connection
  const connectedIds = new Set(
    nodes
      .filter((node) => node.type === 'connection')
      .flatMap((node) => node.connections)
  )

  // Фильтруем массив, удаляя ноды типа transform, id которых нет в connectedIds
  return nodes.filter(
    (node) => node.type !== 'transform' || connectedIds.has(node.id)
  )
}
