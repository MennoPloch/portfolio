<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { marked } from 'marked';
import BackButton from '../components/BackButton.vue';
import MatrixRain from '../components/MatrixRain.vue';
import ChatProjectCard from '../components/ChatProjectCard.vue';
import { messages, isLoading, addMessage, clearChat, commandHistory, addToHistory, isMatrixActive } from '../store/chat';
import { portfolioData } from '../data/portfolio';

const router = useRouter();
const userInput = ref('');
const inputField = ref<HTMLTextAreaElement | null>(null);

const pendingAction = ref<{ type: 'theme_switch', targetMode: 'dark' | 'light' } | null>(null);


const coreCommands = [
  '/help', '/ls', '/projects', '/cd', '/clear', '/whoami', 
  '/pwd', '/about', '/theme', '/exit'
];
const easterEggs = [
  '/sudo', '/rm -rf', '/ping', '/coffee', '/brew', 
  '/matrix', '/vim', '/git'
];
const allCommands = [...coreCommands, ...easterEggs];

const showSuggestions = ref(false);

const detectProject = (content: string) => {
  // Look for [Project Name](/project/slug)
  const matches = [...content.matchAll(/\[(.*?)\]\(\/project\/(.*?)\)/g)];
  if (matches.length === 0) return null;
  
  // Extract unique slugs
  const slugs = new Set(matches.map(m => m[2]));
  
  if (slugs.size === 1) {
    const slug = [...slugs][0];
    return portfolioData.projects.find(p => p.slug === slug);
  }
  return null;
};
const suggestionIndex = ref(0);
const historyIndex = ref(-1);

const filteredCommands = computed(() => {
  if (!userInput.value.startsWith('/')) return [];
  const input = userInput.value.toLowerCase();
  
  // If just typing "/", show only core commands
  if (input === '/') {
    return coreCommands;
  }
  
  // If typing "/cd" or "/cd ", show all projects as cd targets
  if (input === '/cd' || input.startsWith('/cd ')) {
    const projectSearch = input.replace('/cd ', '').replace('/cd', '').toLowerCase();
    return portfolioData.projects
      .filter(p => p.slug.toLowerCase().includes(projectSearch))
      .map(p => `/cd ${p.slug}`);
  }

  // If typing "/theme" or "/theme ", show theme options
  if (input === '/theme' || input.startsWith('/theme ')) {
    const options = ['/theme dark', '/theme light'];
    const search = input.replace('/theme ', '').replace('/theme', '').trim();
    if (!search) return options;
    return options.filter(opt => opt.includes(search));
  }
  
  // Otherwise search everything
  return allCommands.filter(cmd => cmd.startsWith(input));
});

const handleInput = () => {
  adjustHeight();
  
  // If user types manually and it doesn't match the current history item, reset history index
  if (historyIndex.value !== -1) {
    const currentHistoryItem = commandHistory.value[historyIndex.value];
    if (currentHistoryItem !== undefined && userInput.value !== currentHistoryItem) {
      historyIndex.value = -1;
    }
  }
  
  showSuggestions.value = userInput.value.startsWith('/') && filteredCommands.value.length > 0;
  suggestionIndex.value = 0; // Reset selection on input
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (!showSuggestions.value) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key === 'ArrowUp') {
      // Only allow history navigation if input is empty OR we are already navigating history
      if (!userInput.value || historyIndex.value !== -1) {
        e.preventDefault();
        if (historyIndex.value === -1) {
          // Start navigation from the end
          if (commandHistory.value.length > 0) {
            historyIndex.value = commandHistory.value.length - 1;
            const historyItem = commandHistory.value[historyIndex.value];
            if (historyItem !== undefined) {
              userInput.value = historyItem;
            }
            // Wait for DOM update then move cursor to end
            setTimeout(() => {
              if (inputField.value) {
                inputField.value.selectionStart = inputField.value.selectionEnd = inputField.value.value.length;
              }
            }, 0);
          }
        } else if (historyIndex.value > 0) {
          // Go back further
          historyIndex.value--;
          const historyItem = commandHistory.value[historyIndex.value];
          if (historyItem !== undefined) {
            userInput.value = historyItem;
          }
        }
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex.value !== -1) {
        e.preventDefault();
        if (historyIndex.value < commandHistory.value.length - 1) {
          // Go forward
          historyIndex.value++;
          const historyItem = commandHistory.value[historyIndex.value];
          if (historyItem !== undefined) {
            userInput.value = historyItem;
          }
        } else {
          // Reset to empty
          historyIndex.value = -1;
          userInput.value = '';
        }
      }
    }
    return;
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    suggestionIndex.value = (suggestionIndex.value - 1 + filteredCommands.value.length) % filteredCommands.value.length;
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    suggestionIndex.value = (suggestionIndex.value + 1) % filteredCommands.value.length;
  } else if (e.key === 'Tab' || e.key === 'Enter') {
    e.preventDefault();
    const cmd = filteredCommands.value[suggestionIndex.value];
    if (cmd) selectSuggestion(cmd);
  } else if (e.key === 'Escape') {
    showSuggestions.value = false;
  }
};

