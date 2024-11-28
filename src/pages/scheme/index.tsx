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
  NodeChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Button, ContainerApp, Flex } from 'shared/ui'
import { AddNodeModal } from './modal/AddNodeModal'
import { defaultData, BackendNode, startData } from './types'
import NodeModal from './modal/NodeModal'
import { transformBackendDataToFlow } from './lib/transformBackendDataToFlow'
import {
  getWorkflowSettings,
  postWorkflow,
  putWorkflowSettings,
} from 'entities/workflow/api'
import { useToast } from '@chakra-ui/react'
import {
  transformFlowToBackendData,
  filterNodes,
} from './lib/transformFlowToBackendData'
import { useParams } from 'react-router-dom'

const generatePosition = (x: number, yIndex: number) => ({
  x,
  y: 100 + yIndex * 80,
})

const Home = () => {
  const toast = useToast()
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'connection' | 'transform'>(
    'connection'
  )
  const [selectedLabel, setSelectedLabel] = useState('')
  const edgeReconnectSuccessful = useRef(true)
  const [selectedNode, setSelectedNode] = useState<BackendNode | null>(null)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const { id } = useParams<{ id?: string }>()

  const openEditModal = (node: BackendNode) => {
    setSelectedNode(node)
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setSelectedNode(null)
  }

  const handleNodeSave = (updatedNode: BackendNode) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === updatedNode.id
          ? {
              ...updatedNode,
              data: { ...updatedNode.data, label: updatedNode.label },
              position: node.position,
            }
          : node
      )
    )
  }
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await getWorkflowSettings(Number(id))
          const { nodes, edges } = transformBackendDataToFlow(response.data)
          setNodes(nodes)
          setEdges(edges)
        } catch (err) {
          console.warn('Ошибка загрузки данных с сервера', err)
        }
      } else if (startData) {
        const { nodes, edges } = transformBackendDataToFlow(startData)
        setNodes(nodes)
        setEdges(edges)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, startData])

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
        handleSectionConnections(connection)
        setEdges((eds) => addEdge(connection, eds))
      } else {
        toast({
          position: 'bottom-right',
          title: 'Ошибка',
          description: 'Недопустимое соединение!',
          status: 'error',
          duration: 9000,
          isClosable: true,
          variant: 'top-accent',
        })
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
      toast({
        position: 'bottom-right',
        title: 'Ошибка',
        description: 'Заполните все поля!',
        status: 'error',
        duration: 9000,
        isClosable: true,
        variant: 'top-accent',
      })
      return
    }

    if (modalType === 'connection') {
      const newId = `connection-${nodes.length + 1}`
      const newNode = {
        id: newId,
        type: 'default',
        label: selectedLabel,
        data: {
          label: selectedLabel,
          ...defaultData.filter((value) => value.label === selectedLabel)[0]
            .data,
        },
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
        data: {
          label: selectedLabel,
          ...defaultData.filter((value) => value.label === selectedLabel)[0]
            .data,
        },
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
    if (node.id.includes('section') || node.id.includes('RAG')) {
      toast({
        position: 'bottom-right',
        title: 'Ошибка',
        description: 'Удаление узлов section или RAG запрещено!',
        status: 'error',
        duration: 9000,
        isClosable: true,
        variant: 'top-accent',
      })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, onNodesChange]
  )

  const saveConnections = () => {
    const updatedBackendData = filterNodes(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      transformFlowToBackendData(nodes).map((node) => ({
        ...node,
        connections: edges
          .filter((edge) => edge.source === node.id)
          .map((edge) => edge.target),
      }))
    )

    const saveAction = id
      ? putWorkflowSettings(updatedBackendData)
      : postWorkflow(updatedBackendData)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    saveAction
      .then(() => {
        toast({
          position: 'bottom-right',
          title: 'Успешно!',
          description: `Загрузка успешна`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          variant: 'top-accent',
        })
      })
      .catch((error: { response: { statusText: string } }) => {
        console.log(error)
        toast({
          position: 'bottom-right',
          title: 'Ошибка',
          description: error && error.response.statusText,
          status: 'error',
          duration: 9000,
          isClosable: true,
          variant: 'top-accent',
        })
      })
    console.log('Saving connections:', updatedBackendData)
  }

  return (
    <ContainerApp>
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
      {selectedNode && (
        <NodeModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          node={selectedNode!}
          onSave={(data) => handleNodeSave(data)}
        />
      )}
      <Flex w="100%" h="100%">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => {
            const backendNode = nodes
              .filter((n) => !n.id.includes('section'))
              .find((n) => n.id === node.id)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (backendNode) openEditModal(backendNode)
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
      <Button onClick={saveConnections}>Сохранить и обработать</Button>
    </ContainerApp>
  )
}

export default Home
