import { useState, useEffect } from 'react'
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Text,
} from '@chakra-ui/react'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Box, Button, ContainerApp, Flex } from 'shared/ui'
import { useNavigate } from 'react-router-dom'
import { deleteWorkflowSettings, getAllWorkflows } from 'entities/workflow/api'
import { CustomModal } from './Modal'

// Цвета состояний
const stateColors: Record<string, string> = {
  Обработано: '#F4FCE3',
  'В процессе': '#FFF9DB',
  Ошибка: '#FFEAF7',
}
const borderStateColors: Record<string, string> = {
  Обработано: '#A9E34B',
  'В процессе': '#FFD43B',
  Ошибка: '#F179C1',
}

interface KnowledgeBase {
  id: number
  name: string
  status: string
  style_settings: {
    title: string
    theme_colour: string
    icon_url: string
    style_css: string
  }
  host_permissions: {
    domens: string[]
    ipaddress: string[]
  }
}

const KnowledgeBase = () => {
  const [chat, setChat] = useState(false)
  const [data, setData] = useState<KnowledgeBase[]>([])
  const [dataTable, setDataTable] = useState<KnowledgeBase[]>([])
  const [select, setSelect] = useState<KnowledgeBase>()
  const [update, setUpdate] = useState<boolean>()
  const navigate = useNavigate()

  // Удаление базы знаний
  const deleteBase = async (name: string) => {
    try {
      const item = data.find((base) => base.name === name)
      if (!item) {
        console.error('Элемент не найден')
        return
      }
      console.log(item.id)
      const response = await deleteWorkflowSettings(item.id)
      console.log(response)
      setUpdate((prev) => !prev)
    } catch (error) {
      console.error('Ошибка при удалении:', error)
    }
  }

  // Колонки таблицы
  const columnHelper = createColumnHelper<KnowledgeBase>()

  const { isOpen, onClose, onOpen } = useDisclosure()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllWorkflows()
        setData(response.data)
        const transformedData: KnowledgeBase[] = response.data.map(
          (workflow: {
            id: number
            name: string
            status: string
            style_settings: {
              title: string
              theme_colour: string
              icon_url: string
              style_css: string
            }
            host_permissions: {
              domens: string[]
              ipaddress: string[]
            }
          }) => ({
            name: workflow.name,
            status:
              workflow.status === 'completed'
                ? 'Обработано'
                : workflow.status === 'in_progress'
                  ? 'В процессе'
                  : 'Ошибка',
            themeColour: workflow.style_settings.theme_colour,
            domains: workflow.host_permissions.domens,
            ipAddresses: workflow.host_permissions.ipaddress,
          })
        )
        setDataTable(transformedData)
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
      }
    }
    fetchData()
  }, [update])

  const columns = [
    columnHelper.accessor('name', {
      header: 'Название',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Состояние',
      cell: (info) => (
        <Box
          fontWeight={600}
          bg={stateColors[info.getValue()]}
          color="#373645"
          border={`1px solid ${borderStateColors[info.getValue()]}`}
          px={2}
          py={1}
          w="-webkit-fit-content"
          borderRadius="20px"
          textAlign="center"
        >
          {info.getValue()}
        </Box>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Действия',
      cell: (info) => (
        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            color="#7984F1"
            fontSize="16px"
            variant="transparent"
            size="sm"
            onClick={(event) => {
              event.stopPropagation()
              setSelect(
                data.filter((i) => i.name === info.row.original.name)[0]
              )
              onOpen()
            }}
          >
            Настройка чата
          </Button>
          <Button
            fontSize="16px"
            color="#F179C1"
            variant="transparent"
            size="sm"
            onClick={(event) => {
              event.stopPropagation()
              setUpdate((prev) => !prev)
              deleteBase(info.row.original.name)
            }}
          >
            Удалить
          </Button>
        </Box>
      ),
    }),
  ]

  const table = useReactTable({
    data: dataTable,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <ContainerApp>
      <Flex px={5} w="100%" alignItems="center" justifyContent="space-between">
        <Text fontSize={25} fontWeight={700}>
          Базы знаний
        </Text>
        <Button background="blue.500" m={4} onClick={() => navigate('/scheme')}>
          Создать базу знаний
        </Button>
      </Flex>
      <Table variant="simple">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>
                  <Flex
                    justifyContent={
                      header.column.columnDef.header === 'Действия'
                        ? 'flex-end'
                        : ''
                    }
                  >
                    {typeof header.column.columnDef.header === 'function'
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td
                  key={cell.id}
                  onClick={() => {
                    const name = row.original.name
                    navigate(
                      `/scheme/${data.filter((i) => i.name === name)[0].id}`
                    )
                  }}
                >
                  {typeof cell.column.columnDef.cell === 'function'
                    ? cell.column.columnDef.cell(cell.getContext())
                    : cell.getValue()}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {select && (
        <CustomModal
          isOpen={isOpen}
          chat={chat}
          setChat={setChat}
          onClose={() => {
            onClose()
            setChat(false)
          }}
          workflowData={select}
        />
      )}
    </ContainerApp>
  )
}

export default KnowledgeBase