const selectSuggestion = (cmd: string) => {
  userInput.value = cmd + ' '; // Add space for arguments
  
  // Check if this command triggers sub-suggestions (like /theme or /cd)
  // If so, keep suggestions open so user sees the options immediately
  const hasSubOptions = ['/theme', '/cd'].includes(cmd);
  showSuggestions.value = hasSubOptions;
  
  if (hasSubOptions) {
    suggestionIndex.value = 0;
  }
  
  inputField.value?.focus();
};

const insertSlash = () => {
  userInput.value = '/';
  handleInput();
  inputField.value?.focus();
};


const handleCommand = (input: string): string | null => {
  const trimmed = input.trim().toLowerCase();
  const parts = trimmed.split(' ');
  const cmd = parts[0];
  
  switch (cmd) {
    case '/help':
    case '/man':
      return `**Available Commands:**

| Command | Description |
|---------|-------------|
| \`/help\` | Show this help message |
| \`/ls\` | List all projects |
| \`/cd <project>\` | Open a project |
| \`/theme <mode>\` | Toggle dark/light mode |
| \`/clear\` | Clear chat history |
| \`/whoami\` | About Menno |
| \`/pwd\` | Current location |
| \`/about\` | Portfolio info |
| \`/exit\` | Return to home |

*Tip: You can also just ask me questions naturally!*`;

    case '/ls':
    case '/projects':
      const projectList = portfolioData.projects
        .map(p => `📁 [${p.slug}](/project/${p.slug}) *(${p.tags.slice(0, 2).join(', ')})*`)
        .join('  \n');
      return `\`~/projects\`  \n\n${projectList}`;

    case '/clear':
    case '/reset':
      // Clear chat and show fresh greeting
      setTimeout(() => {
        clearChat();
        const greetings = [
          "Fresh start! What would you like to know?",
          "Chat cleared. How can I help you?",
          "Starting over. Ask me anything!"
        ];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)] as string;
        typeMessage(randomGreeting);
      }, 100);
      return null; // No immediate response, handled async

    case '/whoami':
      const terminalBio = "I am a Full Stack Developer with a passion for building digital experiences that feel natural and premium. I bridge the gap between creative frontend (Vue, Angular) and structured backend (.NET, Java). Currently looking for my first professional challenge to make an impact.";
      return `**${portfolioData.personal.name}**\n${portfolioData.personal.title} from ${portfolioData.personal.location}.\n\n${terminalBio}`;

    case '/pwd':
      return `📍 You are at: **mennoplochaet.com/chat**\n\nThis is my interactive portfolio terminal.`;

    case '/about':
    case '/cat':
      if (parts[1] === 'about' || cmd === '/about') {
        return `**${portfolioData.personal.name}**\n\n${portfolioData.bio}\n\n📧 ${portfolioData.personal.email}`;
      }
      return `cat: ${parts[1] || 'missing argument'}: No such file or directory`;

    case '/cd':
      const projectSlug = parts[1];
      if (!projectSlug) {
        return `Usage: \`/cd <project>\`  \nExample: \`/cd mycloudmen\``;
      }
      const project = portfolioData.projects.find(p => 
        p.slug.toLowerCase() === projectSlug.toLowerCase()
      );
      if (project) {
        setTimeout(() => router.push(`/project/${project.slug}`), 500);
        return `📂 Opening [${project.title}](/project/${project.slug})...`;
      }
      return `cd: ${projectSlug}: No such project. Try \`/ls\` to see available projects.`;



    case '/theme':
      const mode = parts[1]?.toLowerCase();
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      const currentModeStr = isCurrentlyDark ? 'dark' : 'light';
      
      if (mode === currentModeStr) {
        const targetMode = isCurrentlyDark ? 'light' : 'dark';
        pendingAction.value = { type: 'theme_switch', targetMode };
        return `Theme is already set to **${mode} mode**. Would you like to switch to **${targetMode} mode**? (y/n)`;
      }
      
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
        return `🌑 Theme set to **dark mode**.`;
      } else if (mode === 'light') {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
        return `☀️ Theme set to **light mode**.`;
      } else {
        // Toggle if no argument
        if (isCurrentlyDark) {
          document.documentElement.classList.remove('dark');
          localStorage.theme = 'light';
          return `☀️ Switched to **light mode**.`;
        } else {
          document.documentElement.classList.add('dark');
          localStorage.theme = 'dark';
          return `🌑 Switched to **dark mode**.`;
        }
      }

    case '/exit':
    case '/quit':
      setTimeout(() => router.push('/'), 500);
      return `Goodbye! Redirecting to home... 👋`;

    case '/matrix':
      isMatrixActive.value = !isMatrixActive.value;
      if (isMatrixActive.value) {
        return `🕶️ **Matrix mode activated.** Follow the white rabbit.`;
      } else {
        return `🔌 **Matrix mode deactivated.** Welcome back to the real world.`;
      }

    case '/sudo':
      return `Nice try! 😏 You don't have root access here.`;

    case '/rm':
      if (trimmed.includes('-rf')) {
        return `🛑 I'm not that kind of terminal! My files are safe.`;
      }
      return `rm: missing operand`;

    case '/ping':
      return `pong 🏓`;

    case '/coffee':
    case '/brew':
      return `☕ Brewing... Actually, I prefer tea!`;

    case '/vim':
      return `How do I exit?! Just kidding. Use \`/clear\` to start fresh.`;

    case '/git':
      return `git: command requires more arguments`;

    default:
      // Check if it starts with / but isn't recognized
      if (cmd && cmd.startsWith('/')) {
        return `Command not found: \`${cmd}\`\n\nType \`/help\` to see available commands.`;
      }
      return null; // Not a command, proceed with API call
  }
};


