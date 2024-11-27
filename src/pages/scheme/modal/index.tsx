import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from '@chakra-ui/react'
import { Button } from 'shared/ui'

interface AddNodeModalProps {
  isOpen: boolean
  onClose: () => void
  modalType: 'connection' | 'transform'
  selectedLabel: string
  setSelectedLabel: (value: string) => void
  onAdd: () => void
}

export const AddNodeModal: React.FC<AddNodeModalProps> = ({
  isOpen,
  onClose,
  modalType,
  selectedLabel,
  setSelectedLabel,
  onAdd,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Выбрать {modalType === 'connection' ? 'Connection' : 'Transform'}
        </ModalHeader>
        <ModalBody>
          <Select
            placeholder="Выбрать тип"
            value={selectedLabel}
            onChange={(e) => setSelectedLabel(e.target.value)}
          >
            {modalType === 'connection' ? (
              <>
                <option value="confluence">Confluence</option>
                <option value="file_upload_s3">File Upload S3</option>
                <option value="notion">Notion</option>
                <option value="url">URL</option>
                <option value="db">Database</option>
              </>
            ) : (
              <>
                <option value="pdf_parser">PDF Parser</option>
                <option value="ocr">OCR</option>
                <option value="ASR">ASR</option>
                <option value="txt_parser">Text Parser</option>
                <option value="clip">CLIP</option>
                <option value="clap">CLAP</option>
              </>
            )}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              onAdd()
              onClose()
            }}
            mr={3}
          >
            Добавить
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
