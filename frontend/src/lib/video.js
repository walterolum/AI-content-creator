// Video Generator using Canvas API - Creates actual playable videos

// Parse content into sections
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
    caption: sections.caption.trim() || text.substring(0, 200),
    cta: sections.cta.trim() || 'Follow for more!',
  }
}

// Video color schemes
const colorSchemes = {
  instagram: { bg: ['#833AB4', '#FD1D1D', '#F77737'], text: '#FFFFFF' },
  tiktok: { bg: ['#000000', '#69C9D0', '#EE1D52'], text: '#FFFFFF' },
  facebook: { bg: ['#1877F2', '#42B72A', '#F7B928'], text: '#FFFFFF' },
  linkedin: { bg: ['#0077B5', '#00A0DC', '#5BA0D9'], text: '#FFFFFF' },
  x: { bg: ['#1DA1F2', '#14171A', '#657786'], text: '#FFFFFF' },
  threads: { bg: ['#000000', '#333333', '#666666'], text: '#FFFFFF' },
}

// Create animated video using Canvas
export async function generateVideo(content, platform = 'instagram', options = {}) {
  const {
    duration = 15000, // 15 seconds
    width = 1080,
    height = 1920, // Vertical video
    fps = 30,
  } = options

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const sections = parseContent(content)
  const colors = colorSchemes[platform] || colorSchemes.instagram

  // Create video stream
  const stream = canvas.captureStream(fps)
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 5000000,
  })

  const chunks = []
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }

  const videoBlob = await new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      resolve(blob)
    }

    mediaRecorder.start()

    // Animation frames
    const totalFrames = Math.floor((duration / 1000) * fps)
    let frame = 0

    const animate = () => {
      if (frame >= totalFrames) {
        mediaRecorder.stop()
        return
      }

      const progress = frame / totalFrames
      const time = (frame / fps) * 1000

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      colors.bg.forEach((color, i) => {
        gradient.addColorStop(i / (colors.bg.length - 1), color)
      })
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Add animated particles
      drawParticles(ctx, width, height, progress, frame)

      // Draw content based on time
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (progress < 0.3) {
        // Hook phase - large text with animation
        const scale = 1 + Math.sin(progress * 10) * 0.05
        ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.scale(scale, scale)
        drawTextWithShadow(ctx, sections.hook, 0, 0, 72, colors.text, width * 0.8)
        ctx.restore()
      } else if (progress < 0.8) {
        // Caption phase
        const alpha = Math.min(1, (progress - 0.3) * 5)
        ctx.globalAlpha = alpha
        drawWrappedText(ctx, sections.caption, width / 2, height * 0.3, 48, colors.text, width * 0.85)
        ctx.globalAlpha = 1
      } else {
        // CTA phase - with pulse animation
        const pulse = 1 + Math.sin(progress * 20) * 0.1
        ctx.save()
        ctx.translate(width / 2, height * 0.7)
        ctx.scale(pulse, pulse)
        drawTextWithShadow(ctx, sections.cta, 0, 0, 64, '#FFD700', width * 0.8)
        ctx.restore()
      }

      // Draw progress bar
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.fillRect(50, height - 100, width - 100, 8)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(50, height - 100, (width - 100) * progress, 8)

      // Draw platform logo placeholder
      drawPlatformBadge(ctx, platform, width - 150, 100)

      frame++
      requestAnimationFrame(animate)
    }

    animate()
  })

  return videoBlob
}

// Draw animated particles
function drawParticles(ctx, width, height, progress, frame) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
  for (let i = 0; i < 20; i++) {
    const x = (Math.sin(i * 0.5 + frame * 0.02) + 1) * width / 2
    const y = (Math.cos(i * 0.7 + frame * 0.015) + 1) * height / 2
    const size = 5 + Math.sin(i + frame * 0.05) * 3
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
}

// Draw text with shadow
function drawTextWithShadow(ctx, text, x, y, size, color, maxWidth) {
  ctx.font = `bold ${size}px Arial, sans-serif`
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2

  // Word wrap
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

  const lineHeight = size * 1.3
  const startY = y - ((lines.length - 1) * lineHeight) / 2

  ctx.fillStyle = color
  lines.forEach((l, i) => {
    ctx.fillText(l, x, startY + i * lineHeight)
  })

  ctx.shadowColor = 'transparent'
}

// Draw wrapped text
function drawWrappedText(ctx, text, x, y, size, color, maxWidth) {
  ctx.font = `${size}px Arial, sans-serif`
  ctx.fillStyle = color

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
  const startY = y

  lines.forEach((l, i) => {
    ctx.fillText(l, x, startY + i * lineHeight)
  })
}

// Draw platform badge
function drawPlatformBadge(ctx, platform, x, y) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.beginPath()
  ctx.roundRect(x, y, 120, 40, 20)
  ctx.fill()

  ctx.fillStyle = '#333333'
  ctx.font = 'bold 16px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(platform.toUpperCase(), x + 60, y + 25)
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