onMounted(async () => {
  const greetings = [
    "Hey. I'm Menno's digital twin. Ask me about my projects, skills, or bouldering.",
    "Hi there! I'm the AI version of Menno. Curious about my work or hobbies?",
    "Hello! I'm Menno's digital assistant. What would you like to know?",
    "Greetings. I'm a digital clone of Menno. Ask me anything about his portfolio.",
    "Hey! I'm here to answer questions about Menno's projects and skills.",
    "Hi! I'm Menno's AI twin. Feel free to ask about my coding journey.",
    "Hello. I represent Menno digitally. Ask me about his tech stack or projects.",
    "Hey there. I'm Menno's portfolio bot. Ready to chat about code or bouldering.",
    "Hi. I'm an AI trained on Menno's portfolio. What's on your mind?",
    "Hello! I'm Menno's virtual self. Ask me about my favorite tech or projects."
  ];

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  
  // Check if chat is empty OR only contains a previous greeting (any of them)
  const firstMsg = messages.value[0];
  const shouldPlayIntro = messages.value.length === 0 || 
    (messages.value.length === 1 && firstMsg?.role === 'model' && greetings.includes(firstMsg?.content || ''));

  if (shouldPlayIntro) {
    // Clear existing history if it's just an old greeting so we can re-type a new one
    if (messages.value.length > 0) {
      clearChat();
    }

    // Small delay before typing starts for better UX
    setTimeout(() => {
      typeMessage(randomGreeting || '');
    }, 500);
  }
  

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const forceScroll = () => {
    if (window.innerWidth < 768 && chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    }
  };

  await nextTick();
  forceScroll();
  
  const interval = setInterval(forceScroll, 50);
  setTimeout(() => clearInterval(interval), 500);
  
  nextTick(() => {
    if (window.innerWidth > 768) {
      inputField.value?.focus();
    }
  });
});

