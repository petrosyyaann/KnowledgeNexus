import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react'
import {
  BackendNode,
  PdfParser,
  Ocr,
  Asr,
  TxtParser,
  Notion,
  Confluence,
  Db,
  Url,
  S3,
  Clap,
  Clip,
  RagChunker,
  RagEmbedder,
  RagLLMQa,
} from '../types'
import FormField from './FormField'
import { UploadFiles } from './UploadFiles'

interface NodeModalProps {
  isOpen: boolean
  onClose: () => void
  node: BackendNode
  onSave: (updatedNode: BackendNode) => void
}

const NodeModal = ({ isOpen, onClose, node, onSave }: NodeModalProps) => {
  const [data, setData] = useState(node.data)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (key: keyof typeof data, value: any) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const renderFields = () => {
    switch (node.label) {
      case 'pdf_parser':
        return (
          <FormField
            label="Max Symbols"
            value={(data as PdfParser).max_symbols || ''}
            onChange={(value) =>
              handleChange('max_symbols' as keyof typeof data, value)
            }
            type="number"
          />
        )
      case 'ocr':
        return (
          <>
            <FormField
              label="Endpoint URL"
              value={(data as Asr).endpoint_url || ''}
              onChange={(value) =>
                handleChange('endpoint_url' as keyof typeof data, value)
              }
            />
            <FormField
              label="Headers"
              value={(data as Asr).headers || ''}
              onChange={(value) =>
                handleChange('headers' as keyof typeof data, value)
              }
            />
            <FormField
              label="Max Symbols"
              value={(data as Asr).max_symbols || ''}
              onChange={(value) =>
                handleChange('max_symbols' as keyof typeof data, value)
              }
              type="number"
            />
          </>
        )
      case 'asr':
        return (
          <>
            <FormField
              label="Endpoint URL"
              value={(data as Ocr).endpoint_url || ''}
              onChange={(value) =>
                handleChange('endpoint_url' as keyof typeof data, value)
              }
            />
            <FormField
              label="Headers"
              value={(data as Ocr).headers || ''}
              onChange={(value) =>
                handleChange('headers' as keyof typeof data, value)
              }
            />
            <FormField
              label="Max Symbols"
              value={(data as Ocr).max_symbols || ''}
              onChange={(value) =>
                handleChange('max_symbols' as keyof typeof data, value)
              }
              type="number"
            />
          </>
        )
      case 'txt_parser':
        return (
          <FormField
            label="Max Symbols"
            value={(data as TxtParser).max_symbols || ''}
            onChange={(value) =>
              handleChange('max_symbols' as keyof typeof data, value)
            }
            type="number"
          />
        )
      case 'notion':
        return (
          <>
            <FormField
              label="URL"
              value={(data as Notion).url || ''}
              onChange={(value) =>
                handleChange('url' as keyof typeof data, value)
              }
            />
            <FormField
              label="API Key"
              value={(data as Notion).api_key || ''}
              onChange={(value) =>
                handleChange('api_key' as keyof typeof data, value)
              }
            />
            <FormField
              label="User Space"
              value={(data as Notion).user_space || ''}
              onChange={(value) =>
                handleChange('user_space' as keyof typeof data, value)
              }
            />
          </>
        )
      case 'confluence':
        return (
          <>
            <FormField
              label="URL"
              value={(data as Confluence).url || ''}
              onChange={(value) =>
                handleChange('url' as keyof typeof data, value)
              }
            />
            <FormField
              label="API Token"
              value={(data as Confluence).api_token || ''}
              onChange={(value) =>
                handleChange('api_token' as keyof typeof data, value)
              }
            />
            <FormField
              label="Email"
              value={(data as Confluence).email || ''}
              onChange={(value) =>
                handleChange('email' as keyof typeof data, value)
              }
            />
          </>
        )
      case 'db':
        return (
          <>
            <FormField
              label="DB Port"
              value={(data as Db).db_port || ''}
              onChange={(value) =>
                handleChange('db_port' as keyof typeof data, value)
              }
              type="number"
            />
            <FormField
              label="DB Username"
              value={(data as Db).db_username || ''}
              onChange={(value) =>
                handleChange('db_username' as keyof typeof data, value)
              }
            />
            <FormField
              label="DB Password"
              value={(data as Db).db_password || ''}
              onChange={(value) =>
                handleChange('db_password' as keyof typeof data, value)
              }
            />
            <FormField
              label="DB Type"
              value={(data as Db).db_type || ''}
              onChange={(value) =>
                handleChange('db_type' as keyof typeof data, value)
              }
              type="select"
              options={['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite']} // Пример типов БД
            />
            <FormField
              label="DB Address"
              value={(data as Db).db_address || ''}
              onChange={(value) =>
                handleChange('db_address' as keyof typeof data, value)
              }
            />
            <FormField
              label="SQL Query"
              value={(data as Db).sql_query || ''}
              onChange={(value) =>
                handleChange('sql_query' as keyof typeof data, value)
              }
            />
          </>
        )
      case 'url':
        return (
          <>
            <FormField
              label="URL"
              value={(data as Url).url || ''}
              onChange={(value) =>
                handleChange('url' as keyof typeof data, value)
              }
            />
            <FormField
              label="Search Depth"
              value={(data as Url).search_depth || ''}
              onChange={(value) =>
                handleChange('search_depth' as keyof typeof data, value)
              }
              type="number"
            />
          </>
        )
      case 's3':
        return (
          <UploadFiles
            value={(data as S3).s3_path}
            onChange={(value) =>
              handleChange('s3_path' as keyof typeof data, value)
            }
          />
        )
      case 'clip':
        return (
          <FormField
            label="URL"
            value={(data as Clip).url || ''}
            onChange={(value) =>
              handleChange('url' as keyof typeof data, value)
            }
          />
        )

      case 'clap':
        return (
          <FormField
            label="URL"
            value={(data as Clap).url || ''}
            onChange={(value) =>
              handleChange('url' as keyof typeof data, value)
            }
          />
        )

      case 'chunker':
        return (
          <>
            <FormField
              label="Chunk Size"
              value={(data as RagChunker).chunk_size.toString() || ''}
              onChange={(value) =>
                handleChange(
                  'chunk_size' as keyof typeof data,
                  typeof value !== 'object' ? parseInt(String(value), 10) : 500
                )
              }
            />
            <FormField
              label="Chunk Overlap"
              value={(data as RagChunker).chunk_overlap.toString() || ''}
              onChange={(value) =>
                handleChange(
                  'chunk_overlap' as keyof typeof data,
                  typeof value !== 'object' ? parseInt(String(value), 10) : 50
                )
              }
            />
          </>
        )

      case 'embedder':
        return (
          <>
            <FormField
              label="URL"
              value={(data as RagEmbedder).url || ''}
              onChange={(value) =>
                handleChange('url' as keyof typeof data, value)
              }
            />
            <FormField
              label="Modal Name"
              value={(data as RagEmbedder).modal_name || ''}
              onChange={(value) =>
                handleChange('modal_name' as keyof typeof data, value)
              }
            />
            <FormField
              label="Headers"
              value={(data as RagEmbedder).headers || ''}
              onChange={(value) =>
                handleChange('headers' as keyof typeof data, value)
              }
            />
          </>
        )

      case 'llm_qa':
        return (
          <>
            <FormField
              label="URL"
              value={(data as RagLLMQa).url || ''}
              onChange={(value) =>
                handleChange('url' as keyof typeof data, value)
              }
            />
            <FormField
              label="Modal Name"
              value={(data as RagLLMQa).modal_name || ''}
              onChange={(value) =>
                handleChange('modal_name' as keyof typeof data, value)
              }
            />
            <FormField
              label="API Token"
              value={(data as RagLLMQa).api_token || ''}
              onChange={(value) =>
                handleChange('api_token' as keyof typeof data, value)
              }
            />
            <FormField
              label="Headers"
              value={(data as RagLLMQa).headers || ''}
              onChange={(value) =>
                handleChange('headers' as keyof typeof data, value)
              }
            />
            <FormField
              label="RAG N"
              value={(data as RagLLMQa).rag_n || ''}
              onChange={(value) =>
                handleChange('rag_n' as keyof typeof data, value)
              }
            />
            <FormField
              label="Use Additional Instruction"
              value={(data as RagLLMQa).use_additional_instruction.toString()}
              type="checkbox"
              onChange={(value) =>
                handleChange(
                  'use_additional_instruction' as keyof typeof data,
                  value === 'true'
                )
              }
            />
            <FormField
              label="Additional Instruction"
              value={(data as RagLLMQa).additional_instruction || ''}
              onChange={(value) =>
                handleChange(
                  'additional_instruction' as keyof typeof data,
                  value
                )
              }
            />
            <FormField
              label="Prompt Template"
              value={(data as RagLLMQa).prompt_template || ''}
              onChange={(value) =>
                handleChange('prompt_template' as keyof typeof data, value)
              }
            />
          </>
        )
      default:
        return <div>Поля для узла отсутствуют</div>
    }
  }

  const handleSave = () => {
    onSave({ ...node, data })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Редактирование узла: {node.label}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{renderFields()}</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSave}>
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default NodeModal
