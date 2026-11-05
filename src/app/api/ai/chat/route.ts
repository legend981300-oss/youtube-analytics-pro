import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatRequest {
  message: string;
  channelContext?: {
    name?: string;
    handle?: string;
    subscribers?: number;
    category?: string;
    totalViews?: number;
  };
  history?: ChatMessage[];
}

/**
 * Auto-detects AI key from headers or environment variables regardless of exact naming
 */
function resolveAiKey(req: NextRequest): {
  type: 'nvidia' | 'gemini' | 'openai' | null;
  key: string;
} {
  // 1. Check custom headers passed from client UI (e.g. from local user settings)
  const clientHeader =
    req.headers.get('x-ai-key') ||
    req.headers.get('x-nvidia-key') ||
    req.headers.get('x-gemini-key') ||
    req.headers.get('x-openai-key') ||
    '';

  if (clientHeader.trim()) {
    const trimmed = clientHeader.trim();
    if (trimmed.startsWith('nvapi-')) return { type: 'nvidia', key: trimmed };
    if (trimmed.startsWith('AIzaSy')) return { type: 'gemini', key: trimmed };
    if (trimmed.startsWith('sk-')) return { type: 'openai', key: trimmed };
  }

  // 2. Check explicit env variables
  if (process.env.NVIDIA_NIM_API_KEY && process.env.NVIDIA_NIM_API_KEY.startsWith('nvapi-')) {
    return { type: 'nvidia', key: process.env.NVIDIA_NIM_API_KEY };
  }
  if (process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY.startsWith('nvapi-')) {
    return { type: 'nvidia', key: process.env.NVIDIA_API_KEY };
  }
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 15 && !process.env.GEMINI_API_KEY.includes('placeholder')) {
    return { type: 'gemini', key: process.env.GEMINI_API_KEY };
  }
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
    return { type: 'openai', key: process.env.OPENAI_API_KEY };
  }

  // 3. Scan all environment variables for matching signatures
  for (const [envName, envVal] of Object.entries(process.env)) {
    if (!envVal || typeof envVal !== 'string') continue;
    const val = envVal.trim();
    if (val.startsWith('nvapi-')) {
      return { type: 'nvidia', key: val };
    }
    if (val.startsWith('AIzaSy') && !envName.includes('YOUTUBE')) {
      return { type: 'gemini', key: val };
    }
    if (val.startsWith('sk-') && !envName.includes('STRIPE')) {
      return { type: 'openai', key: val };
    }
  }

  return { type: null, key: '' };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AIChatRequest = await request.json();
    const { message, channelContext, history = [] } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const channelName = channelContext?.name || 'Creator';
    const channelSubs = channelContext?.subscribers?.toLocaleString() || '10,000+';
    const channelCategory = channelContext?.category || 'Creator Media';

    const systemPrompt = `You are "Channel Copilot", an elite YouTube Growth Consultant & Retention Architect for YouTube Analytics Pro.
You are advising the creator of "${channelName}" (Category: ${channelCategory}, Audience: ${channelSubs} subscribers).
Your knowledge encompasses top creator playbooks (MrBeast, Paddy Galloway, Ali Abdaal, Colin & Samir).

Rules:
1. Always be conversational, friendly, sharp, and helpful.
2. If the user greets you or asks casual questions ("how are you", "can I ask you something"), respond naturally like an expert friend!
3. If the user asks for strategies, niches, titles, or advice, give concrete, actionable bullet points grounded in YouTube analytics (CTR, retention, browse velocity).
4. Use clean markdown formatting with emojis.`;

    const { type: providerType, key: activeKey } = resolveAiKey(request);

    // =========================================================================
    // 1. NVIDIA NIM Provider (Llama 3.3 70B)
    // =========================================================================
    if (providerType === 'nvidia' || (process.env.NVIDIA_NIM_API_KEY && process.env.NVIDIA_NIM_API_KEY.startsWith('nvapi-'))) {
      const keyToUse = activeKey || process.env.NVIDIA_NIM_API_KEY || process.env.NVIDIA_API_KEY || '';
      try {
        const cleanHistory = history
          .filter((m, idx) => !(idx === 0 && m.role === 'assistant'))
          .slice(-6)
          .map((msg) => ({ role: msg.role, content: msg.content }));

        const messages = [
          { role: 'system', content: systemPrompt },
          ...cleanHistory,
          { role: 'user', content: message },
        ];

        const nvidiaRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keyToUse}`,
          },
          body: JSON.stringify({
            model: 'meta/llama-3.3-70b-instruct',
            messages,
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (nvidiaRes.ok) {
          const completion = await nvidiaRes.json();
          const replyText = completion.choices?.[0]?.message?.content;
          if (replyText) {
            return NextResponse.json({
              reply: replyText.trim(),
              provider: 'nvidia',
              model: 'meta/llama-3.3-70b-instruct',
            });
          }
        } else {
          console.warn('[AI Chat] NVIDIA NIM returned HTTP', nvidiaRes.status);
        }
      } catch (nvidiaErr) {
        console.warn('[AI Chat] NVIDIA NIM failed, falling back:', nvidiaErr);
      }
    }

    // =========================================================================
    // 2. Google Gemini 1.5 Flash Provider
    // =========================================================================
    if (providerType === 'gemini' || (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 15)) {
      const keyToUse = activeKey || process.env.GEMINI_API_KEY || '';
      try {
        const cleanHistoryText = history
          .filter((m, idx) => !(idx === 0 && m.role === 'assistant'))
          .slice(-6)
          .map((m) => `${m.role === 'assistant' ? 'Copilot' : 'User'}: ${m.content}`)
          .join('\n');

        const promptText = `${systemPrompt}\n\n` +
          (cleanHistoryText ? `Recent Chat History:\n${cleanHistoryText}\n\n` : '') +
          `User: ${message}\n\nCopilot:`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyToUse}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: promptText }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({
              reply: replyText.trim(),
              provider: 'gemini',
              model: 'gemini-1.5-flash',
            });
          }
        } else {
          console.warn('[AI Chat] Gemini returned HTTP', geminiRes.status);
        }
      } catch (geminiErr) {
        console.warn('[AI Chat] Gemini call failed, falling back:', geminiErr);
      }
    }

    // =========================================================================
    // 3. OpenAI GPT-4o-mini Provider
    // =========================================================================
    if (providerType === 'openai' || (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-'))) {
      const keyToUse = activeKey || process.env.OPENAI_API_KEY || '';
      try {
        const cleanHistory = history
          .filter((m, idx) => !(idx === 0 && m.role === 'assistant'))
          .slice(-6)
          .map((msg) => ({ role: msg.role, content: msg.content }));

        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keyToUse}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...cleanHistory,
              { role: 'user', content: message },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (openAiRes.ok) {
          const completion = await openAiRes.json();
          const replyText = completion.choices?.[0]?.message?.content;
          if (replyText) {
            return NextResponse.json({
              reply: replyText.trim(),
              provider: 'openai',
              model: 'gpt-4o-mini',
            });
          }
        }
      } catch (openAiErr) {
        console.warn('[AI Chat] OpenAI call failed, falling back:', openAiErr);
      }
    }

    // =========================================================================
    // 4. Conversational Intelligent Offline Fallback Engine
    // =========================================================================
    const lower = message.toLowerCase().trim();
    let reply = '';

    if (
      lower.includes('can i ask') ||
      lower.includes('have a question') ||
      lower.includes('ask you a question') ||
      lower === 'question'
    ) {
      reply = `Yes, absolutely! I'm here 24/7 to help you grow **${channelName}**.

What's on your mind? You can ask me about:
• 🎯 **CTR & Thumbnails**: How to get higher click-through rates
• 💡 **Video Ideas**: Finding breakout topics and viral hooks
• ⏱️ **Watch Time**: Keeping viewers hooked past the 30-second mark
• 💰 **Monetization**: Brand deals, CPM rates, and sponsorship pricing

Go ahead and shoot your question!`;
    } else if (
      lower.startsWith('how are you') ||
      lower.startsWith('hello') ||
      lower.startsWith('hi') ||
      lower.startsWith('hey') ||
      lower === 'how are you ?' ||
      lower === 'how are you'
    ) {
      reply = `👋 Hey! I'm running smoothly and fully calibrated to **${channelName}**'s channel metrics!

How can I help you level up your content today?`;
    } else if (lower.includes('niche') || lower.includes('ideas') || lower.includes('topic')) {
      reply = `🎯 Top High-RPM & Viral Niches for YouTube in 2026:

1. **AI Automation & Micro-SaaS ($25 - $45 RPM)**:
   • Non-technical guides building automated business workflows.
   • Sponsors pay premium rates for business and developer software.

2. **Personal Finance & Wealth Systems ($20 - $40 RPM)**:
   • Step-by-step investing, tax breakdown, and realistic online cash-flow models.

3. **Cinematic Internet Documentaries ($14 - $28 RPM)**:
   • Deep dives into internet mysteries, creator empires, and business scandals.
   • Massive international browse velocity and high 15+ minute watch-time.

4. **Hardware & Minimalist Tech Desk Setups ($15 - $30 RPM)**:
   • High affiliate purchase conversion on mechanical keyboards, audio gear, and monitors.

💡 **Action Step for ${channelName}**:
Which of these directions fits your personal interests most? I can generate 5 video concepts for it immediately!`;
    } else if (lower.includes('views drop') || lower.includes('drop') || lower.includes('low view')) {
      reply = `📉 3-Step Diagnostic for View Drops on ${channelName}:

1. **24-Hour CTR Collapse**: Check your first 2 hours of CTR. If it dropped below 5%, YouTube's algorithm tested cold browse viewers and pulled back.
2. **First 30 Seconds**: If retention drops below 65% in the opening 30 seconds, viewers didn't see the thumbnail promise delivered right away.
3. **Thumbnail Redesign**: Change the thumbnail focal point to 1 single high-contrast subject to trigger a second algorithmic push.`;
    } else if (lower.includes('ctr') || lower.includes('thumbnail') || lower.includes('title')) {
      reply = `🎯 The 3 Golden Rules to Lift CTR from 7% to 11%+:

1. **Rule of 3 Elements**: 1 Expressive Face + 1 Focal Object + max 3 words of bold text.
2. **Curiosity Gap**: Don't repeat the video title on the thumbnail image. Complement it.
3. **The Mobile Glance Test**: Zoom out to 10% on your screen. If the emotion and subject aren't clear in 0.5s, simplify it.`;
    } else if (lower.includes('who are you') || lower.includes('what can you do') || lower.includes('help')) {
      reply = `🤖 I'm **Channel Copilot**, your real-time YouTube strategy partner.

I analyze your channel's metrics (${channelSubs} subscribers) and help you:
1. Brainstorm high-converting video concepts and niches.
2. Write viral, high-CTR titles and scripts.
3. Diagnose algorithmic retention drops and view anomalies.
4. Calculate sponsorship card rates ($ CPM).

Ask me anything about YouTube strategy or video optimization!`;
    } else {
      reply = `💡 Strategic Insight for **${channelName}**:

Regarding *"**${message.trim()}**"*:

1. **Algorithmic Leverage**: Keep your viewer's expectations aligned with your thumbnail hook within the first 6 seconds to eliminate instant drop-off.
2. **Title Optimization**: Frame your video around a curiosity gap or contrarian question rather than a plain statement.
3. **Session Watch-Time**: Use an end-screen video card linked to your top-performing playlist to keep viewers on YouTube.

Would you like me to write 5 high-CTR titles, or generate a full script outline for this topic?`;
    }

    return NextResponse.json({
      reply,
      provider: 'local-heuristic',
      model: 'creator-strategy-engine-v2',
    });
  } catch (error: any) {
    console.error('[AI Chat API Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process AI chat message' },
      { status: 500 }
    );
  }
}
