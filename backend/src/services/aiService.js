const { GoogleGenerativeAI } = require('@google/generative-ai')
const config = require('../config')

const hasApiKey = config.google.apiKey && config.google.apiKey.startsWith('AIza')
const genAI = hasApiKey ? new GoogleGenerativeAI(config.google.apiKey) : null

console.log('Gemini API configured:', hasApiKey ? 'Yes' : 'Demo mode (no valid API key)')

function generateDemoContent(params) {
  const { businessType, platform, tone, goal, audience, language, topic, keywords } = params

  const toneMap = {
    professional: { adj: 'professional and polished', adv: 'authoritatively' },
    friendly: { adj: 'warm and inviting', adv: 'warmly' },
    luxury: { adj: 'premium and sophisticated', adv: 'elegantly' },
    funny: { adj: 'witty and fun', adv: 'playfully' },
    inspirational: { adj: 'uplifting and motivational', adv: 'inspiringly' },
    persuasive: { adj: 'convincing and compelling', adv: 'persuasively' },
    educational: { adj: 'informative and clear', adv: 'clearly' },
    corporate: { adj: 'formal and business-like', adv: 'formally' },
    youthful: { adj: 'fresh and energetic', adv: 'energetically' },
  }

  const goalMap = {
    sales: 'drive immediate purchases',
    engagement: 'spark conversation and interaction',
    awareness: 'build brand recognition',
    'lead-generation': 'generate qualified leads',
    'website-traffic': 'drive clicks to their website',
    'brand-growth': 'strengthen brand loyalty and reach',
  }

  const t = toneMap[tone] || toneMap.professional
  const goalDesc = goalMap[goal] || 'engage their audience'
  const aud = audience || 'everyone'
  const kw = keywords && keywords !== 'none' ? ` emphasizing "${keywords}"` : ''

  const hooks = {
    sales: `Ready to transform your experience? ${topic ? topic + ' delivers' : 'We deliver'} results that speak for themselves.`,
    engagement: `Hey ${aud} — here's something you'll love!`,
    awareness: `Have you heard about ${topic || businessType + '?'} It's time to pay attention.`,
    'lead-generation': `Looking for the best ${businessType} solution? Your search ends here.`,
    'website-traffic': `Curious what everyone's talking about? Click through to discover ${topic || 'something amazing'}.`,
    'brand-growth': `Join thousands who trust ${topic || businessType} for quality and care.`,
  }

  const problems = {
    sales: `Tired of options that overpromise and underdeliver?`,
    engagement: `We know finding what truly works can be tough — but it doesn't have to be.`,
    awareness: `Most people settle for less. But you deserve better.`,
    'lead-generation': `Stop wasting time on solutions that don't fit your needs.`,
    'website-traffic': `Don't let great opportunities pass you by while you're stuck searching.`,
    'brand-growth': `It's frustrating when brands don't listen. We hear you.`,
  }

  const solutions = {
    sales: `${topic || 'Our ' + businessType} offers exactly what you need${kw} — quality you can feel, value you can trust.`,
    engagement: `We make it easy with ${t.adj} content that speaks directly to ${aud}.`,
    awareness: `${topic || 'Our ' + businessType} stands out with unmatched quality and care${kw}.`,
    'lead-generation': `With our tailored approach, you get solutions built for ${aud}.`,
    'website-traffic': `Everything you need is just one click away${kw}. See why people love us.`,
    'brand-growth': `We're committed to delivering excellence${kw} — and our community feels it.`,
  }

  const ctas = {
    sales: `Limited spots available. ${tone === 'luxury' ? 'Book your exclusive session now.' : 'Get yours today!'}`,
    engagement: `Drop a comment and let us know what you think!`,
    awareness: `Follow along and be part of something${tone === 'corporate' ? ' exceptional.' : ' amazing.'}`,
    'lead-generation': `Sign up now and see the difference for yourself.`,
    'website-traffic': `Tap the link in bio and see what's waiting for you.`,
    'brand-growth': `Join our community today — you belong here.`,
  }

  const demoContent = `${hooks[goal] || hooks.engagement}
${problems[goal] || problems.engagement}
${solutions[goal] || solutions.sales}
${ctas[goal] || ctas.engagement}`

  return demoContent
}

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
    systemPrompt,
    maxStatements,
  } = params

  const frontendPrompt = systemPrompt

  // Demo mode - no API key needed
  if (!genAI) {
    console.log('Using demo mode for content generation')
    const demoContent = generateDemoContent({
      businessType, platform, tone, goal, audience, length, language, topic, keywords,
    })

    // Simulate streaming by sending content in chunks
    const words = demoContent.split(' ')
    for (const word of words) {
      if (onChunk) {
        onChunk(word + ' ')
      }
      await new Promise(resolve => setTimeout(resolve, 80))
    }
    return
  }

  // Real API call with Gemini — use the frontend's prompt directly
  console.log('Generating ad content with Gemini:', { businessType, platform, tone, topic })

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })

    const result = await model.generateContentStream(
      frontendPrompt
    )

    console.log('Stream started successfully')

    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text && onChunk) {
        onChunk(text)
      }
    }

    console.log('Stream completed')
  } catch (error) {
    console.error('Gemini Error:', error.message)
    throw error
  }
}

