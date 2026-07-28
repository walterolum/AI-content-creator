// Professional Advertisement Video Generator with Voiceover and Captions

// Clean text for voice (no hashtags, emojis, headers)
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

// Parse content into ad scenes
function parseContentToScenes(text) {
  const cleaned = cleanTextForVoice(text)
  const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 10)

  // Industry standard ad flow: Hook → Problem → Solution → CTA
  const scenes = []

  if (sentences.length >= 3) {
    // Hook scene (0-5 seconds)
    scenes.push({
      id: 'hook',
      text: sentences[0].trim() + '.',
      duration: 5000,
      startTime: 0,
      style: 'hook',
    })

    // Problem/Value scene (5-15 seconds)
    const problemText = sentences.slice(1, Math.min(4, sentences.length)).join('. ').trim() + '.'
    scenes.push({
      id: 'problem',
      text: problemText,
      duration: 10000,
      startTime: 5000,
      style: 'main',
    })

    // Solution scene (15-25 seconds)
    const solutionText = sentences.slice(Math.min(4, sentences.length), Math.min(7, sentences.length)).join('. ').trim() + '.'
    if (solutionText.length > 20) {
      scenes.push({
        id: 'solution',
        text: solutionText,
        duration: 10000,
        startTime: 15000,
        style: 'main',
      })
    }

    // CTA scene (25-30 seconds)
    scenes.push({
      id: 'cta',
      text: sentences[sentences.length - 1]?.trim() + '.' || 'Don\'t miss out!',
      duration: 5000,
      startTime: 25000,
      style: 'cta',
    })
  } else {
    // Fallback for short content
    scenes.push({
      id: 'hook',
      text: cleaned.substring(0, 100) || 'Check this out!',
      duration: 10000,
      startTime: 0,
      style: 'hook',
    })
    scenes.push({
      id: 'main',
      text: cleaned.substring(100, 250) || 'Amazing content for you.',
      duration: 15000,
      startTime: 10000,
      style: 'main',
    })
    scenes.push({
      id: 'cta',
      text: 'Don\'t miss out!',
      duration: 5000,
      startTime: 25000,
      style: 'cta',
    })
  }

  return scenes
}

// Video color schemes
const palettes = {
  instagram: { bg1: '#833AB4', bg2: '#E1306C', bg3: '#F77737', accent: '#FFD700', text: '#FFFFFF' },
  tiktok: { bg1: '#000000', bg2: '#00F2EA', bg3: '#FF0050', accent: '#00F2EA', text: '#FFFFFF' },
  facebook: { bg1: '#1877F2', bg2: '#42B72A', bg3: '#F7B928', accent: '#FFFFFF', text: '#FFFFFF' },
  linkedin: { bg1: '#0077B5', bg2: '#00A0DC', bg3: '#5BA0D9', accent: '#FFFFFF', text: '#FFFFFF' },
  x: { bg1: '#1DA1F2', bg2: '#14171A', bg3: '#657786', accent: '#1DA1F2', text: '#FFFFFF' },
  threads: { bg1: '#000000', bg2: '#282828', bg3: '#4A4A4A', accent: '#FFFFFF', text: '#FFFFFF' },
}

// Main video generation function
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

      const currentTime = (frame / fps) * 1000
      const progress = frame / totalFrames

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw animated background
      drawAnimatedBackground(ctx, width, height, progress, frame, palette)

      // Find current scene
      const currentScene = scenes.find(s =>
        currentTime >= s.startTime && currentTime < s.startTime + s.duration
      ) || scenes[0]

      // Calculate scene progress
      const sceneProgress = (currentTime - currentScene.startTime) / currentScene.duration

      // Draw scene content
      drawScene(ctx, width, height, currentScene, sceneProgress, palette, frame)

      // Draw captions
      drawCaptions(ctx, width, height, currentScene, sceneProgress, palette)

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

