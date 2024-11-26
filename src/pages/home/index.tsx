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
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from '@chakra-ui/react'
import { Button } from 'shared/ui'

interface BackendNode {
  id: string
  type: 'connection' | 'transform' | 'rag'
  label: string
  connections: string[]
}

const backendData: BackendNode[] = [
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
    id: 'rag-1',
    type: 'rag',
    label: 'chunker1',
    connections: [],
  },
  {
    id: 'rag-2',
    type: 'rag',
    label: 'embedder',
    connections: [],
  },
  {
    id: 'rag-3',
    type: 'rag',
    label: 'llm qa',
    connections: [],
  },
]

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
      }))

    // static Section
    const staticSection: Node = {
      id: 'static-section',
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
        sourcePosition: 'right' as Position,
        targetPosition: 'left' as Position,
      }))

    // Grouped Section (creating one group containing 3 nodes)
    const groupedSection: Node = {
      id: 'rag-section',
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

    if (
      sourceNode.id.startsWith('connection') &&
      targetNode.id.startsWith('transform')
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
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== sourceNode.id ||
            !edge.target.startsWith('transform')
        )
      )
    }

    if (targetNode.id.startsWith('transform')) {
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
        handleSectionConnections(connection)
        setEdges((eds) => addEdge(connection, eds))
      } else {
        alert('Друг, ну так нельзя, очевидно!')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, setEdges]
  )

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedLabel('')
  }

  const addNewConnection = () => {
    if (!selectedLabel) {
      alert('Please select a label!')
      return
    }

    const newId = `connection-${nodes.length + 1}`
    const newNode: Node = {
      id: newId,
      type: 'default',
      data: { label: selectedLabel },
      position: generatePosition(100, nodes.length - 11),
      draggable: false,
      sourcePosition: 'right' as Position,
      targetPosition: 'right' as Position,
    }

    setNodes((nds) => [...nds, newNode])
    closeModal()
    console.log(nodes)
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
        setEdges((eds) => eds.filter((e) => e.id !== edge.id))
      }

      edgeReconnectSuccessful.current = true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
      <Button onClick={openModal}>Добавить сonnection</Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Выбрать Connection</ModalHeader>
          <ModalBody>
            <Select
              placeholder="Выбрать тип"
              onChange={(e) => setSelectedLabel(e.target.value)}
            >
              <option value="confluence">Confluence</option>
              <option value="file upload s3">File Upload S3</option>
              <option value="notion">Notion</option>
              <option value="url">URL</option>
              <option value="db">Database</option>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button onClick={addNewConnection} mr={3}>
              Добавить
            </Button>
            <Button onClick={closeModal}>Отмена</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex w="95vw" h="80vh">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodesDraggable={false}
          elementsSelectable={false}
          onReconnectStart={onReconnectStart}
          onReconnect={onReconnect}
          onReconnectEnd={onReconnectEnd}
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
