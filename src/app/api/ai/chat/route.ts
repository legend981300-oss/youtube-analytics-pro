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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AIChatRequest = await request.json();
    const { message, channelContext, history = [] } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const channelName = channelContext?.name || 'Creator';
    const channelSubs = channelContext?.subscribers?.toLocaleString() || '10,000+';
    const channelCategory = channelContext?.category || 'General Entertainment & Tech';

    const systemPrompt = `You are "Channel Copilot", an elite YouTube Growth Consultant & Retention Architect for YouTube Analytics Pro.
You are advising the creator of "${channelName}" (Category: ${channelCategory}, Current Audience: ${channelSubs} subscribers).
Your knowledge encompasses the best strategies from MrBeast, Paddy Galloway, Ali Abdaal, Colin & Samir, and YouTube internal algorithmic whitepapers.

Keep your answers:
1. Direct, tactical, and immediately actionable (bullet points, clear steps, concrete examples).
2. Grounded in YouTube math (CTR, Average View Duration, retention dips, browse feature velocity).
3. Concise, punchy, and formatted with clean markdown and emojis. Do not output walls of vague text.`;

    // 1. Google Gemini 1.5 Flash Provider
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && !geminiKey.includes('placeholder') && geminiKey.length > 10) {
      try {
        const contents = [
          ...history.slice(-6).map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })),
          {
            role: 'user',
            parts: [
              {
                text: `${systemPrompt}\n\nUser Question: ${message}`,
              },
            ],
          },
        ];

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
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
        }
      } catch (geminiErr) {
        console.warn('[AI Chat] Gemini call failed, falling back:', geminiErr);
      }
    }

    // 2. NVIDIA NIM Provider (Llama 3.3 70B)
    const nvidiaKey = process.env.NVIDIA_NIM_API_KEY || process.env.NVIDIA_API_KEY;
    if (nvidiaKey && (nvidiaKey.startsWith('nvapi-') || nvidiaKey.length > 20) && !nvidiaKey.includes('placeholder')) {
      try {
        const messages = [
          { role: 'system', content: systemPrompt },
          ...history.slice(-6).map((msg) => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: message },
        ];

        const nvidiaRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${nvidiaKey}`,
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
        }
      } catch (nvidiaErr) {
        console.warn('[AI Chat] NVIDIA NIM call failed, falling back:', nvidiaErr);
      }
    }

    // 3. OpenAI GPT-4o-mini Provider
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey && openAiKey.startsWith('sk-') && !openAiKey.includes('placeholder')) {
      try {
        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...history.slice(-6).map((msg) => ({ role: msg.role, content: msg.content })),
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

    // 4. Intelligent Algorithmic Creator Advisor (Offline/Zero-Key Fallback)
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('niche') || lower.includes('ideas') || lower.includes('topic')) {
      reply = `🎯 Top High-RPM & Viral Niches for YouTube in 2026:

1. **AI Automations & Micro-SaaS ($22 - $45 RPM)**:
   • Tutorials showing non-technical founders building tools with AI workflows.
   • High advertiser interest from B2B SaaS, dev tools, and hosting providers.

2. **Personal Finance & Wealth Engineering ($18 - $38 RPM)**:
   • Index fund investing, side hustle teardowns, and realistic tax optimization.
   • Peak sponsor budgets from FinTech and brokerage platforms.

3. **Curiosity Documentaries / Deep Dives ($12 - $24 RPM)**:
   • 15-minute cinematic investigative videos into internet subcultures or company collapses (e.g. MagnatesMedia style).
   • Very high retention & international algorithmic recommendation velocity.

4. **Productivity Tech & Desk Setups ($14 - $28 RPM)**:
   • Minimalist desk setups, Notion system builds, hardware reviews.
   • High affiliate conversion rates on Amazon and custom hardware.

💡 **Action Tip for ${channelName}**:
Test a 3-video mini-series in one of these niches using a contrarian hook ("Why I Stopped Using X") to test audience resonance before pivoting completely.`;
    } else if (lower.includes('views drop') || lower.includes('drop') || lower.includes('low view')) {
      reply = `📉 3-Step Diagnostic for View Drops on ${channelName}:

1. **Browse Feed Impression Burn**:
   • Check your 24-hour CTR. If impressions spiked but CTR dropped below 5%, YouTube's algorithm tested a broader cold audience and pulled back.
   • **Fix**: Replace thumbnail with a version having fewer than 3 focal points and higher contrast.

2. **First 30-Second Retention Hook**:
   • If retention dips below 65% in the first 30 seconds, viewers felt clickbaited.
   • **Fix**: Fulfill the thumbnail premise within the first 5 seconds with zero intro logos or chit-chat.

3. **Publishing Cadence Timing**:
   • Consistent day-of-week timing establishes viewer habit loops. Test Sunday 14:00 - 18:00 UTC for maximum weekend browse velocity.`;
    } else if (lower.includes('ctr') || lower.includes('thumbnail') || lower.includes('title')) {
      reply = `🎯 The 3 Golden Rules to Lift CTR from 7% to 11%+:

1. **The 3-Element Rule**:
   • A winning thumbnail contains strictly: 1 Expressive Face + 1 Focal Subject + max 3 words of bold text. Anything more creates visual noise.

2. **Curiosity Gap (Don't Repeat Title)**:
   • If your title is *"I Tested 10 AI Coding Agents"*, your thumbnail should say *"Fired on Day 1"* or show a red error symbol. The thumbnail creates the curiosity; the title delivers the context.

3. **Extreme Contrast on Mobile**:
   • Over 75% of YouTube clicks happen on mobile screens smaller than 6 inches. Shrink your thumbnail to 10% zoom—if the focal point isn't obvious in 0.5 seconds, redesign it.`;
    } else if (lower.includes('revenue') || lower.includes('sponsor') || lower.includes('money') || lower.includes('rpm')) {
      reply = `💰 Revenue Optimization Playbook for ${channelName}:

• **Mid-Roll Ad Stacking**: Ensure videos exceed 8:01 in length. Place natural mid-roll ad breaks right before high-suspense scene transitions (averages +35% RPM).
• **Sponsorship Rate Card**: At your current volume, quote sponsors **$25 - $35 CPM** for dedicated 60-second integrated mid-rolls.
• **Digital Product Back-End**: Launch a Notion template, preset pack, or community. Converting just 0.5% of your viewers often surpasses AdSense revenue by 4x.`;
    } else {
      reply = `💡 Strategic Growth Recommendation for ${channelName}:

Based on your current channel scale (${channelSubs} subscribers in ${channelCategory}):

1. **Binge-Session Architecture**:
   • Use pinned comments and end-screens to create continuous viewing loops linking your top 3 highest-retention videos.

2. **Retention Drop-Off Mitigation**:
   • Cut out all "verbal transitions" (e.g., *"So guys, next up...", "Without further ado"*). Cut straight to the next point.

3. **Community Tab Polling**:
   • Post 2 interactive polls per week to maintain algorithmic feed presence between video uploads.

What specific metric would you like to improve next—CTR, average watch time, or sponsor monetization?`;
    }

    return NextResponse.json({
      reply,
      provider: 'local-heuristic',
      model: 'creator-strategy-engine-v2',
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process AI chat message' },
      { status: 500 }
    );
  }
}
