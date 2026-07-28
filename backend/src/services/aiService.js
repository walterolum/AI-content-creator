const { GoogleGenerativeAI } = require('@google/generative-ai')
const config = require('../config')

const hasApiKey = config.google.apiKey && config.google.apiKey.startsWith('AIza')
const genAI = hasApiKey ? new GoogleGenerativeAI(config.google.apiKey) : null

console.log('Gemini API configured:', hasApiKey ? 'Yes' : 'Demo mode (no valid API key)')

const SYSTEM_PROMPT = `You are an expert social media content creator and marketing strategist.
You create engaging, platform-optimized content for businesses of all types.
You always include relevant hashtags, emojis, and compelling calls-to-action.
Your content is creative, professional, and tailored to the target audience.
Always format your response with clear sections using markdown headers.`

// Demo content generator for testing without API key
function generateDemoContent(params) {
  const { businessType, platform, tone, goal, audience, length, language, topic } = params

  const demoContent = `
# ${topic || 'Social Media Post'}

## Hook
Discover something amazing today! This is what you've been waiting for. ✨

## Caption
We're excited to share our latest ${topic || 'update'} with you! As a trusted ${businessType}, we believe in delivering the best to our ${audience} community. ${tone === 'friendly' ? 'We love seeing your smiles!' : tone === 'luxury' ? 'Experience excellence like never before.' : 'Quality you can trust.'}

Whether you're looking for reliability, quality, or innovation - we've got you covered. Our team has been working hard to bring you something special.

## Call-to-Action
👉 Don't miss out! Visit us today or click the link in bio to learn more. Tag someone who needs to see this!

## Hashtags
#${businessType.replace(/\s+/g, '')} #SocialMedia #Marketing #ContentCreator #${platform}Marketing #BusinessGrowth #${topic ? topic.replace(/\s+/g, '') : 'Content'} #DigitalMarketing #BrandAwareness #Community #Love

## Emoji Suggestions
✨ 🔥 💜 👉 🎯 ⭐ 💡 🚀

## Image Prompt
A vibrant, professional photo featuring ${businessType} products/services with warm lighting, modern aesthetic, and ${tone} vibes. Clean background with subtle branding elements.

## Story Ideas
1. Behind-the-scenes of how we create our ${topic || 'products'}
2. Customer spotlight: Share a success story from our community
3. Quick tips related to ${businessType} that your audience will love

## Poll Questions
1. "What's your favorite thing about our ${businessType}?" - Options: Quality / Price / Service / All of the above
2. "Would you like to see more content about?" - Options: Tips & Tricks / Product Reviews / Behind the Scenes / Customer Stories
`

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
  } = params

  // Demo mode - no API key needed
  if (!genAI) {
    console.log('Using demo mode for content generation')
    const demoContent = generateDemoContent(params)

    // Simulate streaming by sending content in chunks
    const lines = demoContent.split('\n')
    for (const line of lines) {
      if (onChunk) {
        onChunk(line + '\n')
      }
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    return
  }

  // Real API call with Gemini
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

  console.log('Generating content with Gemini:', { businessType, platform, tone, topic })

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })

    const result = await model.generateContentStream(
      `${SYSTEM_PROMPT}\n\n${prompt}`
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
