;(function () {
  class ChatWidget {
    constructor(config) {
      this.apiUrl = config.apiUrl
      this.title = config.title || 'Chat Widget'
      this.themeColor = (config.theme && config.theme.color) || '#007bff'
      this.customCss = config.customCss || ''
      this.iconUrl = config.iconUrl
      this.minimized = false

      this.container = document.createElement('div')
      document.body.appendChild(this.container)

      this.createWidget()
      this.addCustomStyles()
      this.createIconButton()
    }

    createWidget() {
      this.container.innerHTML = `
          <div class="chat-widget-container" style="
            position: fixed; 
            bottom: 20px; 
            right: 20px; 
            z-index: 9999; 
            border-radius: 15px; 
            width: 320px; 
            font-family: Arial, sans-serif; 
            overflow: hidden; 
            background: white; 
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            border: none;
          ">
            <div class="chat-widget-header" style="
              display: flex; 
              align-items: center; 
              justify-content: space-between;
              background-color: ${this.themeColor}; 
              padding: 15px; 
              color: white;
              font-size: 16px;
              font-weight: bold;
            ">
              <div style="display: flex; align-items: center;">
                ${
                  this.iconUrl
                    ? `<img src="${this.iconUrl}" alt="Chat Icon" style="
                      width: 28px; 
                      height: 28px; 
                      margin-right: 10px;
                      border-radius: 50%;
                      border: 2px solid white;">`
                    : ''
                }
                <span>${this.title}</span>
              </div>
              <button class="chat-widget-close-button" style="
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;">&times;</button>
            </div>
            <div class="chat-widget-messages" style="
              max-height: 400px; 
              overflow-y: auto; 
              padding: 15px; 
              background: #f8f9fa; 
              display: flex; 
              flex-direction: column;
              gap: 10px;">
            </div>
            <div class="chat-widget-input-container" style="
              display: flex; 
              padding: 10px; 
              background: white; 
              border-top: 1px solid #ddd;">
              <input class="chat-widget-input" type="text" placeholder="Введите сообщение..." style="
                flex: 1; 
                padding: 10px; 
                border: 1px solid #ddd; 
                border-radius: 20px; 
                outline: none;
                font-size: 14px;">
              <button class="chat-widget-send-button" style="
                margin-left: 10px; 
                background-color: ${this.themeColor}; 
                color: white; 
                border: none; 
                border-radius: 50%; 
                width: 40px; 
                height: 40px; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                cursor: pointer;
                font-size: 16px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                &#9658;
              </button>
            </div>
          </div>
        `

      this.messagesContainer = this.container.querySelector(
        '.chat-widget-messages'
      )
      this.inputField = this.container.querySelector('.chat-widget-input')
      this.sendButton = this.container.querySelector('.chat-widget-send-button')
      const closeButton = this.container.querySelector(
        '.chat-widget-close-button'
      )

      if (this.sendButton) {
        this.sendButton.addEventListener('click', () => this.handleSend())
      }

      if (this.inputField) {
        this.inputField.addEventListener('keypress', (event) => {
          if (event.key === 'Enter') {
            this.handleSend()
          }
        })
      }

      if (closeButton) {
        closeButton.addEventListener('click', () => this.toggleMinimize())
      }
    }

    createIconButton() {
      this.iconButton = document.createElement('div')
      this.iconButton.style = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: ${this.themeColor};
          display: none;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 9999;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        `
      this.iconButton.innerHTML = `<span style="font-size: 24px; color: #fff;">🔍</span>`
      document.body.appendChild(this.iconButton)

      this.iconButton.addEventListener('click', () => this.toggleMinimize())
    }

    handleSend() {
      const message = this.inputField.value.trim()
      if (!message) return

      this.addMessage('user', message)
      this.inputField.value = ''
      this.loading = true
      this.updateSendButton()

      // Simulate API response for testing
      setTimeout(() => {
        this.addMessage(
          'bot',
          'Если подождешь, будет ответ на вопрос, где-то дня полтора подождать'
        )
        this.loading = false
        this.updateSendButton()
      }, 1000)
    }

    addMessage(sender, text) {
      const messageDiv = document.createElement('div')
      messageDiv.classList.add('chat-widget-message')
      messageDiv.style.display = 'flex'
      messageDiv.style.justifyContent =
        sender === 'user' ? 'flex-end' : 'flex-start'
      messageDiv.style.marginBottom = '10px'

      const messageText = document.createElement('span')
      messageText.textContent = text
      messageText.style.display = 'inline-block'
      messageText.style.padding = '10px 15px'
      messageText.style.borderRadius = '20px'
      messageText.style.maxWidth = '70%'
      messageText.style.wordWrap = 'break-word'
      messageText.style.backgroundColor =
        sender === 'user' ? this.themeColor : '#e9ecef'
      messageText.style.color = sender === 'user' ? '#fff' : '#333'

      messageDiv.appendChild(messageText)
      this.messagesContainer.appendChild(messageDiv)
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight
    }

    updateSendButton() {
      this.sendButton.disabled = this.loading
      this.sendButton.innerHTML = this.loading ? '⏳' : '&#9658;'
    }

    toggleMinimize() {
      this.minimized = !this.minimized
      if (this.minimized) {
        this.container.style.display = 'none'
        this.iconButton.style.display = 'flex'
      } else {
        this.container.style.display = 'block'
        this.iconButton.style.display = 'none'
      }
    }

    addCustomStyles() {
      if (this.customCss) {
        const styleTag = document.createElement('style')
        styleTag.innerHTML = this.customCss
        document.head.appendChild(styleTag)

        this.container.addEventListener('DOMNodeRemoved', () => {
          document.head.removeChild(styleTag)
        })
      }
    }
  }

  window.createChatWidget = function (config) {
    new ChatWidget(config)
  }
})()
