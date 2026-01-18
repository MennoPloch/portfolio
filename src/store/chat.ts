import { ref, watch } from 'vue'

export interface Message {
    role: 'user' | 'model'
    content: string
    isTyping?: boolean
}

const STORAGE_KEY = 'menno_portfolio_chat_history'
const COMMAND_HISTORY_KEY = 'menno_portfolio_command_history'


const savedMessages = localStorage.getItem(STORAGE_KEY)
const initialMessages: Message[] = savedMessages ? JSON.parse(savedMessages) : []

const savedHistory = localStorage.getItem(COMMAND_HISTORY_KEY)
const initialHistory: string[] = savedHistory ? JSON.parse(savedHistory) : []

export const messages = ref<Message[]>(initialMessages)
export const commandHistory = ref<string[]>(initialHistory)
export const isLoading = ref(false)
export const isMatrixActive = ref(false)


watch(messages, (newMessages) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages))
}, { deep: true })

watch(commandHistory, (newHistory) => {
    localStorage.setItem(COMMAND_HISTORY_KEY, JSON.stringify(newHistory))
}, { deep: true })

export const addMessage = (role: 'user' | 'model', content: string, isTyping = false) => {
    messages.value.push({ role, content, isTyping })
}

export const addToHistory = (command: string) => {
    if (command.trim()) {
        commandHistory.value.push(command)
    }
}

export const clearChat = () => {
    messages.value = []
    localStorage.removeItem(STORAGE_KEY)

}
