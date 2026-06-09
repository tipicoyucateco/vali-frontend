<template>
  <div class="flex flex-col h-screen bg-[#efeae2]">
    <!-- Header -->
    <header class="bg-[#008069] text-white shadow-md">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-semibold">Claude AI</h1>
              <p class="text-xs text-[#d1f4cc]">{{ modelName }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="clearChat"
              class="hover:bg-[#017561] p-2 rounded-full transition-colors duration-200"
              title="Limpiar chat"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Chat Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto container mx-auto px-4 py-6">
      <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
        <div class="text-center text-[#667781]">
          <div class="w-32 h-32 mx-auto mb-6 rounded-full bg-[#008069]/10 flex items-center justify-center">
            <svg class="w-16 h-16 text-[#008069]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
            </svg>
          </div>
          <p class="text-xl font-medium text-[#111b21]">Comienza una conversación con Claude</p>
          <p class="text-sm mt-2">Escribe tu mensaje abajo para comenzar</p>
        </div>
      </div>

      <div v-else class="space-y-4 max-w-4xl mx-auto">
        <ChatMessage
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
        />

        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex items-start space-x-3">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-[#008069] flex items-center justify-center shadow-md">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
            </svg>
          </div>
          <div class="flex-1 bg-white rounded-lg shadow-sm p-4 max-w-md">
            <div class="flex space-x-2">
              <div class="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-[#8696a0] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="bg-[#f0f2f5] shadow-lg">
      <div class="container mx-auto px-4 py-3">
        <form @submit.prevent="sendMessage" class="max-w-4xl mx-auto">
          <!-- File Previews (Images) -->
          <div v-if="attachments.length > 0" class="mb-3 flex flex-wrap gap-2">
            <div v-for="(file, index) in attachments" :key="index"
                 class="relative bg-white rounded-lg p-2 shadow-sm flex items-center space-x-2 max-w-xs">
              <!-- Image Preview -->
              <img :src="file.preview" class="w-12 h-12 object-cover rounded" />
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-900 truncate">{{ file.name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
              </div>
              <button @click="removeAttachment(index)" type="button"
                      class="text-gray-400 hover:text-red-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-end space-x-3">
            <!-- File Upload Button -->
            <div class="relative">
              <input type="file" ref="fileInput" @change="handleFileSelect"
                     accept="image/*" multiple class="hidden" />
              <button type="button" @click="$refs.fileInput.click()"
                      :disabled="isLoading"
                      class="w-12 h-12 bg-white text-[#8696a0] rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-sm">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                </svg>
              </button>
            </div>

            <div class="flex-1 relative">
              <textarea
                v-model="userInput"
                @keydown.enter.exact.prevent="sendMessage"
                :disabled="isLoading"
                placeholder="Escribe un mensaje"
                class="w-full px-4 py-3 pr-12 bg-white border-none rounded-full focus:ring-0 resize-none transition-all duration-200 shadow-sm"
                :class="{ 'bg-gray-100 cursor-not-allowed': isLoading }"
                rows="1"
                style="min-height: 48px; max-height: 120px;"
              ></textarea>
            </div>
            <button
              type="submit"
              :disabled="(!userInput.trim() && attachments.length === 0) || isLoading"
              class="w-12 h-12 bg-[#008069] text-white rounded-full hover:bg-[#017561] disabled:bg-[#8696a0] disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-md"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>

          <!-- Token Info -->
          <div v-if="lastTokenInfo" class="mt-2 text-xs text-[#667781] flex items-center space-x-4 justify-center">
            <span>Entrada: {{ lastTokenInfo.inputTokens }}</span>
            <span>•</span>
            <span>Salida: {{ lastTokenInfo.outputTokens }}</span>
            <span>•</span>
            <span class="text-[#008069] font-medium">Total: {{ lastTokenInfo.inputTokens + lastTokenInfo.outputTokens }}</span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import axios from 'axios'
import ChatMessage from './ChatMessage.vue'

const API_URL = 'http://localhost:3000/claude/ask'
const modelName = 'Claude 3 Haiku'

const messages = ref([])
const userInput = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)
const lastTokenInfo = ref(null)
const attachments = ref([])
const fileInput = ref(null)

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files)

  for (const file of files) {
    // Validate file type (only images)
    const isImage = file.type.startsWith('image/')

    if (!isImage) {
      alert(`Archivo no soportado: ${file.name}. Solo se permiten imágenes (PNG, JPG, GIF, WebP).`)
      continue
    }

    // Validate file size (max 4MB for images)
    const maxSize = 4 * 1024 * 1024
    if (file.size > maxSize) {
      alert(`El archivo ${file.name} es muy grande. Máximo 4MB.`)
      continue
    }

    try {
      const base64 = await fileToBase64(file)
      const preview = `data:${file.type};base64,${base64}`

      attachments.value.push({
        type: 'image',
        data: base64,
        mimeType: file.type,
        name: file.name,
        size: file.size,
        preview: preview
      })
    } catch (error) {
      console.error('Error processing file:', error)
      alert(`Error al procesar ${file.name}`)
    }
  }

  // Reset input
  event.target.value = ''
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const removeAttachment = (index) => {
  attachments.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const sendMessage = async () => {
  if ((!userInput.value.trim() && attachments.value.length === 0) || isLoading.value) return

  const question = userInput.value || 'Por favor analiza los archivos adjuntos'
  const userMessage = {
    role: 'user',
    content: userInput.value,
    attachments: [...attachments.value],
    timestamp: new Date().toLocaleTimeString()
  }

  messages.value.push(userMessage)

  const requestAttachments = attachments.value.map(att => ({
    type: att.type,
    data: att.data,
    mimeType: att.mimeType,
    name: att.name
  }))

  userInput.value = ''
  attachments.value = []
  isLoading.value = true

  await nextTick()
  scrollToBottom()

  try {
    const response = await axios.post(API_URL, {
      question,
      temperature: 0.7,
      maxTokens: 2048,
      attachments: requestAttachments
    })

    const assistantMessage = {
      role: 'assistant',
      content: response.data.answer,
      timestamp: new Date().toLocaleTimeString()
    }

    messages.value.push(assistantMessage)

    lastTokenInfo.value = {
      inputTokens: response.data.inputTokens,
      outputTokens: response.data.outputTokens
    }

    await nextTick()
    scrollToBottom()

  } catch (error) {
    console.error('Error sending message:', error)

    const errorMessage = {
      role: 'error',
      content: `Error: ${error.response?.data?.message || error.message || 'No se pudo obtener respuesta de Claude'}`,
      timestamp: new Date().toLocaleTimeString()
    }

    messages.value.push(errorMessage)
    await nextTick()
    scrollToBottom()

  } finally {
    isLoading.value = false
  }
}

const clearChat = () => {
  if (confirm('¿Estás seguro de que quieres limpiar el historial del chat?')) {
    messages.value = []
    lastTokenInfo.value = null
    attachments.value = []
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>
