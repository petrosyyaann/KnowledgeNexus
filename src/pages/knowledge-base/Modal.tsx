import { useState } from 'react'
import {
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Code,
  Box,
} from '@chakra-ui/react'
import { Button, Input, Textarea, Text } from 'shared/ui'

export const CustomModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Состояния для полей ввода
  const [title, setTitle] = useState('Мой чат')
  const [color, setColor] = useState('#007bff')
  const [iconUrl, setIconUrl] = useState('')
  const [customCss, setCustomCss] = useState('')
  const [domains, setDomains] = useState('') // Ограничение по доменам
  const [ips, setIps] = useState('') // Ограничение по IP

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) newErrors.title = 'Заголовок чата обязателен'
    if (color && !/^#([0-9A-F]{3}){1,2}$/i.test(color))
      newErrors.color =
        'Цвет темы должен быть в формате HEX (например, #007bff)'
    if (iconUrl && !/^https?:\/\/[^\s]+$/.test(iconUrl))
      newErrors.iconUrl = 'URL иконки должен быть валидным'
    if (
      domains &&
      !domains
        .split(',')
        .every((d) => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(d.trim()))
    )
      newErrors.domains = 'Некорректный формат доменов (пример: example.com)'
    if (
      ips &&
      !ips
        .split(',')
        .every((ip) =>
          /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.([0-9]{1,3}\.){2}[0-9]{1,3}$/.test(
            ip.trim()
          )
        )
    )
      newErrors.ips = 'Некорректный формат IP (пример: 192.168.1.1)'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateCode = () => {
    return `<script src="http://localhost:8000/chat-widget.js"></script>
<script>
  window.createChatWidget({
    apiUrl: 'БЕК ДОЛЖЕН ВЫДАТЬ',
    title: '${title}',
    theme: { color: '${color}' },
    iconUrl: '${iconUrl}',
    customCss: \`${customCss}\`,
    allowedDomains: [${domains
      .split(',')
      .map((domain) => `'${domain.trim()}'`)
      .join(', ')}],
    allowedIps: [${ips
      .split(',')
      .map((ip) => `'${ip.trim()}'`)
      .join(', ')}],
  });
</script>`
  }

  const handleCopy = async () => {
    if (!validate()) {
      alert('Пожалуйста, исправьте ошибки перед копированием')
      return
    }
    navigator.clipboard.writeText(generateCode())
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Настройка виджета чата</ModalHeader>
        <ModalBody>
          <FormControl mt={4} isInvalid={!!errors.title}>
            <FormLabel>Заголовок чата</FormLabel>
            <Input
              placeholder="Мой чат"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <Text color="red.500" mt={1}>
                {errors.title}
              </Text>
            )}
          </FormControl>
          <FormControl mt={4} isInvalid={!!errors.title}>
            <FormLabel>Цвет темы</FormLabel>
            <Input
              placeholder="#007bff"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            {errors.title && (
              <Text color="red.500" mt={1}>
                {errors.title}
              </Text>
            )}
          </FormControl>
          <FormControl mt={4} isInvalid={!!errors.title}>
            <FormLabel>Иконка чата (URL)</FormLabel>
            <Input
              placeholder="https://example.com/icon.png"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
            />
            {errors.iconUrl && (
              <Text color="red.500" mt={1}>
                {errors.iconUrl}
              </Text>
            )}
          </FormControl>
          <FormControl mt={4} isInvalid={!!errors.title}>
            <FormLabel>Пользовательский CSS</FormLabel>
            <Textarea
              placeholder="Напишите CSS стили"
              value={customCss}
              onChange={(e) => setCustomCss(e.target.value)}
            />
            {errors.customCss && (
              <Text color="red.500" mt={1}>
                {errors.customCss}
              </Text>
            )}
          </FormControl>

          {/* Ограничения по доменам */}
          <FormControl mt={6}>
            <FormLabel>Ограничения по доменам (через запятую)</FormLabel>
            <Textarea
              placeholder="example.com, mydomain.com"
              value={domains}
              onChange={(e) => setDomains(e.target.value)}
            />
            {errors.domains && (
              <Text color="red.500" mt={1}>
                {errors.domains}
              </Text>
            )}
          </FormControl>

          {/* Ограничения по IP */}
          <FormControl mt={6}>
            <FormLabel>Ограничения по IP-адресам (через запятую)</FormLabel>
            <Textarea
              placeholder="192.168.0.1, 10.0.0.2"
              value={ips}
              onChange={(e) => setIps(e.target.value)}
            />
            {errors.ips && (
              <Text color="red.500" mt={1}>
                {errors.ips}
              </Text>
            )}
          </FormControl>

          {/* Отображение сгенерированного кода */}
          <Text mt={6}>Сгенерированный код для вставки:</Text>
          <Box
            mt={4}
            p={4}
            bg="gray.100"
            borderRadius="md"
            border="1px solid"
            borderColor="gray.300"
          >
            <Code display="block" whiteSpace="pre" overflowX="auto">
              {generateCode()}
            </Code>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button mr={4} onClick={handleCopy}>
            Скопировать код
          </Button>
          <Button onClick={onClose}>Закрыть</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
