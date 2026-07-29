const EMOJI_MAP = {
  'rocket': '🚀', 'fire': '🔥', 'star': '⭐', 'sparkle': '✨',
  'money': '💰', 'target': '🎯', 'chart': '📈', 'lightbulb': '💡',
  'check': '✅', 'crown': '👑', 'diamond': '💎', 'trophy': '🏆',
  'medal': '🏅', 'gem': '💎', 'thumbsup': '👍', 'clap': '👏',
  'heart': '❤️', 'zap': '⚡', 'boom': '💥', 'globe': '🌍',
  'phone': '📱', 'shop': '🛒', 'deal': '🤝', 'growth': '📊',
  'idea': '💡', 'team': '👥', 'time': '⏰', 'secure': '🔒',
  'fast': '⚡', 'smart': '🧠', 'premium': '💎', 'best': '🏆',
  'new': '🆕', 'hot': '🔥', 'sale': '🏷️', 'offer': '🎁',
  'free': '🆓', 'pro': '⭐', 'trust': '🤝', 'guaranteed': '✅',
}

function replaceEmojiPlaceholders(text) {
  let result = text
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    const regex = new RegExp(`:${key}:`, 'gi')
    result = result.replace(regex, emoji)
  }
  if (text.includes('## Emoji')) {
    const bizEmojis = ['✨', '🔥', '💎', '🚀', '⭐', '💡', '🏆', '✅', '👑', '💯']
    const randomEmojis = Array.from({ length: 3 }, () => bizEmojis[Math.floor(Math.random() * bizEmojis.length)])
    result += ' ' + randomEmojis.join(' ')
  }
  return result
}

