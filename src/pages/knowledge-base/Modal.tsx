import { useState, useEffect } from 'react'
import {
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Code,
  Box,
  useToast,
} from '@chakra-ui/react'
import { Button, Input, Textarea, Text, Flex } from 'shared/ui'
import { putWorkflowAgentSettings } from 'entities/workflow/api'
import ChatWidget from './ChatWidget'

export const CustomModal = ({
  isOpen,
  onClose,
  workflowData,
  chat,
  setChat,
}: {
  isOpen: boolean
  onClose: () => void
  chat: boolean
  setChat: (chat: boolean) => void
  workflowData: {
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
  } | null
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const toast = useToast()

  // Поля ввода
  const [title, setTitle] = useState('Мой чат')
  const [color, setColor] = useState('#007bff')
  const [iconUrl, setIconUrl] = useState('')
  const [customCss, setCustomCss] = useState('')
  const [domains, setDomains] = useState('')
  const [ips, setIps] = useState('')

  // Инициализация значений из пропсов
  useEffect(() => {
    if (workflowData) {
      const { style_settings, host_permissions } = workflowData
      setTitle(style_settings.title || 'Мой чат')
      setColor(style_settings.theme_colour || '#007bff')
      setIconUrl(style_settings.icon_url || '')
      setCustomCss(style_settings.style_css || '')
      setDomains(host_permissions.domens.join(', '))
      setIps(host_permissions.ipaddress.join(', '))
    }
  }, [workflowData])

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
    return `<script src="https://msk.lab260.ru:208080/chat-widget.js"></script>
<script>
  window.createChatWidget({
    apiUrl: 'http://msk.lab260.ru:8000/api/v1/query/workflow/${workflowData ? workflowData.id : 1}',
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
      toast({
        position: 'bottom-right',
        title: 'Ошибка',
        description: 'Пожалуйста, исправьте ошибки перед копированием',
        status: 'error',
        duration: 9000,
        isClosable: true,
        variant: 'top-accent',
      })
      return
    }
    navigator.clipboard.writeText(generateCode())
  }

  const handleSave = async () => {
    if (!validate()) {
      toast({
        position: 'bottom-right',
        title: 'Ошибка',
        description: 'Пожалуйста, исправьте ошибки перед сохранением',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      return
    }

    try {
      await putWorkflowAgentSettings(
        workflowData?.id || 1,
        title,
        color,
        iconUrl,
        customCss,
        domains.split(',').map((d) => d.trim()),
        ips.split(',').map((ip) => ip.trim())
      )

      toast({
        position: 'bottom-right',
        title: 'Успех',
        description: 'Настройки успешно сохранены',
        status: 'success',
        duration: 5000,
        isClosable: true,
        variant: 'top-accent',
      })
      onClose()
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error)
      toast({
        position: 'bottom-right',
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки',
        status: 'error',
        duration: 9000,
        isClosable: true,
        variant: 'top-accent',
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Text fontSize={20} fontWeight={700}>
            Настройка виджета чата
          </Text>
          <Flex direction="row" gap="15px">
            <Flex direction="column" minW="500px">
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
            </Flex>
            <Flex direction="column" w="100%" alignItems="flex-end">
              {/* Отображение сгенерированного кода */}
              <Text mt={4}>Сгенерированный код для вставки:</Text>
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
            </Flex>
          </Flex>
          {isOpen && workflowData && chat && (
            <ChatWidget
              chat={chat}
              id={workflowData.id}
              title={title}
              color={color}
              iconUrl={iconUrl}
              customCss={customCss}
              domains={domains}
              ips={ips}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button mr={4} onClick={handleSave}>
            Сохранить
          </Button>
          <Button mr={4} onClick={handleCopy}>
            Скопировать код
          </Button>
          <Button onClick={() => setChat(true)}>Демонстрация</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
