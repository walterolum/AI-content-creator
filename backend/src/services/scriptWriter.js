const config = require('../config')

const hasApiKey = config.google.apiKey && config.google.apiKey.startsWith('AIza')
let GoogleGenerativeAI, genAI
if (hasApiKey) {
  const mod = require('@google/generative-ai')
  GoogleGenerativeAI = mod.GoogleGenerativeAI
  genAI = new GoogleGenerativeAI(config.google.apiKey)
} else {
  genAI = null
}

const SCENE_TYPES = ['opening', 'problem', 'solution', 'feature', 'testimonial', 'cta', 'closing']

const TRANSITIONS = ['fade', 'dissolve', 'wipe', 'slide', 'zoom', 'blur']

const CAMERA_ANGLES = ['eye-level', 'low-angle', 'high-angle', 'close-up', 'wide', 'dolly', 'tracking']

const LIGHTING_STYLES = ['warm', 'cool', 'dramatic', 'soft', 'natural', 'neon', 'golden-hour', 'studio']

const SCENE_TEMPLATES = {
  commercial: [
    { type: 'opening', duration: 5, transition: 'fade' },
    { type: 'problem', duration: 6, transition: 'slide' },
    { type: 'solution', duration: 7, transition: 'dissolve' },
    { type: 'feature', duration: 5, transition: 'slide' },
    { type: 'cta', duration: 5, transition: 'zoom' },
    { type: 'closing', duration: 2, transition: 'fade' },
  ],
  social: [
    { type: 'opening', duration: 4, transition: 'zoom' },
    { type: 'problem', duration: 5, transition: 'slide' },
    { type: 'solution', duration: 6, transition: 'dissolve' },
    { type: 'cta', duration: 4, transition: 'fade' },
    { type: 'closing', duration: 2, transition: 'fade' },
  ],
  explainer: [
    { type: 'opening', duration: 5, transition: 'fade' },
    { type: 'problem', duration: 7, transition: 'slide' },
    { type: 'solution', duration: 8, transition: 'dissolve' },
    { type: 'feature', duration: 6, transition: 'slide' },
    { type: 'testimonial', duration: 5, transition: 'dissolve' },
    { type: 'cta', duration: 5, transition: 'zoom' },
    { type: 'closing', duration: 2, transition: 'fade' },
  ],
  educational: [
    { type: 'opening', duration: 6, transition: 'fade' },
    { type: 'problem', duration: 6, transition: 'wipe' },
    { type: 'solution', duration: 8, transition: 'dissolve' },
    { type: 'feature', duration: 7, transition: 'slide' },
    { type: 'cta', duration: 5, transition: 'fade' },
    { type: 'closing', duration: 2, transition: 'fade' },
  ],
  testimonial: [
    { type: 'opening', duration: 4, transition: 'fade' },
    { type: 'problem', duration: 6, transition: 'dissolve' },
    { type: 'testimonial', duration: 8, transition: 'slide' },
    { type: 'solution', duration: 6, transition: 'dissolve' },
    { type: 'cta', duration: 5, transition: 'zoom' },
    { type: 'closing', duration: 2, transition: 'fade' },
  ],
}

