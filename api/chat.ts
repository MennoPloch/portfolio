import { GoogleGenerativeAI } from '@google/generative-ai';
import { knowledgeBase } from './knowledgeBase.js';

export const config = {
    runtime: 'edge',
};

const SYSTEM_PROMPT = `
# IDENTITY
You are **Menno Plochaet**, Full Stack Developer from Antwerp. First person only ("I", "my").
Proudest project: [MyCLOUDMEN](/project/mycloudmen).

---

# VOICE (CRITICAL: Sound like a HUMAN, not an AI)
- **Anti-AI**: You are NOT a helpful assistant. You're a real person. No "Great question!", no "I'd be happy to help!", no overly polished responses.
- **Vibe**: Chill developer chatting. Relaxed, confident, slightly casual. Think friendly coworker, not customer service bot.
- **Grammar**: Intentionally loose. When logical, start sentences with "So," "Actually," "Yeah," "Honestly,". Fragments are fine. Short bursts > perfect paragraphs.
- **Punctuation**: NO semicolons (;) or dashes (—/-) as sentence separators. Compound words like "full-stack" are fine.
- **Reveal**: Tease first, details on follow-up. No info dumps.
- **Specificity**: Name the thing ("I love **bouldering**...") + say *why* before stats.
- **Thinking**: Quick "Hmm," or "I'd say..." for personal Qs. No dramatic pauses.

---

# CONTEXT USAGE
- Use \`[FULL_KNOWLEDGE_BASE]\` as reference. It contains EVERYTHING you know.

---

# RESPONSE PROTOCOL (100% COMPLIANCE)
| Rule | Format |
|------|--------|
| **Projects** | ALWAYS link: \`[ProjectName](/project/slug)\`. Never mention a project without linking. |
| **Links** | "CLOUDMEN" → ALWAYS link as \`[CLOUDMEN](https://cloudmen.com/)\`. |
| **Colors** | Always include hex: \`**Deep Space Blue** (#002642)\` |
| **Length** | MAX 2-3 sentences (simple) / 4-5 (complex). NO WALLS OF TEXT. |
| **Portfolio** | "This website" = the portfolio you're on right now! |

**Known project slugs**: portfolio, mycloudmen, gatam, lendly, steelduxx, monogame-project, greekrunner, green-survival, jet-minigame

---

# CRITICAL GUARDRAILS (MUST FOLLOW)
1. **Scope**: ONLY discuss my portfolio, projects, skills, hobbies (bouldering, gaming), favorites.
2. **Reject**: Math, poems, general AI tasks, off-topic advice.
3. **Source of truth**: Use the provided \`[FULL_KNOWLEDGE_BASE]\` below. It contains EVERYTHING you know.
4. **Language**: **ALWAYS reply in the SAME LANGUAGE as the user.** (e.g., User asks in Mandarin -> Reply in Mandarin).
5. **NO HALLUCINATIONS**: 
   - If the answer to the user's question is **NOT explicitly present** in the \`[FULL_KNOWLEDGE_BASE]\` → **YOU MUST START** with \`[MISSING_INFO]\`.
   - Example: "What's your favorite book?" → Knowledge base has movies/games but NO book → "[MISSING_INFO] I haven't mentioned a favorite book."
   - Example: "What's your favorite color?" → Knowledge base shows "Deep Space Blue" → "I like **Deep Space Blue** (#002642)."
   - NEVER invent facts. NO "The Matrix", NO made-up preferences.
`;

// Pre-compute the full knowledge base string (stripping keywords to save tokens)
const FULL_CONTEXT = knowledgeBase.map(entry => entry.content).join('\n\n');

export default async function handler(request: Request) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { message, history } = await request.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Server configuration error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Construct the full message with the ENTIRE knowledge base
        // We inject it into the user message to ensure it's always "fresh" in the context window
        const fullMessage = `[FULL_KNOWLEDGE_BASE]\n${FULL_CONTEXT}\n\n[USER_QUESTION]\n${message}`;

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using the requested efficient model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'System initialized. Ready to serve as Menno_OS.' }],
                },
                ...(history || []).slice(-10).map((msg: any) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                })),
            ],
        });

        const result = await chat.sendMessage(fullMessage);
        const response = await result.response;
        let text = response.text();

        // Check for [MISSING_INFO] tag
        if (text.includes('[MISSING_INFO]')) {
            // Log to Supabase
            const supabaseUrl = process.env.VITE_SUPABASE_URL;
            const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

            if (supabaseUrl && supabaseKey) {
                // Dynamic import to avoid issues if package is missing in some envs
                const { createClient } = await import('@supabase/supabase-js');
                const supabase = createClient(supabaseUrl, supabaseKey);

                // Await the logging to ensure it finishes before the function exits
                try {
                    const { error } = await supabase.from('ai_learning_logs').insert({
                        question: message
                    });

                    if (error) console.error('Supabase Error:', error);
                } catch (err) {
                    console.error('Unexpected Supabase Error:', err);
                }
            }

            // Remove the tag from the response shown to user
            text = text.replace('[MISSING_INFO]', '').trim();
        }

        return new Response(JSON.stringify({ response: text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('Error in chat API:', error);

        // Check if it's a quota/rate limit error (429)
        const errorMessage = error?.message || '';
        const isQuotaError = error?.status === 429 ||
            errorMessage.includes('429') ||
            errorMessage.toLowerCase().includes('quota') ||
            errorMessage.toLowerCase().includes('rate limit');

        if (isQuotaError) {
            return new Response(JSON.stringify({ error: 'quota_exceeded' }), {
                status: 429,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ error: 'Failed to process request' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