// Draw animated background with motion
function drawAnimatedBackground(ctx, width, height, progress, frame, palette) {
  // Animated gradient
  const gradient = ctx.createLinearGradient(
    0 + Math.sin(frame * 0.02) * 200,
    0,
    width + Math.cos(frame * 0.015) * 200,
    height
  )
  gradient.addColorStop(0, palette.bg1)
  gradient.addColorStop(0.5, palette.bg2)
  gradient.addColorStop(1, palette.bg3)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Animated mesh lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 2

  for (let i = 0; i < 15; i++) {
    ctx.beginPath()
    const y = (height / 15) * i + Math.sin(frame * 0.03 + i * 0.5) * 30
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(
      width * 0.3, y + 20,
      width * 0.7, y - 20,
      width, y
    )
    ctx.stroke()
  }

  // Floating particles
  for (let i = 0; i < 30; i++) {
    const x = (Math.sin(i * 0.7 + frame * 0.01) + 1) * width / 2
    const y = (Math.cos(i * 0.5 + frame * 0.008) + 1) * height / 2
    const size = 3 + Math.sin(i + frame * 0.05) * 2
    const alpha = 0.3 + Math.sin(i * 0.3 + frame * 0.02) * 0.2

    ctx.fillStyle = `rgba(255,255,255,${alpha})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
}

// Draw scene with animations
function drawScene(ctx, width, height, scene, progress, palette, frame) {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (scene.style === 'hook') {
    // Hook - Large dramatic text with entrance animation
    const scale = easeOutBack(Math.min(1, progress * 3))
    const alpha = Math.min(1, progress * 4)

    ctx.save()
    ctx.translate(width / 2, height * 0.35)
    ctx.scale(scale, scale)
    ctx.globalAlpha = alpha

    // Glow effect
    ctx.shadowColor = palette.accent
    ctx.shadowBlur = 40
    ctx.font = 'bold 80px Helvetica Neue, Arial, sans-serif'
    ctx.fillStyle = palette.text
    ctx.fillText(scene.text.substring(0, 30), 0, 0)

    ctx.shadowBlur = 0
    ctx.restore()

    // Decorative line
    const lineWidth = Math.min(400, progress * 800)
    ctx.strokeStyle = palette.accent
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(width / 2 - lineWidth / 2, height * 0.45)
    ctx.lineTo(width / 2 + lineWidth / 2, height * 0.45)
    ctx.stroke()

  } else if (scene.style === 'main') {
    // Main content with typewriter effect
    const alpha = Math.min(1, progress * 3)

    ctx.save()
    ctx.globalAlpha = alpha

    // Draw text with word reveal
    const words = scene.text.split(' ')
    const wordsToShow = Math.floor(words.length * Math.min(1, progress * 1.5))
    const visibleText = words.slice(0, wordsToShow).join(' ')

    // Split into lines
    ctx.font = '48px Helvetica Neue, Arial, sans-serif'
    const maxWidth = width * 0.85
    const lineHeight = 65
    const lines = wrapText(ctx, visibleText, maxWidth)
    const totalHeight = lines.length * lineHeight
    const startY = height * 0.35 - totalHeight / 2

    lines.forEach((line, i) => {
      const lineAlpha = Math.min(1, (progress * lines.length - i) * 2)
      ctx.globalAlpha = lineAlpha * alpha

      // Text shadow
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      ctx.fillStyle = palette.text
      ctx.fillText(line, width / 2, startY + i * lineHeight)
    })

    ctx.shadowBlur = 0
    ctx.restore()

  } else if (scene.style === 'cta') {
    // CTA with pulse animation
    const pulse = 1 + Math.sin(frame * 0.15) * 0.05
    const alpha = Math.min(1, progress * 4)

    ctx.save()
    ctx.translate(width / 2, height * 0.5)
    ctx.scale(pulse, pulse)
    ctx.globalAlpha = alpha

    // CTA button
    ctx.font = 'bold 56px Helvetica Neue, Arial, sans-serif'
    const textWidth = ctx.measureText(scene.text).width
    const btnWidth = textWidth + 80
    const btnHeight = 100

    // Button gradient
    const btnGradient = ctx.createLinearGradient(
      width / 2 - btnWidth / 2, 0,
      width / 2 + btnWidth / 2, 0
    )
    btnGradient.addColorStop(0, palette.accent)
    btnGradient.addColorStop(1, palette.bg1)

    ctx.fillStyle = btnGradient
    ctx.shadowColor = 'rgba(0,0,0,0.3)'
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.roundRect(width / 2 - btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 50)
    ctx.fill()

    // Button text
    ctx.shadowBlur = 0
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(scene.text, 0, 10)

    ctx.restore()
  }
}

// Draw synchronized captions at bottom
function drawCaptions(ctx, width, height, scene, progress, palette) {
  const captionHeight = 120
  const captionY = height - 200

  // Caption background
  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.beginPath()
  ctx.roundRect(40, captionY, width - 80, captionHeight, 10)
  ctx.fill()

  // Caption text with word highlighting
  const words = scene.text.split(' ')
  const wordsToShow = Math.floor(words.length * Math.min(1, progress * 1.5))

  ctx.font = '36px Helvetica Neue, Arial, sans-serif'
  ctx.textAlign = 'center'

  const captionText = words.slice(0, wordsToShow).join(' ')
  const captionLines = wrapText(ctx, captionText, width - 120)

  captionLines.slice(0, 2).forEach((line, i) => {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(line, width / 2, captionY + 40 + i * 40)
  })
}

// Draw progress bar
function drawProgressBar(ctx, width, height, progress, palette) {
  const barWidth = width - 100
  const barHeight = 6
  const x = 50
  const y = height - 60

  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.beginPath()
  ctx.roundRect(x, y, barWidth, barHeight, 3)
  ctx.fill()

  const gradient = ctx.createLinearGradient(x, y, x + barWidth * progress, y)
  gradient.addColorStop(0, palette.accent)
  gradient.addColorStop(1, palette.bg1)

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.roundRect(x, y, barWidth * progress, barHeight, 3)
  ctx.fill()
}

// Draw platform badge
function drawPlatformBadge(ctx, platform, x, y, palette) {
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.beginPath()
  ctx.roundRect(x, y, 140, 45, 22)
  ctx.fill()

  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 16px Helvetica Neue, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(platform.toUpperCase(), x + 70, y + 27)
  ctx.textAlign = 'left'
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

// Easing function
function easeOutBack(t) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

// Generate voiceover script (clean text without hashtags/emojis)
export function generateVoiceoverScript(content) {
  return cleanTextForVoice(content)
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