const MOOD_WORDS = {
  opening: { professional: 'confident', friendly: 'warm', luxury: 'sophisticated', funny: 'playful', inspirational: 'uplifting', persuasive: 'bold', educational: 'curious', corporate: 'authoritative', youthful: 'energetic' },
  problem: { professional: 'concerned', friendly: 'relatable', luxury: 'discerning', funny: 'humorous', inspirational: 'empathetic', persuasive: 'urgent', educational: 'intriguing', corporate: 'serious', youthful: 'frustrated' },
  solution: { professional: 'assured', friendly: 'cheerful', luxury: 'elegant', funny: 'delighted', inspirational: 'hopeful', persuasive: 'triumphant', educational: 'enlightened', corporate: 'resolved', youthful: 'excited' },
  feature: { professional: 'informative', friendly: 'engaging', luxury: 'prestigious', funny: 'entertaining', inspirational: 'inspiring', persuasive: 'convincing', educational: 'detailed', corporate: 'precise', youthful: 'cool' },
  testimonial: { professional: 'credible', friendly: 'genuine', luxury: 'refined', funny: 'amused', inspirational: 'heartfelt', persuasive: 'trustworthy', educational: 'knowledgeable', corporate: 'reliable', youthful: 'authentic' },
  cta: { professional: 'compelling', friendly: 'inviting', luxury: 'exclusive', funny: 'irresistible', inspirational: 'motivational', persuasive: 'urgent', educational: 'encouraging', corporate: 'decisive', youthful: 'now-or-never' },
  closing: { professional: 'memorable', friendly: 'warm', luxury: 'timeless', funny: 'fun', inspirational: 'powerful', persuasive: 'lasting', educational: 'thoughtful', corporate: 'strong', youthful: 'unforgettable' },
}