async function rewriteContent(text, action, targetLanguage) {
  if (!genAI) {
    // Demo mode
    const demoRewrites = {
      rewrite: `✨ [Rewritten] ${text}\n\nHere's a fresh version of your content with new wording while keeping the same meaning.`,
      expand: `📖 [Expanded] ${text}\n\nLet me add more detail and depth to make this content more comprehensive and engaging for your audience.`,
      shorten: `✂️ [Shortened] ${text.split(' ').slice(0, 20).join(' ')}...`,
      translate: `🌍 [Translated to ${targetLanguage}] This is a demonstration of content translation. In production, this would be translated to ${targetLanguage}.`,
      humanize: `😊 [Humanized] Hey there! ${text} Hope this helps! Let me know if you need anything else.`,
      formal: `📋 [Formal] Dear audience, ${text} We appreciate your continued support and attention.`,
    }
    return demoRewrites[action] || demoRewrites.rewrite
  }

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

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })
  const result = await model.generateContent(
    `You are a content editor. Rewrite content as requested while maintaining quality.\n\n${prompts[action] || prompts.rewrite}`
  )

  return result.response.text()
}

async function generateCalendar(params) {
  const { businessType, platform, tone, duration, topic } = params

  if (!genAI) {
    // Demo mode
    let calendar = `# ${duration}-Day Content Calendar for ${businessType}\n\n`
    for (let i = 1; i <= Math.min(duration, 7); i++) {
      calendar += `## Day ${i}\n`
      calendar += `- **Topic**: ${topic || 'Engagement Post'} - Day ${i}\n`
      calendar += `- **Caption**: Great content for day ${i}! Stay tuned for more updates.\n`
      calendar += `- **Hashtags**: #${businessType.replace(/\s+/g, '')} #Day${i} #Content\n`
      calendar += `- **Best Time**: 9:00 AM - 11:00 AM\n`
      calendar += `- **Type**: Image Post\n\n`
    }
    return calendar
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })
  const result = await model.generateContent(
    `${SYSTEM_PROMPT}\n\nGenerate a ${duration}-day content calendar for a ${businessType} business on ${platform}.
Tone: ${tone}
Topic/Focus: ${topic || 'General engagement and brand awareness'}

For each day, provide:
- Post topic/title
- Caption (2-3 sentences)
- Hashtags
- Best posting time suggestion
- Content type (image, video, story, reel, etc.)

Format as a numbered list with clear day markers.`
  )

  return result.response.text()
}

module.exports = { generateContent, rewriteContent, generateCalendar }
