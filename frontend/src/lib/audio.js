export function cleanContentForSpeech(text) {
  if (!text) return ''
  let cleaned = text
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
    .replace(/#\w+/g, '')
    .replace(/^#{1,6}\s/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/^\d+\.\s/gm, '')
    .replace(/^[-*]\s/gm, '')
    .replace(/## Hook/gi, '')
    .replace(/## Caption/gi, '')
    .replace(/## Call-to-Action/gi, '')
    .replace(/## CTA/gi, '')
    .replace(/## Hashtags/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned
}

export const voiceProfiles = [
  {
    id: 'radio-presenter',
    name: 'Radio Presenter',
    description: 'Warm, engaging voice like BBC Radio presenter',
    rate: 0.92, pitch: 0.95,
    preferred: ['Google UK English Female', 'Samantha', 'Daniel'],
    style: 'radio', emphasis: 'natural',
  },
  {
    id: 'advertiser-male',
    name: 'Advertiser (Male)',
    description: 'Bold, persuasive male voice like TV commercials',
    rate: 0.88, pitch: 0.8,
    preferred: ['Google UK English Male', 'Daniel', 'Alex'],
    style: 'advertiser', emphasis: 'strong',
  },
  {
    id: 'advertiser-female',
    name: 'Advertiser (Female)',
    description: 'Convincing female voice for product ads',
    rate: 0.9, pitch: 1.05,
    preferred: ['Google UK English Female', 'Samantha', 'Victoria'],
    style: 'advertiser', emphasis: 'strong',
  },
  {
    id: 'corporate-narrator',
    name: 'Corporate Narrator',
    description: 'Authoritative, trustworthy voice for business',
    rate: 0.85, pitch: 0.85,
    preferred: ['Google UK English Male', 'Daniel'],
    style: 'corporate', emphasis: 'precise',
  },
  {
    id: 'luxury-brand',
    name: 'Luxury Brand Voice',
    description: 'Elegant, sophisticated for premium products',
    rate: 0.78, pitch: 0.9,
    preferred: ['Google UK English Female', 'Samantha'],
    style: 'luxury', emphasis: 'smooth',
  },
  {
    id: 'energetic-promo',
    name: 'Energetic Promoter',
    description: 'High-energy hype voice for launches',
    rate: 1.2, pitch: 1.0,
    preferred: ['Google US English', 'Fred', 'Alex'],
    style: 'energetic', emphasis: 'excited',
  },
  {
    id: 'documentary-narrator',
    name: 'Documentary Narrator',
    description: 'Deep, cinematic narrator like BBC Earth',
    rate: 0.8, pitch: 0.75,
    preferred: ['Google UK English Male', 'Daniel'],
    style: 'cinematic', emphasis: 'dramatic',
  },
  {
    id: 'news-anchor',
    name: 'News Anchor',
    description: 'Formal, credible voice for announcements',
    rate: 0.95, pitch: 0.9,
    preferred: ['Google US English', 'Alex', 'Samantha'],
    style: 'news', emphasis: 'formal',
  },
  {
    id: 'friendly-host',
    name: 'Friendly Host',
    description: 'Warm, approachable voice for lifestyle',
    rate: 1.0, pitch: 1.1,
    preferred: ['Google US English', 'Karen', 'Moira'],
    style: 'friendly', emphasis: 'conversational',
  },
  {
    id: 'professional-male',
    name: 'Professional Male',
    description: 'Clear, confident corporate voice',
    rate: 0.9, pitch: 0.8,
    preferred: ['Google UK English Male', 'Daniel', 'Alex'],
    style: 'professional', emphasis: 'clear',
  },
  {
    id: 'professional-female',
    name: 'Professional Female',
    description: 'Confident female voice for business',
    rate: 0.9, pitch: 1.1,
    preferred: ['Google UK English Female', 'Samantha', 'Victoria'],
    style: 'professional', emphasis: 'clear',
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    description: 'Expressive narrative voice for brand stories',
    rate: 0.88, pitch: 0.9,
    preferred: ['Google UK English Male', 'Daniel', 'Samantha'],
    style: 'story', emphasis: 'expressive',
  },
  {
    id: 'nigerian-male',
    name: 'Nigerian English (Male)',
    description: 'Warm West African English voice for authentic ads',
    rate: 0.9, pitch: 0.85,
    preferred: ['Microsoft Oluwaseun', 'Google UK English Male', 'Daniel'],
    style: 'african', emphasis: 'warm',
  },
  {
    id: 'nigerian-female',
    name: 'Nigerian English (Female)',
    description: 'Engaging Nigerian English voice for brands',
    rate: 0.92, pitch: 1.05,
    preferred: ['Microsoft Ozioma', 'Google UK English Female', 'Samantha'],
    style: 'african', emphasis: 'warm',
  },
  {
    id: 'kenyan-male',
    name: 'Kenyan English (Male)',
    description: 'East African confident voice for business',
    rate: 0.88, pitch: 0.82,
    preferred: ['Google UK English Male', 'Daniel', 'Alex'],
    style: 'african', emphasis: 'clear',
  },
  {
    id: 'kenyan-female',
    name: 'Kenyan English (Female)',
    description: 'Warm East African female voice for ads',
    rate: 0.9, pitch: 1.08,
    preferred: ['Google UK English Female', 'Samantha', 'Victoria'],
    style: 'african', emphasis: 'friendly',
  },
  {
    id: 'south-african-male',
    name: 'South African English (Male)',
    description: 'Authoritative SA English for corporate ads',
    rate: 0.85, pitch: 0.8,
    preferred: ['Google UK English Male', 'Daniel'],
    style: 'african', emphasis: 'authoritative',
  },
  {
    id: 'south-african-female',
    name: 'South African English (Female)',
    description: 'Professional SA English voice for luxury brands',
    rate: 0.88, pitch: 1.02,
    preferred: ['Google UK English Female', 'Samantha'],
    style: 'african', emphasis: 'sophisticated',
  },
]

export const musicGenres = [
  { id: 'none', name: 'No Music' },
  { id: 'cinematic', name: 'Cinematic Orchestra' },
  { id: 'corporate', name: 'Corporate Inspiring' },
  { id: 'upbeat', name: 'Upbeat Energetic' },
  { id: 'luxury', name: 'Luxury Ambient' },
  { id: 'modern', name: 'Modern Pop' },
  { id: 'jazz', name: 'Smooth Jazz' },
  { id: 'electronic', name: 'Electronic Pulse' },
  { id: 'acoustic', name: 'Acoustic Warm' },
  { id: 'drone', name: 'Cinematic Drone' },
  { id: 'piano', name: 'Emotional Piano' },
]

let currentUtterance = null
let backgroundMusicNode = null
let audioContext = null
let isBackgroundPlaying = false
let reverbNode = null
let echoNode = null

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

function createBackgroundMusic(duration = 30, genre = 'cinematic') {
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
    let sample = 0

    switch (genre) {
      case 'cinematic':
        sample = generateCinematic(t, duration)
        break
      case 'corporate':
        sample = generateCorporate(t, duration)
        break
      case 'upbeat':
        sample = generateUpbeat(t, duration)
        break
      case 'luxury':
        sample = generateLuxury(t, duration)
        break
      case 'modern':
        sample = generateModern(t, duration)
        break
      case 'jazz':
        sample = generateJazz(t, duration)
        break
      case 'electronic':
        sample = generateElectronic(t, duration)
        break
      case 'acoustic':
        sample = generateAcoustic(t, duration)
        break
      case 'drone':
        sample = generateDrone(t, duration)
        break
      case 'piano':
        sample = generatePiano(t, duration)
        break
      default:
        sample = 0
    }

    const fadeTime = 2
    let envelope = 1
    if (t < fadeTime) envelope = t / fadeTime
    if (t > duration - fadeTime) envelope = (duration - t) / fadeTime

    const finalSample = sample * envelope * 0.4
    leftChannel[i] = finalSample
    rightChannel[i] = finalSample * (0.95 + Math.random() * 0.05)
  }

  return buffer
}

function generateCinematic(t, duration) {
  const pad1 = Math.sin(2 * Math.PI * 55 * t) * 0.06
  const pad2 = Math.sin(2 * Math.PI * 82.5 * t) * 0.04
  const pad3 = Math.sin(2 * Math.PI * 110 * t) * 0.03
  const pad4 = Math.sin(2 * Math.PI * 165 * t) * 0.02
  const mod = Math.sin(2 * Math.PI * 0.06 * t) * 0.3 + 0.7
  const swell = Math.sin(2 * Math.PI * 0.15 * t) * 0.2 + 0.8
  return (pad1 + pad2 + pad3 + pad4) * mod * swell
}

function generateCorporate(t, duration) {
  const pad1 = Math.sin(2 * Math.PI * 65 * t) * 0.05
  const pad2 = Math.sin(2 * Math.PI * 130 * t) * 0.03
  const pad3 = Math.sin(2 * Math.PI * 195 * t) * 0.02
  const rhythm = Math.sin(2 * Math.PI * 2.0 * t) * 0.5 + 0.5
  const pulse = Math.sin(2 * Math.PI * 1.2 * t) * 0.3 + 0.7
  return (pad1 + pad2 + pad3) * pulse * rhythm * 0.5 + 0.03
}

function generateUpbeat(t, duration) {
  const bass = Math.sin(2 * Math.PI * 110 * t) * 0.06
  const chord1 = Math.sin(2 * Math.PI * 165 * t) * 0.03
  const chord2 = Math.sin(2 * Math.PI * 220 * t) * 0.03
  const beat = Math.sin(2 * Math.PI * 4.0 * t) > 0 ? 0.04 : -0.04
  const mod = Math.sin(2 * Math.PI * 0.1 * t) * 0.4 + 0.6
  return (bass + chord1 + chord2 + beat) * mod
}

function generateLuxury(t, duration) {
  const warm1 = Math.sin(2 * Math.PI * 82 * t) * 0.04
  const warm2 = Math.sin(2 * Math.PI * 164 * t) * 0.03
  const warm3 = Math.sin(2 * Math.PI * 246 * t) * 0.02
  const shimmer = Math.sin(2 * Math.PI * (328 + Math.sin(t * 0.5) * 2) * t) * 0.01
  const mod = Math.sin(2 * Math.PI * 0.04 * t) * 0.2 + 0.8
  return (warm1 + warm2 + warm3 + shimmer) * mod
}

function generateModern(t, duration) {
  const bass = Math.sin(2 * Math.PI * 130 * t) * 0.05
  const synth1 = Math.sin(2 * Math.PI * 200 * t) * 0.025
  const synth2 = Math.sin(2 * Math.PI * 266 * t) * 0.025
  const hihat = Math.random() > 0.95 ? 0.03 : 0
  const mod = Math.sin(2 * Math.PI * 0.15 * t) * 0.5 + 0.5
  return (bass + synth1 + synth2 + hihat) * mod
}

function generateJazz(t, duration) {
  const bass = Math.sin(2 * Math.PI * 98 * t) * 0.05
  const chord = Math.sin(2 * Math.PI * 147 * t) * 0.03 + Math.sin(2 * Math.PI * 185 * t) * 0.03
  const brush = Math.sin(2 * Math.PI * (t * 5)) * 0.01 + Math.sin(2 * Math.PI * (t * 3.5)) * 0.01
  const mod = Math.sin(2 * Math.PI * 0.08 * t) * 0.3 + 0.7
  return (bass + chord + brush) * mod
}

function generateElectronic(t, duration) {
  const pulse = Math.sin(2 * Math.PI * 2.5 * t) > 0 ? 0.05 : -0.05
  const sub = Math.sin(2 * Math.PI * 60 * t) * 0.06
  const lead = Math.sin(2 * Math.PI * (240 + Math.sin(t * 2) * 10) * t) * 0.02
  const arp = Math.sin(2 * Math.PI * (t * 440 * (1 + 0.5 * Math.sin(t * 3)))) * 0.015
  return pulse + sub + lead + arp
}

function generateAcoustic(t, duration) {
  const strum1 = Math.sin(2 * Math.PI * 165 * t) * 0.04
  const strum2 = Math.sin(2 * Math.PI * 208 * t) * 0.03
  const strum3 = Math.sin(2 * Math.PI * 262 * t) * 0.02
  const mod = Math.sin(2 * Math.PI * 0.1 * t) * 0.4 + 0.6
  return (strum1 + strum2 + strum3) * mod
}

function generateDrone(t, duration) {
  const drone1 = Math.sin(2 * Math.PI * 55 * t) * 0.05
  const drone2 = Math.sin(2 * Math.PI * 60.5 * t) * 0.04
  const drone3 = Math.sin(2 * Math.PI * 66 * t) * 0.03
  const mod = Math.sin(2 * Math.PI * 0.02 * t) * 0.3 + 0.7
  return (drone1 + drone2 + drone3) * mod
}

function generatePiano(t, duration) {
  const note1 = Math.sin(2 * Math.PI * 262 * t) * 0.04
  const note2 = Math.sin(2 * Math.PI * 330 * t) * 0.03
  const note3 = Math.sin(2 * Math.PI * 392 * t) * 0.02
  const decay = Math.exp(-t * 0.5) * 0.5 + 0.5
  const mod = Math.sin(2 * Math.PI * 0.12 * t) * 0.3 + 0.7
  return (note1 + note2 + note3) * decay * mod
}

export function playBackgroundMusic(duration = 30, genre = 'cinematic', sceneSyncPoints = null) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  stopBackgroundMusic()

  if (sceneSyncPoints && sceneSyncPoints.length > 0) {
    const buffer = createSceneSyncedMusic(duration, genre, sceneSyncPoints)
    const source = audioContext.createBufferSource()
    source.buffer = buffer

    const gainNode = audioContext.createGain()
    gainNode.gain.value = 0.3

    source.connect(gainNode)
    gainNode.connect(audioContext.destination)
    source.start()
    backgroundMusicNode = { source, gainNode }
    isBackgroundPlaying = true
    source.onended = () => { isBackgroundPlaying = false }
    return
  }

  const buffer = createBackgroundMusic(duration, genre)
  const source = audioContext.createBufferSource()
  source.buffer = buffer

  const gainNode = audioContext.createGain()
  gainNode.gain.value = 0.3

  source.connect(gainNode)
  gainNode.connect(audioContext.destination)
  source.start()
  backgroundMusicNode = { source, gainNode }
  isBackgroundPlaying = true
  source.onended = () => { isBackgroundPlaying = false }
}

function createSceneSyncedMusic(totalDuration, baseGenre, syncPoints) {
  const sampleRate = audioContext.sampleRate
  const samples = sampleRate * totalDuration
  const buffer = audioContext.createBuffer(2, samples, sampleRate)
  const leftChannel = buffer.getChannelData(0)
  const rightChannel = buffer.getChannelData(1)

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate
    let sample = 0

    let currentScene = syncPoints[0]
    for (const sp of syncPoints) {
      if (t >= sp.timeSeconds && t < sp.timeSeconds + sp.durationSeconds) {
        currentScene = sp
        break
      }
    }

    const sceneMood = currentScene?.mood || 'neutral'
    const sceneGenre = adjustGenreForMood(baseGenre, sceneMood)
    const sceneStart = currentScene?.timeSeconds || 0
    const sceneDur = currentScene?.durationSeconds || totalDuration
    const sceneT = t - sceneStart

    switch (sceneGenre) {
      case 'cinematic': sample = generateCinematic(sceneT, sceneDur); break
      case 'corporate': sample = generateCorporate(sceneT, sceneDur); break
      case 'upbeat': sample = generateUpbeat(sceneT, sceneDur); break
      case 'luxury': sample = generateLuxury(sceneT, sceneDur); break
      case 'modern': sample = generateModern(sceneT, sceneDur); break
      case 'jazz': sample = generateJazz(sceneT, sceneDur); break
      case 'electronic': sample = generateElectronic(sceneT, sceneDur); break
      case 'acoustic': sample = generateAcoustic(sceneT, sceneDur); break
      case 'drone': sample = generateDrone(sceneT, sceneDur); break
      case 'piano': sample = generatePiano(sceneT, sceneDur); break
      default: sample = 0
    }

    let sceneEnvelope = 1
    const fadeLen = 0.3
    if (sceneT < fadeLen) sceneEnvelope = sceneT / fadeLen
    if (sceneT > sceneDur - fadeLen) sceneEnvelope = (sceneDur - sceneT) / fadeLen

    const fadeTime = 1.5
    let masterEnvelope = 1
    if (t < fadeTime) masterEnvelope = t / fadeTime
    if (t > totalDuration - fadeTime) masterEnvelope = (totalDuration - t) / fadeTime

    const finalSample = sample * sceneEnvelope * masterEnvelope * 0.4
    leftChannel[i] = finalSample
    rightChannel[i] = finalSample * (0.95 + Math.random() * 0.05)
  }

  return buffer
}

function adjustGenreForMood(baseGenre, mood) {
  if (mood === 'confident' || mood === 'bold') return 'cinematic'
  if (mood === 'warm' || mood === 'friendly') return 'acoustic'
  if (mood === 'energetic' || mood === 'excited') return 'upbeat'
  if (mood === 'sophisticated' || mood === 'prestigious') return 'luxury'
  if (mood === 'serious' || mood === 'concerned' || mood === 'urgent') return 'drone'
  if (mood === 'playful' || mood === 'fun' || mood === 'delighted') return 'modern'
  if (mood === 'calm' || mood === 'peaceful') return 'piano'
  if (mood === 'dramatic' || mood === 'powerful') return 'cinematic'
  return baseGenre
}

export function stopBackgroundMusic() {
  if (backgroundMusicNode) {
    try { backgroundMusicNode.source.stop() } catch (e) {}
    backgroundMusicNode = null
  }
  resetEffects()
  isBackgroundPlaying = false
}

function resetEffects() {
  reverbNode = null
  echoNode = null
}

export function speak(text, profileId = 'radio-presenter', options = {}) {
  const {
    withMusic = true,
    musicGenre = 'cinematic',
    onEnd = null,
    voiceVolume = 1,
    musicVolume = 0.3,
    useReverb = false,
    useEcho = false,
    sceneSyncPoints = null,
  } = options

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
  currentUtterance.volume = voiceVolume
  const langMap = {
    'nigerian-male': 'en-NG', 'nigerian-female': 'en-NG',
    'kenyan-male': 'en-KE', 'kenyan-female': 'en-KE',
    'south-african-male': 'en-ZA', 'south-african-female': 'en-ZA',
  }
  currentUtterance.lang = langMap[profileId] || 'en-US'

  const voice = findVoice(profile)
  if (voice) {
    currentUtterance.voice = voice
  }

  if (withMusic && musicGenre !== 'none') {
    playBackgroundMusic(30, musicGenre, sceneSyncPoints)
    if (backgroundMusicNode) {
      backgroundMusicNode.gainNode.gain.value = musicVolume
    }
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

export function stopSpeech() {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel()
  }
  currentUtterance = null
  stopBackgroundMusic()
}

export function pauseSpeech() {
  if (speechSynthesis.speaking) {
    speechSynthesis.pause()
  }
  if (backgroundMusicNode) {
    backgroundMusicNode.gainNode.gain.value = 0.08
  }
}

export function resumeSpeech() {
  if (speechSynthesis.paused) {
    speechSynthesis.resume()
  }
  if (backgroundMusicNode) {
    backgroundMusicNode.gainNode.gain.value = 0.3
  }
}

export function isSpeaking() {
  return speechSynthesis.speaking
}

export function isPaused() {
  return speechSynthesis.paused
}

export function setVoiceVolume(volume) {
}

export function setMusicVolume(volume) {
  if (backgroundMusicNode) {
    backgroundMusicNode.gainNode.gain.value = volume
  }
}
