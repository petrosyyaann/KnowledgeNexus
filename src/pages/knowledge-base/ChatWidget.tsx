import { useEffect } from 'react'

declare global {
  interface Window {
    createChatWidget: (config: {
      apiUrl: string
      title: string
      theme: { color: string }
      iconUrl: string
      customCss: string
      allowedDomains: string[]
      allowedIps: string[]
    }) => void
  }
}

const ChatWidget = ({
  id,
  title,
  color,
  iconUrl,
  customCss,
  domains,
  ips,
  chat,
}: {
  id: number
  title: string
  color: string
  iconUrl: string
  customCss: string
  domains: string
  ips: string
  chat: boolean
}) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'http://45.9.73.91/chat-widget.js'
    script.async = true

    // Функция для удаления виджета
    const cleanUpWidget = () => {
      const chatContainers = document.querySelectorAll('.chat-widget-container')
      chatContainers.forEach((container) => {
        container.remove() // Удаляем контейнер
      })

      // Удаляем скрипт
      const existingScript = document.querySelector(
        `script[src="http://45.9.73.91/chat-widget.js"]`
      )
      if (existingScript) {
        existingScript.remove()
      }
    }

    if (chat) {
      // Если chat = true, добавляем виджет
      const existingChatWidget = document.querySelector(
        '.chat-widget-container'
      )
      if (!existingChatWidget) {
        script.onload = () => {
          if (window.createChatWidget) {
            window.createChatWidget({
              apiUrl: `http://msk.lab260.ru:8000/api/v1/query/workflow/${id || 1}`,
              title,
              theme: { color },
              iconUrl,
              customCss,
              allowedDomains: domains.split(',').map((domain) => domain.trim()),
              allowedIps: ips.split(',').map((ip) => ip.trim()),
            })
          } else {
            console.error('createChatWidget is not defined on window')
          }
        }
        document.body.appendChild(script)
      }
    } else {
      // Если chat = false, удаляем виджет
      cleanUpWidget()
    }

    return () => {
      // Очищаем ресурсы при размонтировании компонента
      cleanUpWidget()
    }
  }, [id, title, color, iconUrl, customCss, domains, ips, chat])

  return null
}

export default ChatWidget
