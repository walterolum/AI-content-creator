// Professional Audio System with Voice Selection and Content Filtering

// Clean content for speech (remove hashtags, emojis, special characters)
export function cleanContentForSpeech(text) {
  if (!text) return ''

  let cleaned = text
    // Remove emojis
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
    // Remove hashtags
    .replace(/#\w+/g, '')
    // Remove markdown headers
    .replace(/^#{1,6}\s/gm, '')
    // Remove markdown formatting
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    // Remove URLs
    .replace(/https?:\/\/\S+/g, '')
    // Remove "Click to" and similar CTA phrases for cleaner reading
    .replace(/click here/gi, '')
    .replace(/tap here/gi, '')
    // Remove multiple spaces
    .replace(/\s+/g, ' ')
    // Remove list markers
    .replace(/^\d+\.\s/gm, '')
    .replace(/^[-*]\s/gm, '')
    .trim()

  return cleaned
}

// Voice profiles for professional advertising
export const voiceProfiles = [
  {
    id: 'professional-male',
    name: 'Professional Male',
    description: 'Deep, authoritative male voice for corporate content',
    rate: 0.9,
    pitch: 0.8,
    preferred: ['Google UK English Male', 'Daniel', 'Alex']
  },
  {
    id: 'professional-female',
    name: 'Professional Female',
    description: 'Clear, confident female voice for business content',
    rate: 0.9,
    pitch: 1.1,
    preferred: ['Google UK English Female', 'Samantha', 'Victoria']
  },
  {
    id: 'friendly-male',
    name: 'Friendly Male',
    description: 'Warm, approachable male voice for social content',
    rate: 1.0,
    pitch: 0.9,
    preferred: ['Google US English', 'Tom', 'Jason']
  },
  {
    id: 'friendly-female',
    name: 'Friendly Female',
    description: 'Warm, engaging female voice for lifestyle content',
    rate: 1.0,
    pitch: 1.2,
    preferred: ['Google US English', 'Karen', 'Moira']
  },
  {
    id: 'energetic',
    name: 'Energetic',
    description: 'Upbeat voice for promotional content',
    rate: 1.1,
    pitch: 1.0,
    preferred: ['Google US English', 'Fred']
  },
  {
    id: 'calm',
    name: 'Calm & Soothing',
    description: 'Relaxed voice for wellness and lifestyle',
    rate: 0.85,
    pitch: 1.0,
    preferred: ['Google UK English Female', 'Veena']
  },
  {
    id: 'news-anchor',
    name: 'News Anchor',
    description: 'Formal, authoritative voice for announcements',
    rate: 0.95,
    pitch: 0.85,
    preferred: ['Google UK English Male', 'Daniel']
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    description: 'Expressive voice for brand storytelling',
    rate: 0.9,
    pitch: 1.0,
    preferred: ['Google UK English Female', 'Samantha']
  },
]

let currentUtterance = null

// Get available voices
export function getAvailableVoices() {
  return new Promise((resolve) => {
    let voices = speechSynthesis.getVoices()
    if (voices.length > 0) {
      resolve(voices)
    } else {
      speechSynthesis.onvoiceschanged = () => {
        resolve(speechSynthesis.getVoices())
      }
    }
  })
}

// Find best matching voice
function findVoice(profile) {
  const voices = speechSynthesis.getVoices()

  // Try preferred voices first
  for (const preferred of profile.preferred) {
    const found = voices.find(v =>
      v.name.includes(preferred) || v.name === preferred
    )
    if (found) return found
  }

  // Fallback to any English voice
  const englishVoice = voices.find(v => v.lang.startsWith('en'))
  return englishVoice || voices[0]
}

// Main speech function
export function speak(text, profileId = 'professional-male', onEnd = null) {
  // Stop any current speech
  stopSpeech()

  const profile = voiceProfiles.find(p => p.id === profileId) || voiceProfiles[0]
  const cleanedText = cleanContentForSpeech(text)

  if (!cleanedText) {
    console.warn('No text to speak after cleaning')
    return
  }

  currentUtterance = new SpeechSynthesisUtterance(cleanedText)
  currentUtterance.rate = profile.rate
  currentUtterance.pitch = profile.pitch
  currentUtterance.volume = 1
  currentUtterance.lang = 'en-US'

  const voice = findVoice(profile)
  if (voice) {
    currentUtterance.voice = voice
  }

  currentUtterance.onend = () => {
    currentUtterance = null
    if (onEnd) onEnd()
  }

  currentUtterance.onerror = (e) => {
    console.error('Speech error:', e)
    currentUtterance = null
    if (onEnd) onEnd()
  }

  speechSynthesis.speak(currentUtterance)
}

// Stop speech
export function stopSpeech() {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel()
  }
  currentUtterance = null
}

// Pause speech
export function pauseSpeech() {
  if (speechSynthesis.speaking) {
    speechSynthesis.pause()
  }
}

// Resume speech
export function resumeSpeech() {
  if (speechSynthesis.paused) {
    speechSynthesis.resume()
  }
}

// Check if speaking
export function isSpeaking() {
  return speechSynthesis.speaking
}

// Check if paused
export function isPaused() {
  return speechSynthesis.paused
}

// Get speech progress (estimated)
export function getSpeechProgress() {
  if (!currentUtterance) return 0
  // This is approximate - Web Speech API doesn't provide real progress
  return speechSynthesis.speaking ? 0.5 : 0
}
