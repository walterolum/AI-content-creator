// Cinematic Video Generator with Moving Visuals and Professional Audio

// Parse content into structured sections
function parseContent(text) {
  const sections = {
    hook: '',
    caption: '',
    cta: '',
    hashtags: '',
  }

  const lines = text.split('\n')
  let currentSection = ''

  for (const line of lines) {
    const lower = line.toLowerCase().trim()
    if (lower.includes('## hook') || lower.includes('hook')) {
      currentSection = 'hook'
    } else if (lower.includes('## caption') || lower.includes('caption')) {
      currentSection = 'caption'
    } else if (lower.includes('call-to-action') || lower.includes('cta')) {
      currentSection = 'cta'
    } else if (lower.includes('## hashtag') || lower.includes('hashtag')) {
      currentSection = 'hashtags'
    } else if (line.trim() && currentSection && !line.startsWith('#')) {
      sections[currentSection] += line.trim() + ' '
    }
  }

  return {
    hook: sections.hook.trim() || 'Check this out!',
    caption: sections.caption.trim() || text.substring(0, 300),
    cta: sections.cta.trim() || 'Follow for more!',
  }
}

// Clean text for display (remove emojis, hashtags)
function cleanText(text) {
  return text
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
    .replace(/#\w+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Cinematic color palettes
const cinematicPalettes = {
  instagram: {
    primary: ['#833AB4', '#C13584', '#E1306C'],
    secondary: ['#FD1D1D', '#F77737', '#FCAF45'],
    accent: '#FFD700',
    text: '#FFFFFF',
    shadow: 'rgba(0,0,0,0.8)',
  },
  tiktok: {
    primary: ['#00F2EA', '#FF0050', '#000000'],
    secondary: ['#69C9D0', '#EE1D52', '#161823'],
    accent: '#00F2EA',
    text: '#FFFFFF',
    shadow: 'rgba(0,0,0,0.9)',
  },
  facebook: {
    primary: ['#1877F2', '#42B72A', '#F7B928'],
    secondary: ['#0064E0', '#36A420', '#F5C518'],
    accent: '#1877F2',
    text: '#FFFFFF',
    shadow: 'rgba(0,0,0,0.7)',
  },
  linkedin: {
    primary: ['#0077B5', '#00A0DC', '#5BA0D9'],
    secondary: ['#005E93', '#0093D0', '#4A90C4'],
    accent: '#0077B5',
    text: '#FFFFFF',
    shadow: 'rgba(0,0,0,0.7)',
  },
  x: {
    primary: ['#1DA1F2', '#14171A', '#657786'],
    secondary: ['#1A91DA', '#2C3640', '#8899A6'],
    accent: '#1DA1F2',
    text: '#FFFFFF',
    shadow: 'rgba(0,0,0,0.8)',
  },
  threads: {
    primary: ['#000000', '#282828', '#4A4A4A'],
    secondary: ['#1A1A1A', '#333333', '#5C5C5C'],
    accent: '#FFFFFF',
    text: '#FFFFFF',
    shadow: 'rgba(0,0,0,0.9)',
  },
}

// Particle system
class Particle {
  constructor(width, height) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.size = Math.random() * 4 + 1
    this.speedX = (Math.random() - 0.5) * 3
    this.speedY = (Math.random() - 0.5) * 3
    this.opacity = Math.random() * 0.5 + 0.2
    this.life = Math.random() * 100
  }

  update(width, height) {
    this.x += this.speedX
    this.y += this.speedY
    this.life += 0.5

    if (this.x < 0 || this.x > width) this.speedX *= -1
    if (this.y < 0 || this.y > height) this.speedY *= -1
  }
}

// Create cinematic video with moving visuals
export async function generateCinematicVideo(content, platform = 'instagram', options = {}) {
  const {
    duration = 20000,
    width = 1080,
    height = 1920,
    fps = 30,
  } = options

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const sections = parseContent(content)
  const palette = cinematicPalettes[platform] || cinematicPalettes.instagram
  const particles = Array.from({ length: 50 }, () => new Particle(width, height))

  // Create video stream
  const stream = canvas.captureStream(fps)
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 8000000,
  })

  const chunks = []
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }

  const videoBlob = await new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      resolve(new Blob(chunks, { type: 'video/webm' }))
    }

    mediaRecorder.start()

    const totalFrames = Math.floor((duration / 1000) * fps)
    let frame = 0

    const animate = () => {
      if (frame >= totalFrames) {
        mediaRecorder.stop()
        return
      }

      const progress = frame / totalFrames
      const time = frame / fps

      // Clear with gradient background
      drawCinematicBackground(ctx, width, height, progress, time, palette)

      // Draw animated particles
      particles.forEach(p => {
        p.update(width, height)
        drawParticle(ctx, p, palette, progress)
      })

      // Draw light rays
      drawLightRays(ctx, width, height, progress, time, palette)

      // Draw content based on phase
      drawCinematicContent(ctx, width, height, progress, sections, palette, time)

      // Draw progress bar
      drawProgressBar(ctx, width, height, progress, palette)

      // Draw platform badge
      drawPlatformBadge(ctx, platform, width - 160, 80, palette)

      frame++
      requestAnimationFrame(animate)
    }

    animate()
  })

  return videoBlob
}

