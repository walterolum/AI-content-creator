const OpenAI = require('openai')
const config = require('../config')

const openai = new OpenAI({ apiKey: config.openai.apiKey })

const SYSTEM_PROMPT = `You are an expert social media content creator and marketing strategist.
You create engaging, platform-optimized content for businesses of all types.
You always include relevant hashtags, emojis, and compelling calls-to-action.
Your content is creative, professional, and tailored to the target audience.
Always format your response with clear sections using markdown headers.`

async function generateContent(params, onChunk) {
  const {
    businessType,
    platform,
    tone,
    goal,
    audience,
    length,
    language,
    topic,
    keywords,
    additionalInfo,
  } = params

  const prompt = `Create a ${length} ${tone} social media post for a ${businessType} business on ${platform}.

Topic/Purpose: ${topic}
Goal: ${goal}
Target Audience: ${audience}
Language: ${language}
${keywords ? `Keywords to include: ${keywords}` : ''}
${additionalInfo ? `Additional context: ${additionalInfo}` : ''}

Please generate:
1. A compelling hook (first line that stops the scroll)
2. A full caption/post body
3. A strong call-to-action (CTA)
4. 10-15 relevant hashtags
5. Emoji suggestions
6. Image/visual prompt suggestion for this post
7. 3 related story/reel ideas
8. 2 poll question ideas for engagement

Make it platform-optimized for ${platform}.`

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1500,
    stream: true,
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''
    if (content && onChunk) {
      onChunk(content)
    }
  }
}

async function rewriteContent(text, action, targetLanguage) {
  const prompts = {
    rewrite: `Rewrite the following content with fresh wording while keeping the same meaning:\n\n${text}`,
    expand: `Expand the following content with more detail and depth:\n\n${text}`,
    shorten: `Shorten the following content to be more concise while keeping the key message:\n\n${text}`,
    translate: `Translate the following content to ${targetLanguage}:\n\n${text}`,
    humanize: `Rewrite the following content to sound more natural and human-like:\n\n${text}`,
    formal: `Rewrite the following content in a more formal, professional tone:\n\n${text}`,
    'add-emojis': `Add relevant emojis to the following content:\n\n${text}`,
    'remove-emojis': `Remove all emojis from the following content:\n\n${text}`,
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a content editor. Rewrite content as requested while maintaining quality.' },
      { role: 'user', content: prompts[action] || prompts.rewrite },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  return response.choices[0].message.content
}

async function generateCalendar(params) {
  const { businessType, platform, tone, duration, topic } = params

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Generate a ${duration}-day content calendar for a ${businessType} business on ${platform}.
Tone: ${tone}
Topic/Focus: ${topic || 'General engagement and brand awareness'}

For each day, provide:
- Post topic/title
- Caption (2-3 sentences)
- Hashtags
- Best posting time suggestion
- Content type (image, video, story, reel, etc.)

Format as a numbered list with clear day markers.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  })

  return response.choices[0].message.content
}

module.exports = { generateContent, rewriteContent, generateCalendar }
