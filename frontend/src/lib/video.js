// Professional Advertisement Video Generator - Moderate Flow with Background Voice

function cleanTextForVoice(text) {
  return text
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
    .replace(/[\u{2600}-\u{26FF}]/gu, '')
    .replace(/[\u{2700}-\u{27BF}]/gu, '')
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
    .replace(/## Emoji/gi, '')
    .replace(/## Image/gi, '')
    .replace(/## Story/gi, '')
    .replace(/## Poll/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Parse content into scenes with moderate timing
function parseContentToScenes(text) {
  const cleaned = cleanTextForVoice(text)
  const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 8)

  const scenes = []

  if (sentences.length >= 4) {
    // Hook (0-7 seconds) - One strong opening line
    scenes.push({
      id: 'hook',
      text: sentences[0].trim() + '.',
      voiceText: sentences[0].trim() + '.',
      duration: 7000,
      startTime: 0,
      style: 'hook',
    })

    // Problem (7-15 seconds) - Explain the need
    const problemText = sentences.slice(1, 3).join('. ').trim() + '.'
    scenes.push({
      id: 'problem',
      text: problemText,
      voiceText: problemText,
      duration: 8000,
      startTime: 7000,
      style: 'main',
    })

    // Solution (15-23 seconds) - Present the solution
    const solutionText = sentences.slice(3, 5).join('. ').trim() + '.'
    scenes.push({
      id: 'solution',
      text: solutionText,
      voiceText: solutionText,
      duration: 8000,
      startTime: 15000,
      style: 'main',
    })

    // CTA (23-30 seconds) - Call to action
    scenes.push({
      id: 'cta',
      text: sentences[5] ? sentences[5].trim() + '.' : 'Don\'t miss out!',
      voiceText: sentences[5] ? sentences[5].trim() + '.' : 'Don\'t miss out!',
      duration: 7000,
      startTime: 23000,
      style: 'cta',
    })
  } else {
    // Fallback with moderate timing
    scenes.push({
      id: 'hook',
      text: cleaned.substring(0, 80) || 'Check this out!',
      voiceText: cleaned.substring(0, 80) || 'Check this out!',
      duration: 10000,
      startTime: 0,
      style: 'hook',
    })
    scenes.push({
      id: 'main',
      text: cleaned.substring(80, 200) || 'Amazing content for you.',
      voiceText: cleaned.substring(80, 200) || 'Amazing content for you.',
      duration: 15000,
      startTime: 10000,
      style: 'main',
    })
    scenes.push({
      id: 'cta',
      text: 'Don\'t miss out!',
      voiceText: 'Don\'t miss out!',
      duration: 5000,
      startTime: 25000,
      style: 'cta',
    })
  }

  return scenes
}

// Video color schemes
const palettes = {
  instagram: { bg1: '#833AB4', bg2: '#C13584', bg3: '#E1306C', accent: '#FFD700', text: '#FFFFFF' },
  tiktok: { bg1: '#000000', bg2: '#00F2EA', bg3: '#FF0050', accent: '#00F2EA', text: '#FFFFFF' },
  facebook: { bg1: '#1877F2', bg2: '#42B72A', bg3: '#F7B928', accent: '#FFFFFF', text: '#FFFFFF' },
  linkedin: { bg1: '#0077B5', bg2: '#00A0DC', bg3: '#5BA0D9', accent: '#FFFFFF', text: '#FFFFFF' },
  x: { bg1: '#1DA1F2', bg2: '#14171A', bg3: '#657786', accent: '#1DA1F2', text: '#FFFFFF' },
  threads: { bg1: '#1A1A1A', bg2: '#333333', bg3: '#4A4A4A', accent: '#FFFFFF', text: '#FFFFFF' },
}

// Generate 30-second ad video
export async function generateAdVideo(content, platform = 'instagram', options = {}) {
  const {
    duration = 30000,
    width = 1080,
    height = 1920,
    fps = 30,
  } = options

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const scenes = parseContentToScenes(content)
  const palette = palettes[platform] || palettes.instagram

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

      const currentTime = (frame / fps) * 1000
      const progress = frame / totalFrames

      ctx.clearRect(0, 0, width, height)

      // Animated background
      drawBackground(ctx, width, height, frame, palette)

      // Current scene
      const currentScene = scenes.find(s =>
        currentTime >= s.startTime && currentTime < s.startTime + s.duration
      ) || scenes[0]

      const sceneProgress = (currentTime - currentScene.startTime) / currentScene.duration

      // Draw scene content
      drawScene(ctx, width, height, currentScene, sceneProgress, palette, frame)

      // Draw captions at bottom
      drawCaptions(ctx, width, height, currentScene, sceneProgress, palette)

      // Progress bar
      drawProgressBar(ctx, width, height, progress, palette)

      frame++
      requestAnimationFrame(animate)
    }

    animate()
  })

  return videoBlob
}

// Animated background with smooth motion
function drawBackground(ctx, width, height, frame, palette) {
  // Smooth gradient
  const gradient = ctx.createRadialGradient(
    width / 2 + Math.sin(frame * 0.01) * 300,
    height / 2 + Math.cos(frame * 0.008) * 300,
    0,
    width / 2,
    height / 2,
    height
  )
  gradient.addColorStop(0, palette.bg1)
  gradient.addColorStop(0.5, palette.bg2)
  gradient.addColorStop(1, palette.bg3)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Subtle wave lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'
  ctx.lineWidth = 2

  for (let i = 0; i < 10; i++) {
    ctx.beginPath()
    const baseY = (height / 10) * i
    for (let x = 0; x <= width; x += 10) {
      const y = baseY + Math.sin(x * 0.01 + frame * 0.02 + i) * 20
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // Floating orbs
  for (let i = 0; i < 15; i++) {
    const x = (Math.sin(i * 1.2 + frame * 0.005) + 1) * width / 2
    const y = (Math.cos(i * 0.8 + frame * 0.004) + 1) * height / 2
    const size = 60 + Math.sin(i + frame * 0.02) * 20
    const alpha = 0.05 + Math.sin(i * 0.5 + frame * 0.01) * 0.03

    const orbGradient = ctx.createRadialGradient(x, y, 0, x, y, size)
    orbGradient.addColorStop(0, `rgba(255,255,255,${alpha})`)
    orbGradient.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.fillStyle = orbGradient
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
}

// Draw scene with moderate text flow
function drawScene(ctx, width, height, scene, progress, palette, frame) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (scene.style === 'hook') {
    // Hook - Smooth entrance
    const ease = easeOutCubic(Math.min(1, progress * 2))
    const alpha = Math.min(1, progress * 3)
    const yOffset = (1 - ease) * 100

    ctx.save()
    ctx.globalAlpha = alpha

    // Large text
    ctx.font = 'bold 72px Helvetica Neue, Arial, sans-serif'

    // Glow
    ctx.shadowColor = palette.accent
    ctx.shadowBlur = 30

    // Split text into words for wrapped display
    const words = scene.text.split(' ')
    let line = ''
    const lines = []

    for (const word of words) {
      const testLine = line + word + ' '
      if (ctx.measureText(testLine).width > width * 0.85 && line) {
        lines.push(line.trim())
        line = word + ' '
      } else {
        line = testLine
      }
    }
    lines.push(line.trim())

    const lineHeight = 85
    const startY = height * 0.35 - (lines.length * lineHeight) / 2 + yOffset

    lines.forEach((l, i) => {
      ctx.fillText(l, width / 2, startY + i * lineHeight)
    })

    ctx.restore()

  } else if (scene.style === 'main') {
    // Main content - Word by word reveal (moderate speed)
    const alpha = Math.min(1, progress * 2)

    ctx.save()
    ctx.globalAlpha = alpha

    ctx.font = '44px Helvetica Neue, Arial, sans-serif'
    const maxWidth = width * 0.85

    // Reveal words progressively
    const words = scene.text.split(' ')
    const wordsToShow = Math.floor(words.length * Math.min(1, progress * 1.2))
    const visibleText = words.slice(0, wordsToShow).join(' ')

    // Wrap text
    const lines = wrapText(ctx, visibleText, maxWidth)
    const lineHeight = 58
    const totalHeight = lines.length * lineHeight
    const startY = height * 0.35 - totalHeight / 2

    lines.forEach((line, i) => {
      const lineAlpha = Math.min(1, (progress * lines.length - i) * 0.8)
      ctx.globalAlpha = lineAlpha * alpha

      // Text shadow
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 8
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      ctx.fillStyle = palette.text
      ctx.fillText(line, width / 2, startY + i * lineHeight)
    })

    ctx.restore()

  } else if (scene.style === 'cta') {
    // CTA - Pulse animation
    const pulse = 1 + Math.sin(frame * 0.08) * 0.03
    const alpha = Math.min(1, progress * 3)

    ctx.save()
    ctx.translate(width / 2, height * 0.45)
    ctx.scale(pulse, pulse)
    ctx.globalAlpha = alpha

    // CTA text
    ctx.font = 'bold 52px Helvetica Neue, Arial, sans-serif'
    ctx.shadowColor = palette.accent
    ctx.shadowBlur = 25
    ctx.fillStyle = palette.text
    ctx.fillText(scene.text, 0, 0)

    // Decorative line
    ctx.shadowBlur = 0
    ctx.strokeStyle = palette.accent
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(-200, 60)
    ctx.lineTo(200, 60)
    ctx.stroke()

    ctx.restore()
  }
}

// Draw captions at bottom
function drawCaptions(ctx, width, height, scene, progress, palette) {
  const captionY = height - 180
  const captionHeight = 100

  // Semi-transparent background
  ctx.fillStyle = 'rgba(0,0,0,0.75)'
  ctx.beginPath()
  ctx.roundRect(30, captionY, width - 60, captionHeight, 12)
  ctx.fill()

  // Caption text - moderate reveal
  const words = scene.text.split(' ')
  const wordsToShow = Math.floor(words.length * Math.min(1, progress * 1.3))
  const captionText = words.slice(0, wordsToShow).join(' ')

  ctx.font = '32px Helvetica Neue, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFFFFF'

  // Wrap caption
  const captionLines = wrapText(ctx, captionText, width - 100)
  const captionLineHeight = 38
  const captionStartY = captionY + 35

  captionLines.slice(0, 2).forEach((line, i) => {
    ctx.fillText(line, width / 2, captionStartY + i * captionLineHeight)
  })
}

// Draw progress bar
function drawProgressBar(ctx, width, height, progress, palette) {
  const barWidth = width - 80
  const barHeight = 4
  const x = 40
  const y = height - 50

  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.beginPath()
  ctx.roundRect(x, y, barWidth, barHeight, 2)
  ctx.fill()

  const gradient = ctx.createLinearGradient(x, y, x + barWidth * progress, y)
  gradient.addColorStop(0, palette.accent)
  gradient.addColorStop(1, palette.bg1)

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.roundRect(x, y, barWidth * progress, barHeight, 2)
  ctx.fill()
}

// Wrap text helper
function wrapText(ctx, text, maxWidth) {
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
  return lines
}

// Easing functions
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

function easeOutBack(t) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

// Get voiceover script (clean text)
export function generateVoiceoverScript(content) {
  return cleanTextForVoice(content)
}

// Get scenes for caption sync
export function getScenesForContent(content) {
  return parseContentToScenes(content)
}

// Download video
export function downloadVideo(blob, filename = 'ad-video') {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.webm`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function createVideoUrl(blob) {
  return URL.createObjectURL(blob)
}