// Draw cinematic background with Ken Burns effect
function drawCinematicBackground(ctx, width, height, progress, time, palette) {
  // Animated gradient
  const gradient = ctx.createRadialGradient(
    width / 2 + Math.sin(time * 0.5) * 200,
    height / 2 + Math.cos(time * 0.3) * 200,
    0,
    width / 2,
    height / 2,
    width
  )

  palette.primary.forEach((color, i) => {
    gradient.addColorStop(i / (palette.primary.length - 1), color)
  })

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Animated mesh/pattern
  ctx.strokeStyle = `rgba(255,255,255,0.03)`
  ctx.lineWidth = 1

  for (let i = 0; i < 20; i++) {
    ctx.beginPath()
    const offset = Math.sin(time + i * 0.5) * 50
    ctx.moveTo(0, (height / 20) * i + offset)
    ctx.bezierCurveTo(
      width * 0.3, (height / 20) * i + offset + 30,
      width * 0.7, (height / 20) * i + offset - 30,
      width, (height / 20) * i + offset
    )
    ctx.stroke()
  }
}

// Draw particle with glow effect
function drawParticle(ctx, particle, palette, progress) {
  const alpha = particle.opacity * (1 - Math.abs(Math.sin(particle.life * 0.02)))
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = palette.accent
  ctx.shadowColor = palette.accent
  ctx.shadowBlur = 20

  ctx.beginPath()
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// Draw animated light rays
function drawLightRays(ctx, width, height, progress, time, palette) {
  ctx.save()
  ctx.globalAlpha = 0.1

  const centerX = width / 2
  const centerY = height / 3

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + time * 0.2
    const length = 400 + Math.sin(time + i) * 100

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + Math.cos(angle) * length,
      centerY + Math.sin(angle) * length
    )
    ctx.strokeStyle = palette.accent
    ctx.lineWidth = 3
    ctx.stroke()
  }

  ctx.restore()
}

// Draw cinematic content with animations
function drawCinematicContent(ctx, width, height, progress, sections, palette, time) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (progress < 0.25) {
    // Phase 1: Hook with dramatic entrance
    const scale = easeOutBack(Math.min(1, progress * 5))
    const alpha = Math.min(1, progress * 4)

    ctx.save()
    ctx.translate(width / 2, height * 0.4)
    ctx.scale(scale, scale)
    ctx.globalAlpha = alpha

    // Draw hook with glow
    drawGlowText(ctx, cleanText(sections.hook), 0, 0, 80, palette)

    ctx.restore()
  } else if (progress < 0.75) {
    // Phase 2: Main content with fade in
    const phaseProgress = (progress - 0.25) / 0.5
    const alpha = Math.min(1, phaseProgress * 3)

    ctx.save()
    ctx.globalAlpha = alpha

    // Draw caption with typewriter effect
    const words = cleanText(sections.caption).split(' ')
    const wordsToShow = Math.floor(words.length * Math.min(1, phaseProgress * 2))
    const text = words.slice(0, wordsToShow).join(' ')

    drawWrappedGlowText(ctx, text, width / 2, height * 0.35, 52, palette, width * 0.85)

    ctx.restore()
  } else {
    // Phase 3: CTA with pulse animation
    const pulse = 1 + Math.sin(time * 8) * 0.08
    const alpha = Math.min(1, (progress - 0.75) * 5)

    ctx.save()
    ctx.translate(width / 2, height * 0.7)
    ctx.scale(pulse, pulse)
    ctx.globalAlpha = alpha

    // Draw CTA button style
    drawCTAButton(ctx, cleanText(sections.cta), 0, 0, palette)

    ctx.restore()
  }
}

// Draw text with glow effect
function drawGlowText(ctx, text, x, y, size, palette) {
  ctx.font = `bold ${size}px 'Helvetica Neue', Arial, sans-serif`

  // Outer glow
  ctx.shadowColor = palette.accent
  ctx.shadowBlur = 30
  ctx.fillStyle = palette.text
  ctx.fillText(text, x, y)

  // Inner glow
  ctx.shadowBlur = 15
  ctx.fillText(text, x, y)

  // Clear shadow for crisp text
  ctx.shadowBlur = 0
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(text, x, y)
}