const B_ROLL_SUGGESTIONS = {
  opening: {
    restaurant: ['sizzling pan close-up', 'steam rising from dish', 'ambient dining room', 'chef plating food'],
    fashion: ['garment texture detail', 'mannequin display', 'fabric flowing', 'color swatches'],
    salon: ['scissors cutting hair', 'brush strokes', 'product bottles', 'client smiling'],
    pharmacy: ['medicine bottles on shelf', 'pharmacist at counter', 'customer being helped', 'health products display'],
    school: ['students in classroom', 'books opening', 'teacher writing on board', 'campus walkway'],
    church: ['congregation gathering', 'choir singing', 'stained glass light', 'hands raised in worship'],
    technology: ['circuit board detail', 'code on screen', 'device in hand', 'data visualization'],
    ecommerce: ['package being packed', 'delivery truck', 'unboxing', 'customer opening package'],
    default: ['slow motion product reveal', 'elegant backdrop', 'light rays through window', 'professional workspace'],
  },
  problem: {
    default: ['frustrated expression', 'clock ticking', 'crowded space', 'confused look'],
  },
  solution: {
    default: ['smiling customer', 'product in use', 'transformation shot', 'happy results'],
  },
  feature: {
    default: ['product detail close-up', 'feature demonstration', 'side-by-side comparison', 'quality craftsmanship'],
  },
  cta: {
    default: ['phone screen with action', 'hand reaching out', 'light burst', 'button pressing'],
  },
  closing: {
    default: ['logo animation', 'brand colors dissolve', 'fade to black', 'tagline reveal'],
  },
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateNarration(sceneType, params) {
  const { businessType, tone, goal, audience, topic, keywords } = params
  const aud = audience || 'everyone'
  const kw = keywords && keywords !== 'none' ? keywords : topic

  const narrations = {
    opening: [
      `Hey ${aud}, let me tell you about something game-changing.`,
      `Imagine if ${topic} could transform the way you experience ${businessType}.`,
      `Every great story starts with a spark. Here's ours.`,
      `You deserve the best ${businessType} experience. Period.`,
      `For ${aud} who demand more — this is for you.`,
    ],
    problem: [
      `Tired of solutions that just don't deliver? You're not alone.`,
      `The truth is, most ${businessType} options fall short of what ${aud} truly need.`,
      `Why settle for less when you could have the best?`,
      `Here's the problem: you've been settling. And you know it.`,
      `Most ${aud} struggle with finding the right ${businessType} — but it doesn't have to be that way.`,
    ],
    solution: [
      `That's where ${topic} changes everything.`,
      `Introducing a smarter way to experience ${businessType}.`,
      `${topic} was built specifically for ${aud} who refuse to compromise.`,
      `Finally, a ${businessType} solution that actually works the way you expect.`,
      `We created ${topic} to solve exactly this problem — and it works.`,
    ],
    feature: [
      `With ${kw ? kw + ', ' : ''}you get quality that speaks for itself.`,
      `Here's what makes ${topic} different: every detail matters.`,
      `${topic} comes packed with everything ${aud} need to succeed.`,
      `From seamless experience to lasting results — we've covered it all.`,
    ],
    testimonial: [
      `Don't just take our word for it. ${aud} everywhere are loving the results.`,
      `Real people, real results. See why ${aud} choose ${topic}.`,
      `Hear from our community: they're experiencing the difference every day.`,
    ],
    cta: [
      `Ready to experience the difference? Act now.`,
      `Your journey starts today. Don't wait another moment.`,
      `Take the first step — ${aud} deserve the best.`,
      `Limited opportunity. Unlimited potential. Start now.`,
    ],
    closing: [
      `${topic} — because you deserve more.`,
      `This is your moment. Make it count with ${topic}.`,
      `Join the movement. Experience ${topic} today.`,
    ],
  }

  const pool = narrations[sceneType] || narrations.opening
  return pickRandom(pool)
}

function generateOnScreenText(sceneType, topic, tone) {
  const maps = {
    opening: [`${topic}`, `INTRODUCING ${topic}`, `THE FUTURE OF ${topic?.toUpperCase() || 'EVERYTHING'}`, `WELCOME TO ${topic?.toUpperCase() || 'MORE'}`],
    problem: ['THE PROBLEM', 'FACING REALITY', 'THE STRUGGLE IS REAL', 'NOT ALL IS WELL'],
    solution: ['THE SOLUTION', 'HERE IS THE ANSWER', 'GAME CHANGER', 'THIS CHANGES EVERYTHING'],
    feature: ['WHAT SETS US APART', 'BUILT DIFFERENT', 'PREMIUM QUALITY', 'UNMATCHED VALUE'],
    testimonial: ['REAL RESULTS', 'TRUSTED BY MANY', 'LOVED BY CUSTOMERS', 'COMMUNITY FIRST'],
    cta: ['ACT NOW', 'GET STARTED TODAY', "DON'T MISS OUT", 'LIMITED TIME'],
    closing: [`${topic}`, 'YOUR FUTURE AWAITS', 'EXPERIENCE THE DIFFERENCE', 'GO BEYOND'],
  }
  const pool = maps[sceneType] || maps.opening
  return pickRandom(pool)
}

function generateBRoll(sceneType, businessType) {
  const biz = B_ROLL_SUGGESTIONS[sceneType]
  if (!biz) return B_ROLL_SUGGESTIONS.opening.default.slice(0, 2)
  const pool = biz[businessType] || biz.default || B_ROLL_SUGGESTIONS.opening.default
  return [pickRandom(pool), pickRandom(pool)]
}

function generateScene(sceneTemplate, index, params) {
  const { businessType, tone, topic, platform } = params
  const moodMap = MOOD_WORDS[sceneTemplate.type] || MOOD_WORDS.opening
  const mood = moodMap[tone] || moodMap.professional || 'neutral'

  return {
    id: `scene-${index + 1}`,
    type: sceneTemplate.type,
    title: generateOnScreenText(sceneTemplate.type, topic || businessType, tone),
    narration: generateNarration(sceneTemplate.type, params),
    onScreenText: generateOnScreenText(sceneTemplate.type, topic || businessType, tone),
    duration: sceneTemplate.duration,
    transition: sceneTemplate.transition,
    transitionDuration: 0.4 + Math.random() * 0.3,
    cameraAngle: pickRandom(CAMERA_ANGLES),
    lighting: pickRandom(LIGHTING_STYLES),
    bRoll: generateBRoll(sceneTemplate.type, businessType),
    soundEffects: sceneTemplate.type === 'opening' ? ['whoosh'] : sceneTemplate.type === 'closing' ? ['logo sting'] : ['subtle transition'],
    mood,
    colorPalette: ['#1a1a2e', '#16213e', '#0f3460'],
    animation: sceneTemplate.type === 'opening' ? 'text-slide-up' : sceneTemplate.type === 'cta' ? 'text-pulse' : 'text-fade-in',
    lowerThird: null,
  }
}

function generateScript(params) {
  const { businessType, platform, tone, goal, audience, topic, keywords } = params
  const isShort = platform === 'tiktok' || platform === 'threads'
  const videoType = platform === 'linkedin' ? 'corporate' : platform === 'youtube' ? 'explainer' : isShort ? 'social' : 'commercial'
  const template = SCENE_TEMPLATES[videoType] || SCENE_TEMPLATES.commercial

  const scenes = template.map((t, i) => generateScene(t, i, params))

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0)

  const musicGenreMap = {
    professional: 'corporate', friendly: 'acoustic', luxury: 'luxury',
    funny: 'upbeat', inspirational: 'cinematic', persuasive: 'modern',
    educational: 'piano', corporate: 'corporate', youthful: 'electronic',
  }

  return {
    title: topic || `${businessType} Advertisement`,
    videoType,
    platform: platform || 'instagram',
    totalDuration,
    scenes,
    musicGenre: musicGenreMap[tone] || 'cinematic',
    musicMood: 'uplifting',
    brandName: topic || businessType,
    keywords: keywords && keywords !== 'none' ? keywords.split(',').map(k => k.trim()) : [],
  }
}

