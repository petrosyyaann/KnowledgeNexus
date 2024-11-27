import { useEffect, useCallback, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  Position,
  reconnectEdge,
  CoordinateExtent,
  NodeChange,
  // getConnectedEdges,
  // getIncomers,
  // getOutgoers,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Button, Flex } from 'shared/ui'
import { AddNodeModal } from './modal'
import { backendData } from './const'

const generatePosition = (x: number, yIndex: number) => ({
  x,
  y: 100 + yIndex * 80,
})

const generatePositionGroup = (x: number, yIndex: number) => ({
  x: x + yIndex * 80 + 25,
  y: 300,
})

const Home = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'connection' | 'transform'>(
    'connection'
  )
  const [selectedLabel, setSelectedLabel] = useState('')
  const edgeReconnectSuccessful = useRef(true)

  useEffect(() => {
    const newNodes: Node[] = []

    // Addable Nodes
    const addableNodes = backendData
      .filter((node) => node.type === 'connection')
      .map((node, index) => ({
        id: node.id,
        type: 'default',
        data: { label: node.label },
        position: generatePosition(100, index),
        draggable: false,
        sourcePosition: 'right' as Position,
        targetPosition: 'right' as Position,
        style: { cursor: 'pointer' },
      }))

    // static Section
    const staticSection: Node = {
      id: 'static-section',
      draggable: false,
      data: { label: 'transform' },
      position: { x: 375, y: 50 },
      sourcePosition: 'right' as Position,
      targetPosition: 'top' as Position,
      style: { width: 200, height: 550, background: 'transparent' },
    }

    // Static Nodes
    const staticNodes = backendData
      .filter((node) => node.type === 'transform')
      .map((node, index) => ({
        id: node.id,
        type: 'default',
        data: { label: node.label },
        position: generatePosition(400, index),
        draggable: false,
        sourcePosition: 'left' as Position,
        targetPosition: 'left' as Position,
        style: { cursor: 'pointer' },
      }))

    // Grouped Section (creating one group containing 3 nodes)
    const groupedSection: Node = {
      id: 'rag-section',
      draggable: false,
      data: { label: 'RAG' },
      position: { x: 700, y: 200 },
      sourcePosition: 'left' as Position,
      targetPosition: 'left' as Position,
      style: { width: 600, height: 250, background: 'transparent' },
    }

    const groupedNodes = backendData
      .filter((node) => node.type === 'rag')
      .map((node, index) => ({
        id: node.id,
        type: 'default',
        extent: 'parent' as 'parent' | CoordinateExtent,
        data: { label: node.label },
        position: generatePositionGroup(700 + index * 120, index),
        draggable: false,
        sourcePosition:
          node.id === 'rag-3' ? ('left' as Position) : ('right' as Position),
        targetPosition:
          node.id === 'rag-1' ? ('right' as Position) : ('left' as Position),
        style: { cursor: 'pointer' },
      }))

    newNodes.push(
      groupedSection,
      staticSection,
      ...addableNodes,
      ...staticNodes,
      ...groupedNodes
    )

    // Internal connections in rag section
    const groupedInternalEdges = [
      {
        id: 'e-static-section-rag-section',
        source: 'static-section',
        target: 'rag-section',
      },
      { id: 'e-rag-1-rag-2', source: 'rag-1', target: 'rag-2' },
      { id: 'e-rag-2-rag-3', source: 'rag-2', target: 'rag-3' },
    ]

    setNodes(newNodes)
    setEdges([...groupedInternalEdges])
  }, [setNodes, setEdges])

  const validateConnection = (connection: Connection): boolean => {
    const sourceNode = nodes.find((node) => node.id === connection.source)
    const targetNode = nodes.find((node) => node.id === connection.target)

    if (!sourceNode || !targetNode) return false

    // Разрешены соединения от connection -> transform
    if (
      sourceNode.id.startsWith('connection') &&
      (targetNode.id.startsWith('transform') ||
        targetNode.id === 'static-section')
    ) {
      return true
    }

    return false
  }

  const handleSectionConnections = (connection: Connection) => {
    const sourceNode = nodes.find((node) => node.id === connection.source)
    const targetNode = nodes.find((node) => node.id === connection.target)

    if (!sourceNode || !targetNode) return

    if (targetNode.id === 'static-section') {
      // Если подключаемся к секции, удаляем все соединения этого connection к конкретным transform-нодам
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== sourceNode.id ||
            !edge.target.startsWith('transform')
        )
      )
    }

    if (targetNode.id.startsWith('transform')) {
      // Если подключаемся к конкретной transform-ноде, удаляем соединение к секции
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            !(edge.source === sourceNode.id && edge.target === 'static-section')
        )
      )
    }
  }

  const onConnect = useCallback(
    (connection: Connection) => {
      if (validateConnection(connection)) {
        handleSectionConnections(connection) // Управляем конфликтами соединений
        setEdges((eds) => addEdge(connection, eds))
      } else {
        alert('Недопустимое соединение!')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, setEdges]
  )

  const openModal = (type: 'connection' | 'transform') => {
    setModalType(type)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedLabel('')
  }

  const addNewNode = () => {
    if (!selectedLabel) {
      alert('Please select a label!')
      return
    }

    if (modalType === 'connection') {
      const newId = `connection-${nodes.length + 1}`
      const newNode: Node = {
        id: newId,
        type: 'default',
        data: { label: selectedLabel },
        position: generatePosition(
          100,
          nodes.filter((n) => n.id.startsWith('connection')).length
        ),
        draggable: false,
        sourcePosition: 'right' as Position,
        targetPosition: 'right' as Position,
      }
      setNodes((nds) => [...nds, newNode])
    } else if (modalType === 'transform') {
      const newId = `transform-${nodes.length + 1}`
      const newNode: Node = {
        id: newId,
        type: 'default',
        data: { label: selectedLabel },
        position: generatePosition(
          400,
          nodes.filter((n) => n.id.startsWith('transform')).length
        ),
        draggable: false,
        sourcePosition: 'left' as Position,
        targetPosition: 'left' as Position,
      }
      setNodes((nds) => [...nds, newNode])

      // Adjust the size of the static section dynamically
      setNodes((nds) =>
        nds.map((node) =>
          node.id === 'static-section'
            ? {
                ...node,
                style: {
                  ...node.style,
                  height:
                    100 +
                    nodes.filter((n) => n.id.startsWith('transform')).length *
                      80,
                },
              }
            : node
        )
      )
    }
  }

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false
  }, [])

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true
      setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const onReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        if (edge.id.includes('connection')) {
          setEdges((eds) => eds.filter((e) => e.id !== edge.id))
        }
      }

      edgeReconnectSuccessful.current = true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  function shouldNodeBeRemoved(node: Node | undefined) {
    if (!node) return false // Если узел не найден, предотвращаем удаление
    if (node.id.includes('section') || node.id.includes('rag')) {
      alert('Удаление узлов section или rag запрещено!')
      return false
    }
    return true
  }

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const nextChanges = changes.reduce((acc, change) => {
        if (change.type === 'remove') {
          const node = nodes.find((n) => n.id === change.id)

          // Если узел можно удалить, сохраняем изменение
          if (shouldNodeBeRemoved(node)) {
            return [...acc, change]
          }

          // Иначе пропускаем изменение (узел остается)
          return acc
        }

        // Остальные изменения добавляем без проверки
        return [...acc, change]
      }, [] as NodeChange[])

      // Применяем отфильтрованные изменения
      onNodesChange(nextChanges)
    },
    [nodes, onNodesChange]
  )

  const saveConnections = () => {
    const updatedBackendData = backendData.map((node) => ({
      ...node,
      connections: edges
        .filter((edge) => edge.source === node.id)
        .map((edge) => edge.target),
    }))
    console.log('Saving connections:', updatedBackendData)
  }

  return (
    <Flex direction="column" alignItems="flex-end" p="15px" gap="5px">
      <Flex gap="20px">
        <Button onClick={() => openModal('connection')}>
          Добавить connection
        </Button>
        <Button onClick={() => openModal('transform')}>
          Добавить transform
        </Button>
      </Flex>
      <AddNodeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        modalType={modalType}
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
        onAdd={addNewNode}
      />
      <Flex w="90vw" h="80vh">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => {
            console.log('Нода кликнута:', node)
          }}
          nodesDraggable={false}
          elementsSelectable={true}
          onReconnectStart={onReconnectStart}
          onReconnect={onReconnect}
          onReconnectEnd={onReconnectEnd}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </Flex>
      <Button onClick={saveConnections}>Обработать</Button>
    </Flex>
  )
}

export default Home
