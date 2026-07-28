// Professional Audio System with Voice Selection, Background Music, and Mixing

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
    // Remove list markers
    .replace(/^\d+\.\s/gm, '')
    .replace(/^[-*]\s/gm, '')
    // Remove section labels but keep content
    .replace(/## Hook/gi, '')
    .replace(/## Caption/gi, '')
    .replace(/## Call-to-Action/gi, '')
    .replace(/## CTA/gi, '')
    .replace(/## Hashtags/gi, '')
    // Remove multiple spaces
    .replace(/\s+/g, ' ')
    .trim()

  return cleaned
}

// Voice profiles for professional advertising
export const voiceProfiles = [
  {
    id: 'cinematic-male',
    name: 'Cinematic Male',
    description: 'Deep, dramatic voice for movie-style trailers',
    rate: 0.85,
    pitch: 0.7,
    preferred: ['Google UK English Male', 'Daniel', 'Alex'],
    style: 'cinematic',
  },
  {
    id: 'cinematic-female',
    name: 'Cinematic Female',
    description: 'Strong, commanding voice for dramatic content',
    rate: 0.85,
    pitch: 1.0,
    preferred: ['Google UK English Female', 'Samantha', 'Victoria'],
    style: 'cinematic',
  },
  {
    id: 'professional-male',
    name: 'Professional Male',
    description: 'Deep, authoritative male voice for corporate content',
    rate: 0.9,
    pitch: 0.8,
    preferred: ['Google UK English Male', 'Daniel', 'Alex'],
    style: 'professional',
  },
  {
    id: 'professional-female',
    name: 'Professional Female',
    description: 'Clear, confident female voice for business content',
    rate: 0.9,
    pitch: 1.1,
    preferred: ['Google UK English Female', 'Samantha', 'Victoria'],
    style: 'professional',
  },
  {
    id: 'modern-male',
    name: 'Modern Male',
    description: 'Young, trendy voice for social media',
    rate: 1.0,
    pitch: 0.9,
    preferred: ['Google US English', 'Tom', 'Jason'],
    style: 'modern',
  },
  {
    id: 'modern-female',
    name: 'Modern Female',
    description: 'Fresh, engaging voice for lifestyle content',
    rate: 1.0,
    pitch: 1.2,
    preferred: ['Google US English', 'Karen', 'Moira'],
    style: 'modern',
  },
  {
    id: 'luxury',
    name: 'Luxury Voice',
    description: 'Elegant, sophisticated voice for premium brands',
    rate: 0.8,
    pitch: 0.9,
    preferred: ['Google UK English Female', 'Samantha'],
    style: 'luxury',
  },
  {
    id: 'energetic',
    name: 'Energetic',
    description: 'High-energy voice for promotions and sales',
    rate: 1.15,
    pitch: 1.0,
    preferred: ['Google US English', 'Fred'],
    style: 'energetic',
  },
  {
    id: 'narrator',
    name: 'Documentary Narrator',
    description: 'Authoritative voice for storytelling',
    rate: 0.88,
    pitch: 0.85,
    preferred: ['Google UK English Male', 'Daniel'],
    style: 'narrator',
  },
  {
    id: 'news',
    name: 'News Anchor',
    description: 'Formal voice for announcements',
    rate: 0.95,
    pitch: 0.9,
    preferred: ['Google US English', 'Alex'],
    style: 'news',
  },
]

let currentUtterance = null
let backgroundMusicNode = null
let audioContext = null
let isBackgroundPlaying = false

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

  for (const preferred of profile.preferred) {
    const found = voices.find(v =>
      v.name.includes(preferred) || v.name === preferred
    )
    if (found) return found
  }

  return voices.find(v => v.lang.startsWith('en')) || voices[0]
}

// Generate background music buffer
function createBackgroundMusic(duration = 30) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }

  const sampleRate = audioContext.sampleRate
  const samples = sampleRate * duration
  const buffer = audioContext.createBuffer(2, samples, sampleRate)

  const leftChannel = buffer.getChannelData(0)
  const rightChannel = buffer.getChannelData(1)

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate

    // Ambient pad sound
    const pad1 = Math.sin(2 * Math.PI * 110 * t) * 0.04
    const pad2 = Math.sin(2 * Math.PI * 165 * t) * 0.03
    const pad3 = Math.sin(2 * Math.PI * 220 * t) * 0.02
    const pad4 = Math.sin(2 * Math.PI * 330 * t) * 0.01

    // Slow modulation for movement
    const mod = Math.sin(2 * Math.PI * 0.08 * t) * 0.3 + 0.7

    // Fade in/out
    const fadeTime = 2
    let envelope = 1
    if (t < fadeTime) envelope = t / fadeTime
    if (t > duration - fadeTime) envelope = (duration - t) / fadeTime

    const sample = (pad1 + pad2 + pad3 + pad4) * mod * envelope * 0.5

    leftChannel[i] = sample
    rightChannel[i] = sample * (0.95 + Math.random() * 0.05)
  }

  return buffer
}

// Play background music
export function playBackgroundMusic(duration = 30) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }

  stopBackgroundMusic()

  const buffer = createBackgroundMusic(duration)
  const source = audioContext.createBufferSource()
  source.buffer = buffer

  const gainNode = audioContext.createGain()
  gainNode.gain.value = 0.3

  source.connect(gainNode)
  gainNode.connect(audioContext.destination)

  source.start()
  backgroundMusicNode = { source, gainNode }
  isBackgroundPlaying = true

  source.onended = () => {
    isBackgroundPlaying = false
  }
}

// Stop background music
export function stopBackgroundMusic() {
  if (backgroundMusicNode) {
    try {
      backgroundMusicNode.source.stop()
    } catch (e) {}
    backgroundMusicNode = null
  }
  isBackgroundPlaying = false
}

// Main speech function with background music
export function speak(text, profileId = 'cinematic-male', withMusic = true, onEnd = null) {
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

  // Start background music if requested
  if (withMusic) {
    playBackgroundMusic(30)
  }

  currentUtterance.onend = () => {
    currentUtterance = null
    stopBackgroundMusic()
    if (onEnd) onEnd()
  }

  currentUtterance.onerror = (e) => {
    console.error('Speech error:', e)
    currentUtterance = null
    stopBackgroundMusic()
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
  stopBackgroundMusic()
}

// Pause speech
export function pauseSpeech() {
  if (speechSynthesis.speaking) {
    speechSynthesis.pause()
  }
  if (backgroundMusicNode) {
    backgroundMusicNode.gainNode.gain.value = 0.1
  }
}

// Resume speech
export function resumeSpeech() {
  if (speechSynthesis.paused) {
    speechSynthesis.resume()
  }
  if (backgroundMusicNode) {
    backgroundMusicNode.gainNode.gain.value = 0.3
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

// Set voice volume
export function setVoiceVolume(volume) {
  // This would need a different approach with AudioContext for real volume control
}

// Set music volume
export function setMusicVolume(volume) {
  if (backgroundMusicNode) {
    backgroundMusicNode.gainNode.gain.value = volume
  }
}