onUnmounted(() => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
  }
});

const chatContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
  await nextTick();
  if (window.innerWidth < 768 && chatContainer.value) {
    chatContainer.value.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth'
    });
  } else {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }
};

const adjustHeight = () => {
  if (inputField.value) {
    inputField.value.style.height = 'auto';
    inputField.value.style.height = inputField.value.scrollHeight + 'px';
  }
};

const typeMessage = async (text: string, speed = 20) => {
  addMessage('model', '', true);
  const messageIndex = messages.value.length - 1;
  
  // Regex to find markdown links: [text](url) AND hex colors: #123456
  const linkRegex = /(\[[^\]]+\]\([^)]+\)|#[0-9A-Fa-f]{6})/g;
  const parts = text.split(linkRegex);
  
  for (const part of parts) {
    if (!part) continue;

    // If it's a link or hex code, append it instantly
    if (part.match(linkRegex)) {
      const currentMsg = messages.value[messageIndex];
      if (currentMsg) {
        messages.value[messageIndex] = {
          ...currentMsg,
          content: currentMsg.content + part
        };
        await scrollToBottom();
        // Pause for typing effect
        await new Promise(resolve => setTimeout(resolve, speed * 5));
      }
      continue;
    }

    // Type character by character
    let currentIndex = 0;
    while (currentIndex < part.length) {
      const currentMsg = messages.value[messageIndex];
      if (currentMsg) {
        messages.value[messageIndex] = {
          ...currentMsg,
          content: currentMsg.content + part[currentIndex],
          isTyping: true
        };
        currentIndex++;
        await scrollToBottom();
        await new Promise(resolve => setTimeout(resolve, speed));
      } else {
        break; 
      }
    }
  }

  // Finished typing
  const finalMsg = messages.value[messageIndex];
  if (finalMsg) {
    messages.value[messageIndex] = {
      ...finalMsg,
      isTyping: false
    };
  }
};

const sendMessage = async () => {
  const text = userInput.value.trim();
  if (!text) return;

  // Handle pending action confirmation
  if (pendingAction.value) {
    addMessage('user', text);
    userInput.value = '';
    
    if (['y', 'yes'].includes(text.toLowerCase())) {
      if (pendingAction.value.type === 'theme_switch') {
        const mode = pendingAction.value.targetMode;
        if (mode === 'dark') {
          document.documentElement.classList.add('dark');
          localStorage.theme = 'dark';
          addMessage('model', `🌑 Switched to **dark mode**.`);
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.theme = 'light';
          addMessage('model', `☀️ Switched to **light mode**.`);
        }
      }
    } else {
      addMessage('model', 'Cancelled.');
    }
    pendingAction.value = null;
    return;
  }

  if (isLoading.value) return;
  
  // Add to persistent history
  addToHistory(text);
  historyIndex.value = -1;

  userInput.value = '';
  
  // Reset height
  if (inputField.value) {
    inputField.value.style.height = 'auto';
  }
  
  // Add user message
  addMessage('user', text);
  await scrollToBottom();

  // Check for commands first (handled locally, no API call needed)
  const commandResponse = handleCommand(text);
  if (commandResponse !== null) {
    // Command found, display response with typing effect (FASTER SPEED: 10ms)
    await typeMessage(commandResponse, 10);
    return;
  }
  
  // If input starts with / but wasn't handled, it's an unknown command
  // (already handled in handleCommand, but just in case)
  if (text.trim().startsWith('/')) {
    return; // Already showed "command not found" message
  }

  // Not a command, proceed with API call
  isLoading.value = true;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history: messages.value.map(m => ({ role: m.role, content: m.content }))
      }),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error('Invalid server response. Please ensure the API is running correctly (use `vercel dev`).');
    }
    
    // Check for quota exceeded (429 or specific error message)
    if (response.status === 429 || (data.error && data.error.toLowerCase().includes('quota'))) {
      isLoading.value = false;
      addMessage('model', `⚠️ **AI quota exceeded!**\n\nYou can still use terminal commands like \`/ls\`, \`/cd\`, \`/help\`, etc.\n\nTry again later or contact me at **plochaetm@gmail.com**`);
      return;
    }
    
    if (data.error) throw new Error(data.error);

    isLoading.value = false;
    
    // Simulate typing effect with the helper (NORMAL SPEED: 20ms)
    await typeMessage(data.response || 'No response received', 20);

  } catch (error) {
    console.error('Chat error:', error);
    const errorMsg = error instanceof Error ? error.message : '';
    
    // Check if it's a quota error
    if (errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('rate limit')) {
      addMessage('model', `⚠️ **AI quota exceeded!**\n\nYou can still use terminal commands like \`/ls\`, \`/cd\`, \`/help\`, etc.\n\nTry again later or contact me at **plochaetm@gmail.com**`);
    } else {
      addMessage('model', 'Oops, something went wrong. Please try again later or email plochaetm@gmail.com.');
    }
    isLoading.value = false;
  }
};

const handleMessageClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  
  // Handle color swatch clicks
  if (target.classList.contains('color-swatch')) {
    const hex = target.getAttribute('data-hex');
    if (hex) {
      navigator.clipboard.writeText(hex);
      // Visual feedback (optional: could add a toast here later)
      const originalTitle = target.getAttribute('title');
      target.setAttribute('title', 'Copied!');
      setTimeout(() => {
        target.setAttribute('title', originalTitle || 'Click to copy');
      }, 1000);
    }
    return;
  }
  
  // Handle internal links (Vue Router navigation)
  if (target.tagName === 'A') {
    const href = target.getAttribute('href');
    if (href && href.startsWith('/')) {
      event.preventDefault();
      router.push(href);
    }
  }
};

const renderMarkdown = (text: string) => {
  let html = marked(text) as string;
  
  // Add color swatches for hex codes
  html = html.replace(/(#[0-9A-Fa-f]{6})/g, '<span style="background-color: $1" data-hex="$1" class="color-swatch inline-block w-5 h-5 rounded-md mr-2 align-text-bottom border border-black/10 dark:border-white/10 shadow-sm hover:scale-110 transition-transform cursor-pointer" title="Click to copy"></span>$1');
  
  // Style internal links to be clearly blue and clickable
  html = html.replace(/<a href="(\/[^"]+)">/g, '<a href="$1" class="text-blue-500 dark:text-blue-400 font-semibold underline underline-offset-4 decoration-2 hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer transition-colors">');
  
  return html;
};
</script>

    <template>
      <div class="h-[100dvh] md:h-auto md:min-h-screen flex flex-col bg-white dark:bg-soft-black text-black dark:text-white transition-colors duration-300 font-sans overflow-hidden md:overflow-visible">
        
        <!-- Back Button -->
        <div class="absolute top-0 left-0 z-50">
          <BackButton />
        </div>

        <!-- Matrix Rain Effect -->
        <MatrixRain v-if="isMatrixActive" />

        <!-- Top Fade Gradient -->
        <div class="fixed top-0 left-0 w-full h-24 bg-gradient-to-b from-white via-white to-transparent dark:from-soft-black dark:via-soft-black dark:to-transparent z-30 pointer-events-none transition-colors duration-300"></div>

        <!-- Chat Container -->
        <div 
          ref="chatContainer"
          class="flex-1 overflow-y-auto md:overflow-visible w-full px-6 pt-28 pb-32 md:px-20 lg:px-40 font-mono max-w-5xl mx-auto overscroll-contain scroll-smooth"
        >
          <div class="flex flex-col gap-6 min-h-full justify-end">
            <!-- Spacer to push content down initially if empty -->
            <div class="flex-1"></div>

            <div 
              v-for="(msg, index) in messages" 
              :key="index"
              class="w-full flex flex-col gap-1"
            >
              <!-- Label -->
              <div class="text-xs uppercase tracking-widest opacity-40 mb-1 font-bold">
                {{ msg.role === 'user' ? 'Visitor' : 'MENNO_OS' }}
              </div>

              <!-- Message Content -->
              <div 
                class="text-base md:text-lg leading-relaxed"
                :class="msg.role === 'user' ? 'text-gray-500 dark:text-gray-400' : 'text-black dark:text-white'"
              >
                <div v-if="msg.role === 'user'">
                  > {{ msg.content }}
                </div>
                <div v-else>
                  <span 
                    class="prose dark:prose-invert max-w-none prose-a:text-blue-500 dark:prose-a:text-blue-400 prose-a:font-semibold prose-a:underline prose-a:underline-offset-4 prose-a:decoration-2 hover:prose-a:text-blue-600 dark:hover:prose-a:text-blue-300 prose-a:transition-all prose-a:cursor-pointer"
                    :class="{ 'typing-mode': msg.isTyping }"
                    v-html="renderMarkdown(msg.content)"
                    @click="handleMessageClick"
                  ></span><span v-if="msg.isTyping" class="inline-block w-2.5 h-5 bg-black dark:bg-white align-middle animate-pulse ml-1"></span>
                  
                  <!-- Project Card -->
                  <ChatProjectCard 
                    v-if="!msg.isTyping && detectProject(msg.content)"
                    :project="detectProject(msg.content)!"
                  />
                </div>
              </div>
            </div>

            <!-- Loading Indicator -->
            <div v-if="isLoading && !messages[messages.length - 1]?.isTyping" class="flex items-center gap-2 opacity-50 mt-4">
              <span class="text-xs font-mono animate-pulse">> Processing...</span>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="w-full fixed bottom-0 left-0 p-6 pt-20 bg-gradient-to-t from-white via-white to-transparent dark:from-soft-black dark:via-soft-black dark:to-transparent z-40 transition-colors duration-300 shrink-0">
          <div class="max-w-3xl mx-auto relative font-mono">
            
            <!-- Command Suggestions -->
            <div 
              v-if="showSuggestions"
              class="absolute bottom-full left-0 mb-4 w-full bg-white/80 dark:bg-soft-black/80 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-lg shadow-lg overflow-hidden z-50"
            >
              <div 
                v-for="(cmd, index) in filteredCommands" 
                :key="cmd"
                class="px-4 py-2 cursor-pointer transition-colors duration-200 flex items-center justify-between"
                :class="{ 'bg-black/5 dark:bg-white/10': index === suggestionIndex }"
                @click="selectSuggestion(cmd)"
                @mouseenter="suggestionIndex = index"
              >
                <span class="text-black dark:text-white font-medium">{{ cmd }}</span>
                <span class="text-xs text-black/40 dark:text-white/40">Command</span>
              </div>
            </div>

            <div class="relative group flex items-end gap-3">
              <span class="text-black/40 dark:text-white/40 text-lg mb-3">></span>
              <textarea
                ref="inputField"
                v-model="userInput"
                @keydown="handleKeyDown"
                @input="handleInput"
                rows="1"
                placeholder="Type a message..."
                class="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-all duration-300 text-lg text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 hide-cursor cursor-text hover:border-black/30 dark:hover:border-white/30 resize-none overflow-hidden min-h-[52px] break-all pr-10"
              ></textarea>
              
              <!-- Minimalist Command Trigger -->
              <button 
                v-if="!userInput"
                @click="insertSlash"
                class="group/btn absolute right-2 bottom-3 w-7 h-7 flex items-center justify-center rounded-md bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-black/50 dark:text-white/50 transition-all duration-200 font-mono text-sm"
              >
                /
                <!-- Tooltip -->
                <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black dark:bg-white dark:text-black rounded opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none hidden md:block shadow-lg">
                  Type / for commands
                </span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </template>
    
<style scoped>

:deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.9em;
}

:deep(th), :deep(td) {
  padding: 0.5rem;
  border: 1px solid rgba(128, 128, 128, 0.3);
  text-align: left;
}

:deep(th) {
  font-weight: bold;
  background-color: rgba(128, 128, 128, 0.1);
}
</style>

<style>

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}


@media (min-width: 768px) {
  ::-webkit-scrollbar {
    display: none;
  }
  * {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
}


.typing-mode p {
  display: inline;
}
.typing-mode p::after {
  content: ' ';
}
</style>
