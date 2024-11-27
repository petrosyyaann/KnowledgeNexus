import { useState } from 'react'
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

// Тип данных для строки
type KnowledgeBaseRow = {
  name: string
  state: 'готово' | 'процесс' | 'ошибка'
}

// Пример данных
const initialData: KnowledgeBaseRow[] = [
  { name: 'База 1', state: 'готово' },
  { name: 'База 2', state: 'процесс' },
  { name: 'База 3', state: 'ошибка' },
]

// Цвета состояний
const stateColors: Record<string, string> = {
  готово: 'green.400',
  процесс: 'yellow.400',
  ошибка: 'red.400',
}

const KnowledgeBase = () => {
  const [data, setData] = useState(initialData)
  const navigate = useNavigate()

  // Управление модалками
  const { isOpen, onClose, onOpen } = useDisclosure()

  // Удаление базы знаний
  const deleteBase = (name: string) => {
    setData(data.filter((base) => base.name !== name))
  }

  // Колонки таблицы
  const columnHelper = createColumnHelper<KnowledgeBaseRow>()
  const columns = [
    columnHelper.accessor('name', {
      header: 'Название',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('state', {
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
              onOpen()
            }}
          >
            Настройка чата
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => deleteBase(info.row.original.name)}
          >
            Удалить
          </Button>
        </Box>
      ),
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Box p={4} w="100%">
      <Table variant="simple" w="100%">
        <Thead w="100%">
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} w="100%">
                  {typeof header.column.columnDef.header === 'function'
                    ? header.column.columnDef.header(header.getContext())
                    : header.column.columnDef.header}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody w="100%">
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id} w="100%">
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id} onClick={() => navigate('/scheme')} w="100%">
                  {typeof cell.column.columnDef.cell === 'function'
                    ? cell.column.columnDef.cell(cell.getContext())
                    : cell.getValue()}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>

      <CustomModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default KnowledgeBase
