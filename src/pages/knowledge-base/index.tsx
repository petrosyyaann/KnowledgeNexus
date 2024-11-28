import { useState, useEffect } from 'react'
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Box, Button } from 'shared/ui'
import { useNavigate } from 'react-router-dom'
import { CustomModal } from './Modal'
import { deleteWorkflowSettings, getAllWorkflows } from 'entities/workflow/api'

// Цвета состояний
const stateColors: Record<string, string> = {
  готово: 'green.400',
  процесс: 'yellow.400',
  ошибка: 'red.400',
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
                ? 'готово'
                : workflow.status === 'in_progress'
                  ? 'процесс'
                  : 'ошибка',
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
          bg={stateColors[info.getValue()]}
          color="white"
          px={2}
          py={1}
          borderRadius="md"
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
        <Box display="flex" gap={2}>
          <Button
            size="sm"
            colorScheme="blue"
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
            size="sm"
            colorScheme="red"
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
    <Box px={5} w="100%">
      <Button m={4} onClick={() => navigate('/scheme')}>
        Создать базу знаний
      </Button>
      <Table variant="simple">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>
                  {' '}
                  {typeof header.column.columnDef.header === 'function'
                    ? header.column.columnDef.header(header.getContext())
                    : header.column.columnDef.header}
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
        <CustomModal isOpen={isOpen} onClose={onClose} workflowData={select} />
      )}
    </Box>
  )
}

export default KnowledgeBase
