<template>
  <div class="flex items-start space-x-3"
       :class="{ 'flex-row-reverse space-x-reverse': message.role === 'user' }">

    <!-- Avatar -->
    <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
         :class="avatarClass">
      <svg v-if="message.role === 'user'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
      </svg>
      <svg v-else-if="message.role === 'assistant'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
      </svg>
      <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
    </div>

    <!-- Message Content -->
    <div class="flex-1 max-w-lg">
      <div class="rounded-lg p-3 transition-all duration-200"
           :class="messageClass">
        <!-- Attachments Preview (Images only) -->
        <div v-if="message.attachments && message.attachments.length > 0" class="mb-2 space-y-2">
          <div v-for="(attachment, index) in message.attachments" :key="index">
            <img :src="attachment.preview"
                 :alt="attachment.name"
                 class="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                 @click="openImage(attachment.preview)" />
          </div>
        </div>

        <div class="prose prose-sm max-w-none text-[14px] leading-relaxed" v-html="formattedContent"></div>
        <div class="flex items-center justify-between mt-1">
          <span class="text-[11px]" :class="timeClass">
            {{ message.timestamp }}
          </span>
          <button
            @click="copyToClipboard"
            class="text-xs px-1.5 py-0.5 rounded hover:bg-black/5 transition-colors duration-200 flex items-center space-x-1"
            :class="{ 'text-[#667781]': !copied, 'text-[#008069]': copied }"
          >
            <svg v-if="!copied" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 13l4 4L19 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const copied = ref(false)

const avatarClass = computed(() => {
  if (props.message.role === 'user') {
    return 'bg-[#128C7E]'
  } else if (props.message.role === 'assistant') {
    return 'bg-[#008069]'
  } else {
    return 'bg-[#ea4335]'
  }
})

const messageClass = computed(() => {
  if (props.message.role === 'user') {
    return 'bg-[#d9fdd3] text-[#111b21] shadow-sm rounded-tr-none'
  } else if (props.message.role === 'assistant') {
    return 'bg-white text-[#111b21] shadow-sm rounded-tl-none'
  } else {
    return 'bg-[#fff4e5] text-[#ea4335] border border-[#ffd7a8] shadow-sm'
  }
})

const timeClass = computed(() => {
  if (props.message.role === 'user') {
    return 'text-[#667781]'
  } else if (props.message.role === 'assistant') {
    return 'text-[#667781]'
  } else {
    return 'text-[#ea4335]'
  }
})

const formattedContent = computed(() => {
  let content = props.message.content

  // Convert markdown-style code blocks to HTML
  content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-[#1e2a2e] text-[#d1d7db] rounded-md p-3 my-2 overflow-x-auto text-[13px]"><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`
  })

  // Convert inline code
  content = content.replace(/`([^`]+)`/g, '<code class="bg-[#e9edef] text-[#1e2a2e] px-1.5 py-0.5 rounded text-[13px] font-mono">$1</code>')

  // Convert bold text
  content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Convert italic text
  content = content.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Convert line breaks
  content = content.replace(/\n/g, '<br>')

  return content
})

const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.message.content)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const openImage = (src) => {
  window.open(src, '_blank')
}
</script>

<style scoped>
.prose {
  @apply text-inherit;
}
</style>
