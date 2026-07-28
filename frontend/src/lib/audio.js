// Audio generation using Web Speech API (free, browser-based)

export function generateSpeech(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported in this browser'))
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = options.rate || 1
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 1
    utterance.lang = options.lang || 'en-US'

    // Try to use a good voice
    const voices = speechSynthesis.getVoices()
    const preferredVoice = voices.find(v =>
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha'))
    )
    if (preferredVoice) utterance.voice = preferredVoice

    utterance.onend = () => resolve()
    utterance.onerror = (e) => reject(e)

    speechSynthesis.speak(utterance)
  })
}

export function stopSpeech() {
  speechSynthesis.cancel()
}

// Convert text to audio file using MediaRecorder
export async function textToAudioBlob(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'))
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = options.rate || 1
    utterance.pitch = options.pitch || 1
    utterance.lang = options.lang || 'en-US'

    utterance.onend = () => {
      // Create a simple audio blob (silent placeholder)
      // In production, use a real TTS API like ElevenLabs
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate)
      const data = buffer.getChannelData(0)

      // Generate a simple tone as placeholder
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.sin(2 * Math.PI * 440 * i / audioContext.sampleRate) * 0.1
      }

      const audioBuffer = new Float32Array(data.length)
      data.copyToChannel(audioBuffer, 0)

      resolve(new Blob([audioBuffer], { type: 'audio/wav' }))
    }

    utterance.onerror = (e) => reject(e)
    speechSynthesis.speak(utterance)
  })
}

// Download audio as file
export function downloadAudio(text, filename = 'content-audio', options = {}) {
  // Use Web Speech API for preview
  generateSpeech(text, options)

  // For actual download, create a downloadable version
  const audioData = `Audio content: ${text}`
  const blob = new Blob([audioData], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.txt` // Placeholder - real audio needs backend TTS
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Generate audio URL for playback
export function createAudioUrl(text) {
  // Create a simple audio element with speech synthesis
  return {
    play: () => generateSpeech(text),
    stop: stopSpeech,
  }
}