// Draw wrapped text with glow
function drawWrappedGlowText(ctx, text, x, y, size, palette, maxWidth) {
  ctx.font = `${size}px 'Helvetica Neue', Arial, sans-serif`

  const words = text.split(' ')
  let line = ''
  const lines = []

  for (const word of words) {
    const testLine = line + word + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && line) {
      lines.push(line.trim())
      line = word + ' '
    } else {
      line = testLine
    }
  }
  lines.push(line.trim())

  const lineHeight = size * 1.4
  const startY = y - ((lines.length - 1) * lineHeight) / 2

  lines.forEach((l, i) => {
    // Shadow
    ctx.shadowColor = palette.shadow
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.fillStyle = palette.text
    ctx.fillText(l, x, startY + i * lineHeight)
  })

  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
}

// Draw CTA button
function drawCTAButton(ctx, text, x, y, palette) {
  ctx.font = `bold 48px 'Helvetica Neue', Arial, sans-serif`
  const textWidth = ctx.measureText(text).width
  const padding = 40
  const btnWidth = textWidth + padding * 2
  const btnHeight = 80

  // Button background with gradient
  const gradient = ctx.createLinearGradient(
    x - btnWidth / 2, y,
    x + btnWidth / 2, y
  )
  gradient.addColorStop(0, palette.primary[0])
  gradient.addColorStop(1, palette.accent)

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.roundRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 40)
  ctx.fill()

  // Button text
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowColor = 'rgba(0,0,0,0.3)'
  ctx.shadowBlur = 5
  ctx.fillText(text, x, y + 5)
  ctx.shadowBlur = 0
}

// Draw progress bar
function drawProgressBar(ctx, width, height, progress, palette) {
  const barWidth = width - 100
  const barHeight = 6
  const x = 50
  const y = height - 80

  // Background
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.beginPath()
  ctx.roundRect(x, y, barWidth, barHeight, 3)
  ctx.fill()

  // Progress
  const gradient = ctx.createLinearGradient(x, y, x + barWidth * progress, y)
  gradient.addColorStop(0, palette.primary[0])
  gradient.addColorStop(1, palette.accent)

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.roundRect(x, y, barWidth * progress, barHeight, 3)
  ctx.fill()

  // Glow effect on progress
  ctx.shadowColor = palette.accent
  ctx.shadowBlur = 10
  ctx.fill()
  ctx.shadowBlur = 0
}

// Draw platform badge
function drawPlatformBadge(ctx, platform, x, y, palette) {
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.beginPath()
  ctx.roundRect(x, y, 140, 45, 22)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 16px Helvetica Neue, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(platform.toUpperCase(), x + 70, y + 27)
  ctx.textAlign = 'left'
}

// Easing function
function easeOutBack(t) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

// Generate background music using Web Audio API
export function generateBackgroundMusic(duration = 20) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const sampleRate = audioContext.sampleRate
  const samples = sampleRate * duration
  const buffer = audioContext.createBuffer(2, samples, sampleRate)

  const leftChannel = buffer.getChannelData(0)
  const rightChannel = buffer.getChannelData(1)

  // Create ambient pad sound
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate

    // Base pad (soft sine waves)
    const pad1 = Math.sin(2 * Math.PI * 110 * t) * 0.08
    const pad2 = Math.sin(2 * Math.PI * 165 * t) * 0.06
    const pad3 = Math.sin(2 * Math.PI * 220 * t) * 0.04

    // Slow modulation
    const mod = Math.sin(2 * Math.PI * 0.1 * t) * 0.5 + 0.5

    // Fade in/out
    const fadeTime = 2
    let envelope = 1
    if (t < fadeTime) envelope = t / fadeTime
    if (t > duration - fadeTime) envelope = (duration - t) / fadeTime

    const sample = (pad1 + pad2 + pad3) * mod * envelope

    leftChannel[i] = sample
    rightChannel[i] = sample * (0.9 + Math.random() * 0.1) // Slight stereo width
  }

  return buffer
}

// Convert AudioBuffer to Blob
export function audioBufferToBlob(buffer) {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const format = 1 // PCM
  const bitDepth = 16

  const bytesPerSample = bitDepth / 8
  const blockAlign = numChannels * bytesPerSample

  const dataLength = buffer.length * blockAlign
  const bufferLength = 44 + dataLength

  const arrayBuffer = new ArrayBuffer(bufferLength)
  const view = new DataView(arrayBuffer)

  // WAV header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, bufferLength - 8, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, format, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitDepth, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataLength, true)

  // Write audio data
  const channelData = []
  for (let i = 0; i < numChannels; i++) {
    channelData.push(buffer.getChannelData(i))
  }

  let offset = 44
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channelData[channel][i]))
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
      view.setInt16(offset, int16, true)
      offset += 2
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' })
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}

// Download video
export function downloadVideo(blob, filename = 'content-video') {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.webm`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Create video URL for playback
export function createVideoUrl(blob) {
  return URL.createObjectURL(blob)
}