function cleanTextForVoice(text) {
  return text
    .replace(/[\u{1F600}-\u{1FAFF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/#\w+/g, '')
    .replace(/^#{1,6}\s/gm, '')
    .replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/^\d+\.\s/gm, '').replace(/^[-*]\s/gm, '')
    .replace(/## \w+/g, '')
    .replace(/\s+/g, ' ').trim()
}

export function generateVoiceoverScript(content) {
  return cleanTextForVoice(content)
}

function extractKeywords(text) {
  const words = text.toLowerCase().split(/\s+/)
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought', 'used',
    'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'between',
    'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither',
    'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your',
    'it', 'its', 'they', 'them', 'their', 'he', 'him', 'his', 'she', 'her',
    'what', 'which', 'who', 'whom', 'whose', 'when', 'where', 'why', 'how'])
  const unique = [...new Set(words.filter(w => w.length > 3 && !stopWords.has(w)))]
  return unique.slice(0, 5)
}

function parseContentToScenes(text, options = {}) {
  const cleaned = cleanTextForVoice(text)
  const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 8)
  const keywords = extractKeywords(text)
  const productName = keywords[0] || 'Your Brand'
  const enrichedText = replaceEmojiPlaceholders(text)

  const scenes = []

  if (sentences.length >= 3) {
    scenes.push({
      id: 'intro',
      type: 'intro',
      title: productName.toUpperCase(),
      subtitle: sentences[0].trim() + '.',
      text: sentences[0].trim() + '.',
      voiceText: sentences[0].trim() + '.',
      duration: 6000,
      startTime: 0,
      transition: 'fade-in',
      emoji: '🚀',
      keywords,
    })

    scenes.push({
      id: 'problem',
      type: 'problem',
      title: 'The Challenge',
      text: sentences.slice(1, 3).join('. ').trim() + '.',
      voiceText: sentences.slice(1, 3).join('. ').trim() + '.',
      duration: 8000,
      startTime: 6000,
      transition: 'slide-left',
      emoji: '💡',
      keywords,
    })

    scenes.push({
      id: 'solution',
      type: 'solution',
      title: productName.charAt(0).toUpperCase() + productName.slice(1),
      text: sentences.slice(2, 4).join('. ').trim() + '.',
      voiceText: sentences.slice(2, 4).join('. ').trim() + '.',
      duration: 9000,
      startTime: 14000,
      transition: 'zoom-in',
      emoji: '🔥',
      keywords,
    })

    scenes.push({
      id: 'cta',
      type: 'cta',
      title: 'Act Now',
      subtitle: sentences[4] ? sentences[4].trim() + '.' : 'Get started today!',
      text: sentences[4] ? sentences[4].trim() + '.' : 'Don\'t miss out!',
      voiceText: sentences[4] ? sentences[4].trim() + '.' : 'Don\'t miss out!',
      duration: 7000,
      startTime: 23000,
      transition: 'scale-up',
      emoji: '🎯',
      keywords,
    })
  } else {
    scenes.push({
      id: 'intro', type: 'intro',
      title: productName.toUpperCase(),
      subtitle: cleaned.substring(0, 60) || 'Welcome!',
      text: cleaned.substring(0, 60) || 'Welcome!',
      voiceText: cleaned.substring(0, 60) || 'Welcome!',
      duration: 10000, startTime: 0, transition: 'fade-in', emoji: '🚀', keywords,
    })
    scenes.push({
      id: 'cta', type: 'cta',
      title: 'Get Started',
      subtitle: 'Don\'t miss out on this amazing opportunity!',
      text: 'Don\'t miss out on this amazing opportunity!',
      voiceText: 'Don\'t miss out on this amazing opportunity!',
      duration: 10000, startTime: 10000, transition: 'scale-up', emoji: '🔥', keywords,
    })
    scenes.push({
      id: 'outro', type: 'outro',
      title: productName.toUpperCase(),
      subtitle: 'Follow for more',
      text: 'Follow for more',
      voiceText: 'Follow for more',
      duration: 10000, startTime: 20000, transition: 'fade-out', emoji: '💎', keywords,
    })
  }

  scenes.push({
    id: 'outro',
    type: 'outro',
    title: productName.toUpperCase(),
    subtitle: 'Your Success Starts Here',
    text: 'Your Success Starts Here',
    voiceText: '',
    duration: 3000,
    startTime: 27000,
    transition: 'fade-out',
    emoji: '👑',
    keywords,
  })

  return scenes
}

export function getScenesForContent(content) {
  return parseContentToScenes(content)
}

const palettes = {
  instagram: { bg1: '#833AB4', bg2: '#C13584', bg3: '#E1306C', accent: '#FFD700', text: '#FFFFFF', glow: '#FF69B4' },
  tiktok: { bg1: '#000000', bg2: '#00F2EA', bg3: '#FF0050', accent: '#00F2EA', text: '#FFFFFF', glow: '#FF0050' },
  facebook: { bg1: '#1877F2', bg2: '#42B72A', bg3: '#F7B928', accent: '#FFFFFF', text: '#FFFFFF', glow: '#1877F2' },
  linkedin: { bg1: '#0077B5', bg2: '#00A0DC', bg3: '#5BA0D9', accent: '#FFFFFF', text: '#FFFFFF', glow: '#00A0DC' },
  x: { bg1: '#1DA1F2', bg2: '#14171A', bg3: '#657786', accent: '#1DA1F2', text: '#FFFFFF', glow: '#1DA1F2' },
  threads: { bg1: '#1A1A1A', bg2: '#333333', bg3: '#4A4A4A', accent: '#FFFFFF', text: '#FFFFFF', glow: '#FFFFFF' },
}

const sceneVisuals = {
  intro: {
    shapes: ['circle', 'diamond', 'line'],
    particleCount: 30,
    hasIcon: true,
  },
  problem: {
    shapes: ['line', 'triangle'],
    particleCount: 20,
    hasIcon: false,
  },
  solution: {
    shapes: ['circle', 'star', 'diamond'],
    particleCount: 40,
    hasIcon: true,
  },
  cta: {
    shapes: ['circle', 'star'],
    particleCount: 50,
    hasIcon: true,
  },
  outro: {
    shapes: ['diamond'],
    particleCount: 15,
    hasIcon: true,
  },
}

function drawEmoji(ctx, emoji, x, y, size) {
  ctx.font = `${size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, x, y)
}

export async function generateAdVideo(content, platform = 'instagram', options = {}) {
  const {
    duration = 30000,
    width = 1080,
    height = 1920,
    fps = 30,
    images = [],
    emojiStyle = 'default',
    textAnimation = 'kinetic',
    transitionStyle = 'smooth',
    showEmojis = true,
    sceneTemplates = 'default',
  } = options

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const scenes = parseContentToScenes(content)
  const palette = palettes[platform] || palettes.instagram

  const loadedImages = await loadImages(images)

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

      const currentScene = scenes.find(s =>
        currentTime >= s.startTime && currentTime < s.startTime + s.duration
      ) || scenes[0]

      const sceneProgress = (currentTime - currentScene.startTime) / currentScene.duration
      const sceneIndex = scenes.indexOf(currentScene)
      const nextScene = scenes[sceneIndex + 1]

      let transitionProgress = 0
      let isTransitioning = false
      if (nextScene && currentTime + 200 >= nextScene.startTime) {
        isTransitioning = true
        transitionProgress = (currentTime - (nextScene.startTime - 200)) / 200
      }

      drawBackground(ctx, width, height, frame, palette, currentScene)
      drawParticles(ctx, width, height, frame, palette, currentScene)
      drawSceneContent(ctx, width, height, currentScene, sceneProgress, palette, frame, loadedImages, showEmojis, isTransitioning, transitionProgress)
      drawCaptions(ctx, width, height, currentScene, sceneProgress, palette)
      drawProgressBar(ctx, width, height, progress, palette)

      frame++
      requestAnimationFrame(animate)
    }

    animate()
  })

  return videoBlob
}

async function loadImages(images) {
  const loaded = []
  for (const img of images) {
    try {
      if (img instanceof File || img instanceof Blob) {
        const url = URL.createObjectURL(img)
        const image = await loadImage(url)
        loaded.push({ image, file: img })
        URL.revokeObjectURL(url)
      } else if (typeof img === 'string') {
        const image = await loadImage(img)
        loaded.push({ image, url: img })
      }
    } catch (e) {
      console.warn('Failed to load image:', e)
    }
  }
  return loaded
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function drawBackground(ctx, width, height, frame, palette, scene) {
  const gradient = ctx.createRadialGradient(
    width / 2 + Math.sin(frame * 0.008) * 200,
    height / 2 + Math.cos(frame * 0.006) * 200,
    0,
    width / 2,
    height / 2,
    height * 0.85
  )
  gradient.addColorStop(0, palette.bg1)
  gradient.addColorStop(0.4, palette.bg2)
  gradient.addColorStop(0.7, '#1a1a2e')
  gradient.addColorStop(1, '#0a0a15')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = 'rgba(255,255,255,0.03)'
  ctx.lineWidth = 1.5
  for (let i = 0; i < 12; i++) {
    ctx.beginPath()
    const baseY = (height / 12) * i
    for (let x = 0; x <= width; x += 8) {
      const y = baseY + Math.sin(x * 0.008 + frame * 0.015 + i * 0.5) * 15
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  const lightX = width / 2 + Math.sin(frame * 0.003) * 400
  const lightY = height / 2 + Math.cos(frame * 0.004) * 300
  const lightGrad = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, width * 0.6)
  lightGrad.addColorStop(0, `rgba(255,255,255,0.03)`)
  lightGrad.addColorStop(0.5, `rgba(255,255,255,0.01)`)
  lightGrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = lightGrad
  ctx.fillRect(0, 0, width, height)

  const visual = sceneVisuals[scene.type] || sceneVisuals.intro
  const shapes = visual.shapes || []

  ctx.strokeStyle = `rgba(255,255,255,0.04)`
  ctx.lineWidth = 1

  shapes.forEach((shape, si) => {
    const sx = (Math.sin(si * 1.5 + frame * 0.002) + 1) * width * 0.5
    const sy = (Math.cos(si * 1.2 + frame * 0.003) + 1) * height * 0.5
    const ssize = 80 + Math.sin(si + frame * 0.01) * 30

    ctx.save()
    ctx.translate(sx, sy)
    ctx.rotate(frame * 0.005 + si)

    if (shape === 'circle') {
      ctx.beginPath()
      ctx.arc(0, 0, ssize / 2, 0, Math.PI * 2)
      ctx.stroke()
    } else if (shape === 'diamond') {
      ctx.beginPath()
      ctx.moveTo(0, -ssize / 2)
      ctx.lineTo(ssize / 2, 0)
      ctx.lineTo(0, ssize / 2)
      ctx.lineTo(-ssize / 2, 0)
      ctx.closePath()
      ctx.stroke()
    } else if (shape === 'line') {
      ctx.beginPath()
      ctx.moveTo(-ssize / 2, 0)
      ctx.lineTo(ssize / 2, 0)
      ctx.stroke()
    } else if (shape === 'star') {
      drawStar(ctx, 0, 0, 5, ssize / 2, ssize / 4)
      ctx.stroke()
    } else if (shape === 'triangle') {
      ctx.beginPath()
      ctx.moveTo(0, -ssize / 2)
      ctx.lineTo(ssize / 2, ssize / 2)
      ctx.lineTo(-ssize / 2, ssize / 2)
      ctx.closePath()
      ctx.stroke()
    }

    ctx.restore()
  })
}

function drawParticles(ctx, width, height, frame, palette, scene) {
  const visual = sceneVisuals[scene.type] || sceneVisuals.intro
  const count = visual.particleCount || 20

  for (let i = 0; i < count; i++) {
    const seed = i * 137.5
    const x = (Math.sin(seed + frame * 0.003) + 1) * width / 2
    const y = (Math.cos(seed * 1.3 + frame * 0.002) + 1) * height / 2
    const size = 3 + Math.sin(seed + frame * 0.01) * 2
    const alpha = 0.08 + Math.sin(seed * 0.7 + frame * 0.005) * 0.05

    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${alpha})`
    ctx.fill()

    if (i % 3 === 0) {
      ctx.beginPath()
      ctx.arc(x, y, size * 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.3})`
      ctx.fill()
    }
  }
}

function drawSceneContent(ctx, width, height, scene, progress, palette, frame, loadedImages, showEmojis, isTransitioning, transitionProgress) {
  ctx.save()

  if (isTransitioning) {
    const ease = easeOutCubic(transitionProgress)
    const scale = 1 - ease * 0.08
    const alpha = 1 - ease
    ctx.globalAlpha = alpha
    ctx.translate(width / 2, height / 2)
    ctx.scale(scale, scale)
    ctx.translate(-width / 2, -height / 2)
  }

  const displayEmoji = showEmojis ? scene.emoji || '✨' : null

  switch (scene.type) {
    case 'intro':
      drawIntroScene(ctx, width, height, scene, progress, palette, frame, displayEmoji, loadedImages)
      break
    case 'problem':
      drawProblemScene(ctx, width, height, scene, progress, palette, frame, displayEmoji, loadedImages)
      break
    case 'solution':
      drawSolutionScene(ctx, width, height, scene, progress, palette, frame, displayEmoji, loadedImages)
      break
    case 'cta':
      drawCTAScene(ctx, width, height, scene, progress, palette, frame, displayEmoji, loadedImages)
      break
    case 'outro':
      drawOutroScene(ctx, width, height, scene, progress, palette, frame, displayEmoji, loadedImages)
      break
    default:
      drawSolutionScene(ctx, width, height, scene, progress, palette, frame, displayEmoji, loadedImages)
  }

  ctx.restore()
}

function drawIntroScene(ctx, width, height, scene, progress, palette, frame, emoji, loadedImages) {
  const ease = easeOutCubic(Math.min(1, progress * 2))
  const alpha = Math.min(1, progress * 2.5)
  const yOffset = (1 - ease) * 120

  if (emoji) {
    const emojiSize = 80 + Math.sin(frame * 0.04) * 5
    ctx.save()
    ctx.globalAlpha = alpha * 0.3
    drawEmoji(ctx, emoji, width / 2, height * 0.15 + yOffset * 0.5, emojiSize)
    ctx.restore()
  }

  ctx.save()
  ctx.globalAlpha = alpha

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 60px "Helvetica Neue", Arial, sans-serif'
  ctx.shadowColor = palette.accent
  ctx.shadowBlur = 20
  ctx.fillStyle = palette.accent
  ctx.fillText(scene.title, width / 2, height * 0.28 + yOffset)

  ctx.shadowBlur = 0
  ctx.font = '48px "Helvetica Neue", Arial, sans-serif'
  ctx.fillStyle = palette.text
  const subtitleLines = wrapText(ctx, scene.subtitle, width * 0.85)
  const lineHeight = 62
  const startY = height * 0.42 - (subtitleLines.length * lineHeight) / 2 + yOffset * 0.5

  subtitleLines.forEach((line, i) => {
    const lineAlpha = Math.min(1, (progress * subtitleLines.length - i) * 1.5)
    ctx.save()
    ctx.globalAlpha = lineAlpha * alpha
    ctx.fillText(line, width / 2, startY + i * lineHeight)
    ctx.restore()
  })

  ctx.restore()

  if (loadedImages.length > 0) {
    const img = loadedImages[0].image
    const imgSize = 160
    const imgX = width / 2 - imgSize / 2
    const imgY = height * 0.62 + yOffset * 0.3
    const imgAlpha = Math.min(1, progress * 2)

    ctx.save()
    ctx.globalAlpha = imgAlpha
    ctx.beginPath()
    ctx.roundRect(imgX, imgY, imgSize, imgSize, 24)
    ctx.clip()
    ctx.drawImage(img, imgX, imgY, imgSize, imgSize)
    ctx.restore()

    ctx.save()
    ctx.globalAlpha = 0.15 * imgAlpha
    ctx.shadowColor = palette.accent
    ctx.shadowBlur = 40
    ctx.beginPath()
    ctx.roundRect(imgX, imgY, imgSize, imgSize, 24)
    ctx.fill()
    ctx.restore()
  }
}

function drawProblemScene(ctx, width, height, scene, progress, palette, frame, emoji, loadedImages) {
  const alpha = Math.min(1, progress * 1.8)
  const slideX = (1 - easeOutCubic(Math.min(1, progress * 1.5))) * 200

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 40px "Helvetica Neue", Arial, sans-serif'
  ctx.shadowColor = 'rgba(255,150,50,0.3)'
  ctx.shadowBlur = 10
  ctx.fillStyle = '#FFD700'
  ctx.fillText(scene.title, width / 2 - slideX * 0.3, height * 0.2)

  ctx.shadowBlur = 0
  ctx.font = '42px "Helvetica Neue", Arial, sans-serif'
  ctx.fillStyle = palette.text

  const words = scene.text.split(' ')
  const wordsToShow = Math.floor(words.length * Math.min(1, progress * 1.3))
  const visibleText = words.slice(0, wordsToShow).join(' ')
  const lines = wrapText(ctx, visibleText, width * 0.82)
  const lineHeight = 56
  const totalHeight = lines.length * lineHeight
  const startY = height * 0.45 - totalHeight / 2 - slideX * 0.2

  lines.forEach((line, i) => {
    const lineAlpha = Math.min(1, (progress * lines.length - i) * 1.2)
    ctx.save()
    ctx.globalAlpha = lineAlpha * alpha
    ctx.fillText(line, width / 2, startY + i * lineHeight)
    ctx.restore()
  })

  if (emoji) {
    ctx.save()
    ctx.globalAlpha = 0.15 * alpha
    drawEmoji(ctx, emoji, width * 0.85 + slideX, height * 0.25, 60)
    ctx.restore()
  }

  ctx.restore()
}

function drawSolutionScene(ctx, width, height, scene, progress, palette, frame, emoji, loadedImages) {
  const alpha = Math.min(1, progress * 1.5)
  const scale = 0.5 + easeOutBack(Math.min(1, progress * 1.2)) * 0.5
  const yOffset = (1 - easeOutCubic(Math.min(1, progress * 1.3))) * 80

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 48px "Helvetica Neue", Arial, sans-serif'
  ctx.shadowColor = palette.glow || palette.accent
  ctx.shadowBlur = 25
  ctx.fillStyle = palette.accent
  ctx.fillText(scene.title, width / 2, height * 0.2 + yOffset)

  ctx.shadowBlur = 0
  ctx.font = '38px "Helvetica Neue", Arial, sans-serif'
  ctx.fillStyle = palette.text

  const words = scene.text.split(' ')
  const wordsToShow = Math.floor(words.length * Math.min(1, progress * 1.2))
  const visibleText = words.slice(0, wordsToShow).join(' ')
  const lines = wrapText(ctx, visibleText, width * 0.8)
  const lineHeight = 52
  const totalHeight = lines.length * lineHeight
  const startY = height * 0.42 - totalHeight / 2 + yOffset * 0.5

  lines.forEach((line, i) => {
    const lineAlpha = Math.min(1, (progress * lines.length - i) * 1.2)
    const wordScale = i === 0 ? 1 : (0.95 + Math.sin(frame * 0.02 + i) * 0.05)
    ctx.save()
    ctx.globalAlpha = lineAlpha * alpha
    ctx.translate(width / 2, startY + i * lineHeight)
    ctx.scale(wordScale, wordScale)
    ctx.fillText(line, 0, 0)
    ctx.restore()
  })

  if (loadedImages.length > 0) {
    const img = loadedImages[0].image
    const imgW = 200
    const imgH = 200
    const imgX = (width - imgW) / 2
    const imgY = height * 0.72 + yOffset * 0.3
    const imgAlpha = Math.min(1, (progress - 0.2) * 2)

    if (imgAlpha > 0) {
      ctx.save()
      ctx.globalAlpha = imgAlpha * alpha
      ctx.shadowColor = palette.glow || palette.accent
      ctx.shadowBlur = 30
      ctx.beginPath()
      ctx.roundRect(imgX, imgY, imgW, imgH, 20)
      ctx.clip()
      ctx.drawImage(img, imgX, imgY, imgW, imgH)
      ctx.restore()
    }
  }

  if (emoji && !loadedImages.length) {
    const emojiSize = 50 + Math.sin(frame * 0.03) * 5
    ctx.save()
    ctx.globalAlpha = 0.2 * alpha
    ctx.translate(width * 0.8, height * 0.75 + yOffset * 0.3)
    ctx.scale(scale, scale)
    drawEmoji(ctx, emoji, 0, 0, emojiSize)
    ctx.restore()
  }

  ctx.restore()
}

function drawCTAScene(ctx, width, height, scene, progress, palette, frame, emoji, loadedImages) {
  const pulse = 1 + Math.sin(frame * 0.06) * 0.02
  const alpha = Math.min(1, progress * 2.5)
  const glowPulse = 15 + Math.sin(frame * 0.08) * 10

  ctx.save()
  ctx.globalAlpha = alpha

  ctx.font = 'bold 56px "Helvetica Neue", Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.shadowColor = palette.accent
  ctx.shadowBlur = glowPulse
  ctx.fillStyle = palette.accent

  ctx.save()
  ctx.translate(width / 2, height * 0.3)
  ctx.scale(pulse, pulse)
  ctx.fillText(scene.title, 0, 0)
  ctx.restore()

  ctx.shadowBlur = 0
  ctx.font = '38px "Helvetica Neue", Arial, sans-serif'
  ctx.fillStyle = palette.text

  const lines = wrapText(ctx, scene.subtitle, width * 0.8)
  const lineHeight = 48
  const startY = height * 0.48

  lines.forEach((line, i) => {
    const reduce = Math.max(0, 1 - i * 0.1)
    ctx.save()
    ctx.globalAlpha = alpha * reduce
    ctx.fillText(line, width / 2, startY + i * lineHeight)
    ctx.restore()
  })

  const barColor = palette.accent
  ctx.shadowColor = barColor
  ctx.shadowBlur = 10
  ctx.strokeStyle = barColor
  ctx.lineWidth = 3
  ctx.beginPath()
  const barY = height * 0.38
  const barWidth = 100 + Math.sin(frame * 0.04) * 20
  ctx.moveTo(width / 2 - barWidth, barY)
  ctx.lineTo(width / 2 + barWidth, barY)
  ctx.stroke()

  const barY2 = height * 0.58
  ctx.beginPath()
  ctx.moveTo(width / 2 - barWidth * 0.7, barY2)
  ctx.lineTo(width / 2 + barWidth * 0.7, barY2)
  ctx.stroke()
  ctx.shadowBlur = 0

  if (emoji) {
    const bounce = Math.abs(Math.sin(frame * 0.05)) * 10
    ctx.save()
    ctx.globalAlpha = 0.25 * alpha
    drawEmoji(ctx, emoji, width / 2, height * 0.68 - bounce, 70)
    ctx.restore()
  }

  if (loadedImages.length > 1) {
    const img = loadedImages[1].image
    const imgSize = 120
    const imgX = (width - imgSize) / 2
    const imgY = height * 0.7
    const imgAlpha = Math.min(1, progress * 2)

    ctx.save()
    ctx.globalAlpha = imgAlpha * alpha
    ctx.beginPath()
    ctx.roundRect(imgX, imgY, imgSize, imgSize, 16)
    ctx.clip()
    ctx.drawImage(img, imgX, imgY, imgSize, imgSize)
    ctx.restore()
  }

  ctx.restore()
}

function drawOutroScene(ctx, width, height, scene, progress, palette, frame, emoji, loadedImages) {
  const ease = easeOutCubic(Math.min(1, progress * 1.2))
  const alpha = 1 - ease * 0.5
  const scale = 1 - (1 - ease) * 0.3

  ctx.save()
  ctx.translate(width / 2, height * 0.4)
  ctx.scale(scale, scale)
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 56px "Helvetica Neue", Arial, sans-serif'
  ctx.shadowColor = palette.accent
  ctx.shadowBlur = 20
  ctx.fillStyle = palette.accent
  ctx.fillText(scene.title, 0, 0)

  ctx.shadowBlur = 0
  ctx.font = '36px "Helvetica Neue", Arial, sans-serif'
  ctx.fillStyle = palette.text
  ctx.fillText(scene.subtitle, 0, 80)

  if (emoji) {
    ctx.save()
    ctx.globalAlpha = 0.3 * alpha
    drawEmoji(ctx, emoji, 0, -120, 60)
    ctx.restore()
  }

  ctx.restore()

  const fadeOut = Math.max(0, 1 - (1 - progress) * 3)
  if (fadeOut > 0) {
    ctx.save()
    ctx.globalAlpha = 1 - fadeOut
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3
  let x = cx
  let y = cy
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }
  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath()
}

function drawCaptions(ctx, width, height, scene, progress, palette) {
  const captionY = height - 180
  const captionHeight = 100

  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.beginPath()
  ctx.roundRect(30, captionY, width - 60, captionHeight, 14)
  ctx.fill()

  const words = scene.text.split(' ')
  const wordsToShow = Math.floor(words.length * Math.min(1, progress * 1.15))
  const captionText = words.slice(0, wordsToShow).join(' ')

  ctx.font = '30px "Helvetica Neue", Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 4

  const captionLines = wrapText(ctx, captionText, width - 100)
  const captionLineHeight = 38
  const captionStartY = captionY + 35

  captionLines.slice(0, 2).forEach((line, i) => {
    ctx.fillText(line, width / 2, captionStartY + i * captionLineHeight)
  })

  ctx.shadowBlur = 0
}

function drawProgressBar(ctx, width, height, progress, palette) {
  const barWidth = width - 80
  const barHeight = 4
  const x = 40
  const y = height - 50

  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.beginPath()
  ctx.roundRect(x, y, barWidth, barHeight, 2)
  ctx.fill()

  const gradient = ctx.createLinearGradient(x, y, x + barWidth * progress, y)
  gradient.addColorStop(0, palette.accent)
  gradient.addColorStop(0.5, palette.glow || palette.accent)
  gradient.addColorStop(1, palette.bg1)

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.roundRect(x, y, barWidth * progress, barHeight, 2)
  ctx.fill()
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  let line = ''
  const lines = []
  for (const word of words) {
    const testLine = line + word + ' '
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line.trim())
      line = word + ' '
    } else {
      line = testLine
    }
  }
  lines.push(line.trim())
  return lines
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }
function easeOutBack(t) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

export function createVideoUrl(blob) {
  return URL.createObjectURL(blob)
}

export function downloadVideo(blob, filename = 'advertisement') {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.webm`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
