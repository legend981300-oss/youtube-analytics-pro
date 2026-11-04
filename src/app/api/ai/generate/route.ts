import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface AIGenerateRequest {
  mode: 'titles' | 'description' | 'ideas' | 'script';
  topic: string;
  tone: 'educational' | 'hype' | 'story' | 'controversial';
  niche?: string;
}

/**
 * AI Creator Intelligence API Endpoint
 * 
 * Supports decoupled zero-dependency external AI providers:
 * 1. Google Gemini (GEMINI_API_KEY) -> Gemini 1.5 Flash (Super fast & free tier available)
 * 2. OpenAI (OPENAI_API_KEY) -> GPT-4o-mini
 * 3. Local Deterministic Creator Heuristic Engine -> 100% Free, zero external API keys needed
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AIGenerateRequest = await request.json();
    const { mode, topic, tone, niche = 'General' } = body;

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { error: 'Topic or keyword is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an elite YouTube strategist and retention architect (trained on top creator playbooks like MrBeast, Ali Abdaal, and Paddy Galloway).
Your goal is to provide high-CTR, retention-optimized, authentic YouTube metadata and scripts for creators.
Format your response as valid, pure JSON without Markdown code fences.`;

    let userPrompt = '';

    if (mode === 'titles') {
      userPrompt = `Generate 5 viral, high-CTR YouTube video titles for the topic: "${topic}".
Tone: ${tone}. Niche: ${niche}.
Return a JSON array of objects with the structure:
[
  { "title": "Title here", "pattern": "e.g. Curiosity Gap / Contrarian / Number Hook", "estimatedCtr": "e.g. 11.4%", "characterCount": 48 }
]`;
    } else if (mode === 'description') {
      userPrompt = `Generate an SEO-optimized YouTube video description for the topic: "${topic}".
Tone: ${tone}. Niche: ${niche}.
Include a captivating hook (first 2 lines), structured value overview, chapter timestamps (0:00 to 12:45), resource links, and search keywords.
Return a JSON object:
{
  "hook": "first 2 lines for search preview",
  "fullDescription": "Complete description text with timestamps and links",
  "recommendedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;
    } else if (mode === 'ideas') {
      userPrompt = `Generate 4 creative, breakout YouTube video ideas around: "${topic}".
Tone: ${tone}. Niche: ${niche}.
Return a JSON array of objects:
[
  { "concept": "Title/Idea", "thumbnailConcept": "Visual description of thumbnail", "difficulty": "Low|Medium|High", "viralPotential": "Very High|High" }
]`;
    } else if (mode === 'script') {
      userPrompt = `Create a retention-optimized video script outline for: "${topic}".
Tone: ${tone}. Niche: ${niche}.
Return a JSON object:
{
  "title": "Working Title",
  "first10SecondsHook": "Exact visual action and opening spoken sentence to stop scrolling",
  "theProblem": "Why the viewer must care right now",
  "keyPoints": [
    { "timestamp": "01:15", "headline": "Point 1", "talkingPoints": "Details" },
    { "timestamp": "04:30", "headline": "Point 2", "talkingPoints": "Details" },
    { "timestamp": "08:15", "headline": "Point 3", "talkingPoints": "Details" }
  ],
  "callToAction": "Natural bridge to subscribe or watch next video"
}`;
    }

    // 1. Google Gemini 1.5 Flash Provider (if GEMINI_API_KEY is configured)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && !geminiKey.includes('placeholder') && geminiKey.length > 10) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1200,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          const cleanJson = rawText.replace(/```json\n?|```/g, '').trim();
          const parsedData = JSON.parse(cleanJson);

          return NextResponse.json({
            provider: 'gemini',
            model: 'gemini-1.5-flash',
            data: parsedData,
            generatedAt: new Date().toISOString(),
          });
        }
      } catch (geminiErr) {
        console.warn('[AI API] Gemini call failed, falling back to alternative or local engine');
      }
    }

    // 2. OpenAI GPT-4o-mini Provider (if OPENAI_API_KEY is configured)
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.startsWith('sk-') && !apiKey.includes('placeholder')) {
      try {
        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1200,
          }),
        });

        if (openAiRes.ok) {
          const completion = await openAiRes.json();
          const rawContent = completion.choices?.[0]?.message?.content || '{}';
          const cleanJson = rawContent.replace(/```json\n?|```/g, '').trim();
          const parsedData = JSON.parse(cleanJson);

          return NextResponse.json({
            provider: 'openai',
            model: 'gpt-4o-mini',
            data: parsedData,
            generatedAt: new Date().toISOString(),
          });
        }
      } catch (openAiErr) {
        console.warn('[AI API] OpenAI call failed, falling back to local creator heuristics');
      }
    }

    // 2. Enhanced Local Creator Heuristic Engine (100% Free & Fast Fallback)
    const capitalizedTopic = topic.trim();
    let localResult: any;

    if (mode === 'titles') {
      const toneModifiers: Record<string, string[]> = {
        educational: [
          `The Ultimate Guide to ${capitalizedTopic} (Step-by-Step)`,
          `How I Mastered ${capitalizedTopic} in 30 Days`,
          `5 Secrets About ${capitalizedTopic} Experts Never Tell You`,
          `${capitalizedTopic} Explained for Beginners: Everything You Need`,
          `Stop Doing ${capitalizedTopic} Like This (Do This Instead)`,
        ],
        hype: [
          `I Tested ${capitalizedTopic} for 100 Hours (SHOCKING Results)`,
          `Why Everyone is WRONG About ${capitalizedTopic}!`,
          `This ${capitalizedTopic} Breakthrough Changes EVERYTHING`,
          `I Spent \$10,000 on ${capitalizedTopic} So You Don't Have To`,
          `The Future of ${capitalizedTopic} is Insane!`,
        ],
        story: [
          `How ${capitalizedTopic} Accidentally Changed My Entire Career`,
          `The Truth About ${capitalizedTopic} Nobody Wants to Admit`,
          `I Almost Quit ${capitalizedTopic}... Until This Happened`,
          `What 5 Years of ${capitalizedTopic} Taught Me About Success`,
          `My Biggest Mistakes With ${capitalizedTopic} and What I Learned`,
        ],
        controversial: [
          `Why You Need to STOP Learning ${capitalizedTopic} in 2026`,
          `${capitalizedTopic} is a Trap (And Here's the Real Data)`,
          `The Brutal Reality of ${capitalizedTopic} No One Mentions`,
          `Why 99% of People Fail at ${capitalizedTopic}`,
          `Unpopular Opinion: ${capitalizedTopic} is Overrated`,
        ],
      };

      const patterns = [
        'Curiosity Gap',
        'Contrarian Hook',
        'Direct Value Promise',
        'Extreme Challenge',
        'Mistake Avoidance',
      ];

      const titles = (toneModifiers[tone] || toneModifiers.educational).map((title, i) => ({
        title,
        pattern: patterns[i % patterns.length],
        estimatedCtr: `${(8.5 + (i * 1.3)).toFixed(1)}%`,
        characterCount: title.length,
      }));

      localResult = titles;
    } else if (mode === 'description') {
      localResult = {
        hook: `Everything you need to know about ${capitalizedTopic}. Master this strategy to accelerate your creator growth.`,
        fullDescription: `In this video, we break down ${capitalizedTopic} from first principles. Whether you are just getting started or looking to level up your workflow, this comprehensive breakdown gives you actionable takeaways.\n\n📌 TIMESTAMPS:\n0:00 - Introduction & The Core Problem\n01:45 - Key Fundamentals of ${capitalizedTopic}\n04:20 - Step-by-Step Blueprint\n08:15 - The Biggest Pitfalls to Avoid\n11:30 - Final Recommendations & Next Steps\n\n🔗 HELPFUL RESOURCES:\n- Free Creator Toolkit: https://creatorsuite.io/resources\n- Community Discord: https://discord.gg/creators\n\n#${capitalizedTopic.replace(/\s+/g, '')} #YouTubeCreator #AnalyticsPro`,
        recommendedTags: [
          capitalizedTopic.toLowerCase(),
          `${capitalizedTopic.toLowerCase()} tutorial`,
          `${capitalizedTopic.toLowerCase()} guide`,
          'creator tips',
          'youtube growth',
        ],
      };
    } else if (mode === 'ideas') {
      localResult = [
        {
          concept: `The 2026 ${capitalizedTopic} Playbook: What's Working Right Now`,
          thumbnailConcept: `Split face comparison with high-contrast text: 'NEW RULES'`,
          difficulty: 'Medium',
          viralPotential: 'Very High',
        },
        {
          concept: `I Tried ${capitalizedTopic} for 7 Days Straight`,
          thumbnailConcept: `Day 1 vs Day 7 dramatic before-and-after with arrow pointer`,
          difficulty: 'Low',
          viralPotential: 'High',
        },
        {
          concept: `The Dark Side of ${capitalizedTopic} (Deep Dive Documentary)`,
          thumbnailConcept: `Moody cinematic lighting with bold yellow question mark`,
          difficulty: 'High',
          viralPotential: 'Very High',
        },
        {
          concept: `5 Free Tools for ${capitalizedTopic} That Feel Illegal to Know`,
          thumbnailConcept: `Grid of sleek software icons with '100% FREE' banner`,
          difficulty: 'Low',
          viralPotential: 'High',
        },
      ];
    } else if (mode === 'script') {
      localResult = {
        title: `Mastering ${capitalizedTopic}: The Complete Creator Blueprint`,
        first10SecondsHook: `(Visual: Close-up face cam holding problem prop) "Most people approach ${capitalizedTopic} completely backwards, costing them months of wasted effort. In the next 8 minutes, I will show you the exact system that fixes this forever."`,
        theProblem: `Creators struggle because they focus on surface tactics rather than the foundational retention driver behind ${capitalizedTopic}.`,
        keyPoints: [
          {
            timestamp: '01:15',
            headline: 'Foundational Principle',
            talkingPoints: `Establish why ${capitalizedTopic} matters and how the YouTube algorithm rewards viewer satisfaction here.`,
          },
          {
            timestamp: '04:30',
            headline: 'The Step-by-Step Framework',
            talkingPoints: `Show concrete visual examples, on-screen checklists, and common beginner pitfalls.`,
          },
          {
            timestamp: '08:15',
            headline: 'Optimization & Automation',
            talkingPoints: `Give viewers 3 specific actions they can implement today to see results within 48 hours.`,
          },
        ],
        callToAction: `If this breakdown helped you rethink ${capitalizedTopic}, check out our deep-dive analysis linked on screen right now!`,
      };
    }

    return NextResponse.json({
      provider: 'local-engine',
      model: 'heuristic-creator-model-v2',
      data: localResult,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[AI API] Handler error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI generation request' },
      { status: 500 }
    );
  }
}