async function generateScriptAPI(params, onChunk) {
  if (!genAI) {
    const script = generateScript(params)
    const json = JSON.stringify(script, null, 2)
    const lines = json.match(/.{1,80}/g) || [json]
    for (const line of lines) {
      if (onChunk) onChunk(line)
      await new Promise(resolve => setTimeout(resolve, 20))
    }
    return script
  }

  const prompt = `You are a professional video script writer. Generate a complete video advertisement script as JSON.

BUSINESS: ${params.businessType}
PLATFORM: ${params.platform}
TONE: ${params.tone}
GOAL: ${params.goal}
AUDIENCE: ${params.audience}
TOPIC: ${params.topic}
KEYWORDS: ${params.keywords || 'none'}

Generate a JSON object with this EXACT structure (no markdown, no explanation, ONLY valid JSON):
{
  "title": "string - video title",
  "videoType": "commercial|social|explainer|educational|testimonial",
  "platform": "${params.platform}",
  "totalDuration": number - sum of all scene durations in seconds (25-35),
  "scenes": [
    {
      "id": "scene-1",
      "type": "opening|problem|solution|feature|testimonial|cta|closing",
      "title": "on-screen headline text (short, punchy)",
      "narration": "voiceover text (1-2 sentences, conversational for the tone)",
      "onScreenText": "same as title",
      "duration": number - seconds for this scene (3-8),
      "transition": "fade|dissolve|wipe|slide|zoom",
      "transitionDuration": 0.4,
      "cameraAngle": "eye-level|low-angle|high-angle|close-up|wide",
      "lighting": "warm|cool|dramatic|soft|natural",
      "bRoll": ["b-roll description 1", "b-roll description 2"],
      "soundEffects": ["sound effect"],
      "mood": "string matching the tone and scene type",
      "animation": "text-slide-up|text-fade-in|text-pulse",
      "lowerThird": null
    }
  ],
  "musicGenre": "cinematic|corporate|upbeat|luxury|modern|jazz|electronic|acoustic|piano",
  "musicMood": "uplifting|dramatic|calm|energetic|sophisticated",
  "brandName": "${params.topic || params.businessType}",
  "keywords": ["keyword1", "keyword2"]
}

IMPORTANT: 
- Each scene narration must be SHORT (max 20 words) and match the ${params.tone} tone
- The ${params.goal} goal must drive every scene
- Speak directly to ${params.audience}
- Total MUST be around 30 seconds
- NO markdown, NO comments, ONLY valid JSON`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })
    const result = await model.generateContentStream(prompt)

    let fullText = ''
    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text && onChunk) {
        fullText += text
        onChunk(text)
      }
    }

    const cleaned = fullText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    return JSON.parse(cleaned)
  } catch (error) {
    console.error('Gemini script error:', error.message)
    return generateScript(params)
  }
}

module.exports = { generateScript, generateScriptAPI, SCENE_TYPES, TRANSITIONS }
