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
    .replace(/[\u{1F600}-\u{1FAFF}]/gu, '').replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/#\w+/g, '').replace(/^#{1,6}\s/gm, '')
    .replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '')
    .replace(/https?:\/\/\S+/g, '').replace(/^\d+\.\s/gm, '').replace(/^[-*]\s/gm, '')
    .replace(/## \w+/g, '').replace(/\s+/g, ' ').trim()
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

function parseContentToScenes(text) {
  const cleaned = cleanTextForVoice(text)
  const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 8)
  const keywords = extractKeywords(text)
  const productName = keywords[0] || 'Your Brand'

  const scenes = []

  if (sentences.length >= 3) {
    scenes.push({
      id: 'intro', type: 'intro',
      title: productName.toUpperCase(),
      subtitle: sentences[0].trim() + '.',
      text: sentences[0].trim() + '.',
      voiceText: sentences[0].trim() + '.',
      duration: 7000, startTime: 0, transition: 'crossfade', emoji: '🚀', keywords,
    })
    scenes.push({
      id: 'problem', type: 'problem',
      title: 'The Challenge',
      text: sentences.slice(1, 3).join('. ').trim() + '.',
      voiceText: sentences.slice(1, 3).join('. ').trim() + '.',
      duration: 8000, startTime: 7000, transition: 'crossfade', emoji: '💡', keywords,
    })
    scenes.push({
      id: 'solution', type: 'solution',
      title: productName.charAt(0).toUpperCase() + productName.slice(1),
      text: sentences.slice(2, 4).join('. ').trim() + '.',
      voiceText: sentences.slice(2, 4).join('. ').trim() + '.',
      duration: 9000, startTime: 15000, transition: 'crossfade', emoji: '🔥', keywords,
    })
    scenes.push({
      id: 'cta', type: 'cta',
      title: 'Act Now',
      subtitle: sentences[4] ? sentences[4].trim() + '.' : 'Don\'t miss out!',
      text: sentences[4] ? sentences[4].trim() + '.' : 'Don\'t miss out!',
      voiceText: sentences[4] ? sentences[4].trim() + '.' : 'Don\'t miss out!',
      duration: 7000, startTime: 24000, transition: 'crossfade', emoji: '🎯', keywords,
    })
    scenes.push({
      id: 'outro', type: 'outro',
      title: productName.toUpperCase(),
      subtitle: 'Your Success Starts Here',
      text: 'Your Success Starts Here',
      voiceText: '',
      duration: 2000, startTime: 28000, transition: 'crossfade', emoji: '👑', keywords,
    })
  } else {
    scenes.push({
      id: 'intro', type: 'intro', title: productName.toUpperCase(),
      subtitle: cleaned.substring(0, 60) || 'Welcome!',
      text: cleaned.substring(0, 60) || 'Welcome!',
      voiceText: cleaned.substring(0, 60) || 'Welcome!',
      duration: 12000, startTime: 0, transition: 'crossfade', emoji: '🚀', keywords,
    })
    scenes.push({
      id: 'cta', type: 'cta', title: 'Get Started',
      subtitle: 'Don\'t miss out!',
      text: 'Don\'t miss out!',
      voiceText: 'Don\'t miss out!',
      duration: 12000, startTime: 12000, transition: 'crossfade', emoji: '🔥', keywords,
    })
    scenes.push({
      id: 'outro', type: 'outro', title: productName.toUpperCase(),
      subtitle: 'Your Success Starts Here',
      text: 'Your Success Starts Here',
      voiceText: '',
      duration: 6000, startTime: 24000, transition: 'crossfade', emoji: '💎', keywords,
    })
  }
  return scenes
}

export function getScenesForContent(content) {
  return parseContentToScenes(content)
}

const palettes = {
  instagram: { bg1: '#833AB4', bg2: '#C13584', bg3: '#E1306C', accent: '#FFD700', text: '#FFFFFF', glow: '#FF69B4', studio: '#2d1b3d' },
  tiktok: { bg1: '#000000', bg2: '#00F2EA', bg3: '#FF0050', accent: '#00F2EA', text: '#FFFFFF', glow: '#FF0050', studio: '#111111' },
  facebook: { bg1: '#1877F2', bg2: '#42B72A', bg3: '#F7B928', accent: '#FFFFFF', text: '#FFFFFF', glow: '#1877F2', studio: '#0d2b45' },
  linkedin: { bg1: '#0077B5', bg2: '#00A0DC', bg3: '#5BA0D9', accent: '#FFFFFF', text: '#FFFFFF', glow: '#00A0DC', studio: '#032438' },
  x: { bg1: '#1DA1F2', bg2: '#14171A', bg3: '#657786', accent: '#1DA1F2', text: '#FFFFFF', glow: '#1DA1F2', studio: '#0a0a0a' },
  threads: { bg1: '#1A1A1A', bg2: '#333333', bg3: '#4A4A4A', accent: '#FFFFFF', text: '#FFFFFF', glow: '#FFFFFF', studio: '#141414' },
}

const sceneVisuals = {
  intro: { shapes: ['circle', 'diamond'], particleCount: 25, hasIcon: true },
  problem: { shapes: ['line'], particleCount: 18, hasIcon: false },
  solution: { shapes: ['circle', 'star'], particleCount: 35, hasIcon: true },
  cta: { shapes: ['circle', 'star'], particleCount: 45, hasIcon: true },
  outro: { shapes: ['diamond'], particleCount: 12, hasIcon: true },
}

function drawEmoji(ctx, emoji, x, y, size) {
  ctx.font = `${size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(emoji, x, y)
}

export async function generateAdVideo(content, platform = 'instagram', options = {}) {
  const { duration = 30000, width = 1080, height = 1920, fps = 30, images = [], showEmojis = true } = options

  const canvas = document.createElement('canvas')
  canvas.width = width; canvas.height = height
  const ctx = canvas.getContext('2d')

  const scenes = parseContentToScenes(content)
  const palette = palettes[platform] || palettes.instagram
  const loadedImages = await loadImages(images)

  const stream = canvas.captureStream(fps)
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 8000000 })

  const chunks = []
  mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }

  const videoBlob = await new Promise((resolve) => {
    mediaRecorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }))
    mediaRecorder.start()

    const totalFrames = Math.floor((duration / 1000) * fps)
    let frame = 0
    let prevSceneId = null

    const animate = () => {
      if (frame >= totalFrames) { mediaRecorder.stop(); return }

      const currentTime = (frame / fps) * 1000
      const progress = frame / totalFrames
      ctx.clearRect(0, 0, width, height)

      const currentScene = scenes.find(s => currentTime >= s.startTime && currentTime < s.startTime + s.duration) || scenes[0]
      const sceneProgress = (currentTime - currentScene.startTime) / currentScene.duration

      const sceneIndex = scenes.indexOf(currentScene)
      const nextScene = scenes[sceneIndex + 1]

      let crossfadeAlpha = 1
      let prevScene = null
      if (prevSceneId && prevSceneId !== currentScene.id) {
        prevScene = scenes.find(s => s.id === prevSceneId)
      }
      if (nextScene && currentTime + 300 >= nextScene.startTime) {
        crossfadeAlpha = 1 - (currentTime - (nextScene.startTime - 300)) / 300
      }
      if (prevScene && sceneProgress < 0.15) {
        crossfadeAlpha = Math.min(1, sceneProgress / 0.15)
      }

      drawStudioBackground(ctx, width, height, frame, palette, currentScene)
      drawSoftGlow(ctx, width, height, frame, palette)
      drawParticles(ctx, width, height, frame, palette, currentScene)
      drawSceneContent(ctx, width, height, currentScene, sceneProgress, palette, frame, loadedImages, showEmojis, crossfadeAlpha)
      drawCaptionBar(ctx, width, height, currentScene, sceneProgress, palette)
      drawProgressBar(ctx, width, height, progress, palette)

      prevSceneId = currentScene.id
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
    } catch (e) { console.warn('Failed to load image:', e) }
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

function drawStudioBackground(ctx, width, height, frame, palette, scene) {
  const grad = ctx.createRadialGradient(width / 2, height * 0.4, 0, width / 2, height * 0.4, height * 0.9)
  grad.addColorStop(0, palette.bg1)
  grad.addColorStop(0.35, palette.bg2)
  grad.addColorStop(0.6, palette.studio || '#1a1a2e')
  grad.addColorStop(1, '#0a0a12')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  const floorGrad = ctx.createLinearGradient(0, height * 0.82, 0, height)
  floorGrad.addColorStop(0, 'rgba(0,0,0,0)')
  floorGrad.addColorStop(0.3, 'rgba(0,0,0,0.15)')
  floorGrad.addColorStop(1, 'rgba(0,0,0,0.35)')
  ctx.fillStyle = floorGrad
  ctx.fillRect(0, height * 0.82, width, height * 0.18)

  const stageGrad = ctx.createRadialGradient(width / 2, height * 0.78, 50, width / 2, height * 0.78, width * 0.45)
  stageGrad.addColorStop(0, 'rgba(255,255,255,0.06)')
  stageGrad.addColorStop(0.5, 'rgba(255,255,255,0.02)')
  stageGrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = stageGrad
  ctx.beginPath()
  ctx.ellipse(width / 2, height * 0.78, width * 0.45, 60, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255,255,255,0.025)'
  ctx.lineWidth = 1
  for (let i = 0; i < 8; i++) {
    ctx.beginPath()
    const baseY = (height / 8) * i
    for (let x = 0; x <= width; x += 6) {
      const y = baseY + Math.sin(x * 0.006 + frame * 0.01 + i * 0.7) * 10
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  const visual = sceneVisuals[scene.type] || sceneVisuals.intro
  const shapes = visual.shapes || []
  ctx.strokeStyle = `rgba(255,255,255,0.03)`
  ctx.lineWidth = 1
  shapes.forEach((shape, si) => {
    const sx = (Math.sin(si * 1.5 + frame * 0.0015) + 1) * width * 0.5
    const sy = (Math.cos(si * 1.2 + frame * 0.002) + 1) * height * 0.5
    const ssize = 100 + Math.sin(si + frame * 0.008) * 25
    ctx.save()
    ctx.translate(sx, sy)
    ctx.rotate(frame * 0.004 + si)
    if (shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, ssize / 2, 0, Math.PI * 2); ctx.stroke() }
    else if (shape === 'diamond') { ctx.beginPath(); ctx.moveTo(0, -ssize / 2); ctx.lineTo(ssize / 2, 0); ctx.lineTo(0, ssize / 2); ctx.lineTo(-ssize / 2, 0); ctx.closePath(); ctx.stroke() }
    else if (shape === 'line') { ctx.beginPath(); ctx.moveTo(-ssize / 2, 0); ctx.lineTo(ssize / 2, 0); ctx.stroke() }
    else if (shape === 'star') { drawStar(ctx, 0, 0, 5, ssize / 2, ssize / 4); ctx.stroke() }
    ctx.restore()
  })
}

function drawSoftGlow(ctx, width, height, frame, palette) {
  const glowX = width / 2 + Math.sin(frame * 0.002) * 300
  const glowY = height * 0.3 + Math.cos(frame * 0.003) * 200
  const glowGrad = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, width * 0.55)
  glowGrad.addColorStop(0, `rgba(255,255,255,0.04)`)
  glowGrad.addColorStop(0.4, `rgba(255,255,255,0.015)`)
  glowGrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glowGrad
  ctx.fillRect(0, 0, width, height)
}

function drawParticles(ctx, width, height, frame, palette, scene) {
  const visual = sceneVisuals[scene.type] || sceneVisuals.intro
  const count = visual.particleCount || 20
  for (let i = 0; i < count; i++) {
    const seed = i * 137.5
    const x = (Math.sin(seed + frame * 0.002) + 1) * width / 2
    const y = (Math.cos(seed * 1.3 + frame * 0.0015) + 1) * height / 2
    const size = 2 + Math.sin(seed + frame * 0.008) * 1.5
    const alpha = 0.06 + Math.sin(seed * 0.7 + frame * 0.004) * 0.04
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${alpha})`
    ctx.fill()
  }
}

function drawSceneContent(ctx, width, height, scene, progress, palette, frame, loadedImages, showEmojis, crossfadeAlpha) {
  ctx.save()
  ctx.globalAlpha = crossfadeAlpha
  const displayEmoji = showEmojis ? scene.emoji || '✨' : null
  switch (scene.type) {
    case 'intro': drawIntroScene(ctx, width, height, scene, progress, palette, frame, displayEmoji, loadedImages); break
    case 'problem': drawProblemScene(ctx, width, height, scene, progress, palette, frame, displayEmoji, loadedImages); break
    case 'solution': drawSolutionScene(ctx, width, height, scene, progress, palette, frame, displayEmoji, loadedImages); break
    case 'cta': drawCTAScene(ctx, width, height, scene, progress, palette, frame, displayEmoji, loadedImages); break
    case 'outro': drawOutroScene(ctx, width, height, scene, progress, palette, frame, displayEmoji, loadedImages); break
  }
  ctx.restore()
}

function drawRoundedImage(ctx, img, x, y, w, h, radius, shadowColor, shadowBlur) {
  ctx.save()
  if (shadowBlur) {
    ctx.shadowColor = shadowColor || 'rgba(0,0,0,0.3)'
    ctx.shadowBlur = shadowBlur
  }
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, radius)
  ctx.clip()
  ctx.drawImage(img, x, y, w, h)
  ctx.restore()
}

function drawIntroScene(ctx, width, height, scene, progress, palette, frame, emoji, loadedImages) {
  const ease = easeOutCubic(Math.min(1, progress * 1.8))
  const alpha = Math.min(1, progress * 2.2)
  const yOffset = (1 - ease) * 100

  if (emoji) {
    const emojiSize = 70 + Math.sin(frame * 0.03) * 4
    ctx.save()
    ctx.globalAlpha = alpha * 0.25
    ctx.shadowColor = palette.accent
    ctx.shadowBlur = 30
    drawEmoji(ctx, emoji, width / 2, height * 0.14 + yOffset * 0.4, emojiSize)
    ctx.restore()
  }

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 56px "Helvetica Neue", Arial, sans-serif'
  ctx.shadowColor = palette.accent
  ctx.shadowBlur = 15
  ctx.fillStyle = palette.accent
  ctx.fillText(scene.title, width / 2, height * 0.26 + yOffset)

  ctx.shadowBlur = 0
  ctx.font = '44px "Helvetica Neue", Arial, sans-serif'
  ctx.fillStyle = palette.text
  const subtitleLines = wrapText(ctx, scene.subtitle, width * 0.82)
  const lineHeight = 58
  const startY = height * 0.40 - (subtitleLines.length * lineHeight) / 2 + yOffset * 0.4

  subtitleLines.forEach((line, i) => {
    const lineAlpha = Math.min(1, (progress * subtitleLines.length - i) * 1.4)
    ctx.save()
    ctx.globalAlpha = lineAlpha * alpha
    ctx.fillText(line, width / 2, startY + i * lineHeight)
    ctx.restore()
  })

  if (loadedImages.length > 0) {
    const img = loadedImages[0].image
    const imgSize = 140
    const imgX = (width - imgSize) / 2
    const imgY = height * 0.60 + yOffset * 0.3
    const imgAlpha = Math.min(1, progress * 2)
    ctx.save()
    ctx.globalAlpha = imgAlpha
    drawRoundedImage(ctx, img, imgX, imgY, imgSize, imgSize, 20, palette.glow, 25)
    ctx.restore()
  }
  ctx.restore()
}

function drawProblemScene(ctx, width, height, scene, progress, palette, frame, emoji, loadedImages) {
  const alpha = Math.min(1, progress * 1.5)
  const slideX = (1 - easeOutCubic(Math.min(1, progress * 1.3))) * 180

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 38px "Helvetica Neue", Arial, sans-serif'
  ctx.shadowColor = 'rgba(255,150,50,0.2)'
  ctx.shadowBlur = 8
  ctx.fillStyle = '#FFD700'
  ctx.fillText('◆  ' + scene.title + '  ◆', width / 2 - slideX * 0.3, height * 0.18)

  ctx.shadowBlur = 0
  const words = scene.text.split(' ')
  const wordsToShow = Math.floor(words.length * Math.min(1, progress * 1.25))
  const visibleText = words.slice(0, wordsToShow).join(' ')
  const lines = wrapText(ctx, visibleText, width * 0.8)
  const lineHeight = 54
  const totalHeight = lines.length * lineHeight
  const startY = height * 0.42 - totalHeight / 2 - slideX * 0.15

  lines.forEach((line, i) => {
    const lineAlpha = Math.min(1, (progress * lines.length - i) * 1.1)
    ctx.save()
    ctx.globalAlpha = lineAlpha * alpha
    ctx.fillText(line, width / 2, startY + i * lineHeight)
    ctx.restore()
  })

  if (loadedImages.length > 0) {
    const img = loadedImages[0].image
    const imgW = 180; const imgH = 180
    const imgX = (width - imgW) / 2
    const imgY = height * 0.68
    const imgAlpha = Math.min(1, (progress - 0.15) * 2)
    if (imgAlpha > 0) {
      ctx.save()
      ctx.globalAlpha = imgAlpha * alpha * 0.6
      drawRoundedImage(ctx, img, imgX, imgY, imgW, imgH, 16, 'rgba(0,0,0,0.4)', 15)
      ctx.restore()
    }
  }

  if (emoji) {
    ctx.save()
    ctx.globalAlpha = 0.12 * alpha
    drawEmoji(ctx, emoji, width * 0.85 + slideX, height * 0.22, 50)
    ctx.restore()
  }
  ctx.restore()
}

function drawSolutionScene(ctx, width, height, scene, progress, palette, frame, emoji, loadedImages) {
  const alpha = Math.min(1, progress * 1.3)
  const scale = 0.6 + easeOutBack(Math.min(1, progress * 1.1)) * 0.4
  const yOffset = (1 - easeOutCubic(Math.min(1, progress * 1.2))) * 60

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 46px "Helvetica Neue", Arial, sans-serif'
  ctx.shadowColor = palette.glow || palette.accent
  ctx.shadowBlur = 20
  ctx.fillStyle = palette.accent
  ctx.fillText(scene.title, width / 2, height * 0.18 + yOffset)

  ctx.shadowBlur = 0
  const words = scene.text.split(' ')
  const wordsToShow = Math.floor(words.length * Math.min(1, progress * 1.15))
  const visibleText = words.slice(0, wordsToShow).join(' ')
  const lines = wrapText(ctx, visibleText, width * 0.78)
  const lineHeight = 50
  const totalHeight = lines.length * lineHeight
  const startY = height * 0.38 - totalHeight / 2 + yOffset * 0.5

  lines.forEach((line, i) => {
    const lineAlpha = Math.min(1, (progress * lines.length - i) * 1.1)
    ctx.save()
    ctx.globalAlpha = lineAlpha * alpha
    ctx.translate(width / 2, startY + i * lineHeight)
    ctx.fillText(line, 0, 0)
    ctx.restore()
  })

  if (loadedImages.length > 0) {
    const img = loadedImages[0].image
    const imgW = 220; const imgH = 220
    const imgX = (width - imgW) / 2
    const imgY = height * 0.68 + yOffset * 0.3
    const imgAlpha = Math.min(1, (progress - 0.2) * 2.5)
    if (imgAlpha > 0) {
      ctx.save()
      ctx.globalAlpha = imgAlpha * alpha
      ctx.shadowColor = palette.glow || palette.accent
      ctx.shadowBlur = 30
      ctx.shadowOffsetY = 8
      drawRoundedImage(ctx, img, imgX, imgY, imgW, imgH, 22, palette.glow, 25)
      ctx.restore()
    }
  }

  if (emoji && !loadedImages.length) {
    const emojiSize = 45 + Math.sin(frame * 0.025) * 4
    ctx.save()
    ctx.globalAlpha = 0.18 * alpha
    ctx.translate(width * 0.78, height * 0.72 + yOffset * 0.3)
    ctx.scale(scale, scale)
    drawEmoji(ctx, emoji, 0, 0, emojiSize)
    ctx.restore()
  }
  ctx.restore()
}

function drawCTAScene(ctx, width, height, scene, progress, palette, frame, emoji, loadedImages) {
  const pulse = 1 + Math.sin(frame * 0.05) * 0.015
  const alpha = Math.min(1, progress * 2.2)
  const glowPulse = 12 + Math.sin(frame * 0.07) * 8

  ctx.save()
  ctx.globalAlpha = alpha

  ctx.font = 'bold 52px "Helvetica Neue", Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = palette.accent
  ctx.shadowBlur = glowPulse
  ctx.fillStyle = palette.accent
  ctx.save()
  ctx.translate(width / 2, height * 0.28)
  ctx.scale(pulse, pulse)
  ctx.fillText(scene.title, 0, 0)
  ctx.restore()

  ctx.shadowBlur = 0
  ctx.font = '36px "Helvetica Neue", Arial, sans-serif'
  ctx.fillStyle = palette.text
  const lines = wrapText(ctx, scene.subtitle, width * 0.78)
  const lineHeight = 46
  const startY = height * 0.44
  lines.forEach((line, i) => {
    const reduce = Math.max(0, 1 - i * 0.1)
    ctx.save()
    ctx.globalAlpha = alpha * reduce
    ctx.fillText(line, width / 2, startY + i * lineHeight)
    ctx.restore()
  })

  const barColor = palette.accent
  ctx.shadowColor = barColor
  ctx.shadowBlur = 8
  ctx.strokeStyle = barColor
  ctx.lineWidth = 2.5
  const barY = height * 0.35
  const barWidth = 80 + Math.sin(frame * 0.035) * 15
  ctx.beginPath(); ctx.moveTo(width / 2 - barWidth, barY); ctx.lineTo(width / 2 + barWidth, barY); ctx.stroke()
  const barY2 = height * 0.55
  ctx.beginPath(); ctx.moveTo(width / 2 - barWidth * 0.6, barY2); ctx.lineTo(width / 2 + barWidth * 0.6, barY2); ctx.stroke()
  ctx.shadowBlur = 0

  if (emoji) {
    const bounce = Math.abs(Math.sin(frame * 0.04)) * 8
    ctx.save()
    ctx.globalAlpha = 0.2 * alpha
    drawEmoji(ctx, emoji, width / 2, height * 0.66 - bounce, 60)
    ctx.restore()
  }

  if (loadedImages.length > 1) {
    const img = loadedImages[1].image
    const imgSize = 100
    const imgX = (width - imgSize) / 2
    const imgY = height * 0.68
    const imgAlpha = Math.min(1, progress * 2)
    ctx.save()
    ctx.globalAlpha = imgAlpha * alpha
    drawRoundedImage(ctx, img, imgX, imgY, imgSize, imgSize, 14, 'rgba(0,0,0,0.3)', 12)
    ctx.restore()
  }
  ctx.restore()
}

function drawOutroScene(ctx, width, height, scene, progress, palette, frame, emoji, loadedImages) {
  const ease = easeOutCubic(Math.min(1, progress * 1.1))
  const alpha = 1 - ease * 0.3
  const scale = 1 - (1 - ease) * 0.2

  ctx.save()
  ctx.translate(width / 2, height * 0.42)
  ctx.scale(scale, scale)
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 52px "Helvetica Neue", Arial, sans-serif'
  ctx.shadowColor = palette.accent
  ctx.shadowBlur = 18
  ctx.fillStyle = palette.accent
  ctx.fillText(scene.title, 0, 0)

  ctx.shadowBlur = 0
  ctx.font = '34px "Helvetica Neue", Arial, sans-serif'
  ctx.fillStyle = palette.text
  ctx.fillText(scene.subtitle, 0, 76)

  if (emoji) {
    ctx.save()
    ctx.globalAlpha = 0.25 * alpha
    drawEmoji(ctx, emoji, 0, -110, 55)
    ctx.restore()
  }
  ctx.restore()

  const fadeOut = Math.max(0, 1 - (1 - progress) * 4)
  if (fadeOut > 0) {
    ctx.save()
    ctx.globalAlpha = 1 - fadeOut
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3; let x = cx; let y = cy
  const step = Math.PI / spikes
  ctx.beginPath(); ctx.moveTo(cx, cy - outerRadius)
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius; y = cy + Math.sin(rot) * outerRadius; ctx.lineTo(x, y); rot += step
    x = cx + Math.cos(rot) * innerRadius; y = cy + Math.sin(rot) * innerRadius; ctx.lineTo(x, y); rot += step
  }
  ctx.lineTo(cx, cy - outerRadius); ctx.closePath()
}

function drawCaptionBar(ctx, width, height, scene, progress, palette) {
  const captionY = height - 170
  const captionHeight = 90

  ctx.fillStyle = 'rgba(0,0,0,0.65)'
  ctx.beginPath()
  ctx.roundRect(40, captionY, width - 80, captionHeight, 16)
  ctx.fill()

  const words = scene.text.split(' ')
  const wordsToShow = Math.floor(words.length * Math.min(1, progress * 1.1))
  const captionText = words.slice(0, wordsToShow).join(' ')

  ctx.font = '28px "Helvetica Neue", Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowColor = 'rgba(0,0,0,0.4)'
  ctx.shadowBlur = 3

  const captionLines = wrapText(ctx, captionText, width - 120)
  const captionLineHeight = 36
  const captionStartY = captionY + 30
  captionLines.slice(0, 2).forEach((line, i) => {
    ctx.fillText(line, width / 2, captionStartY + i * captionLineHeight)
  })
  ctx.shadowBlur = 0
}

function drawProgressBar(ctx, width, height, progress, palette) {
  const barWidth = width - 80; const barHeight = 3
  const x = 40; const y = height - 45
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.beginPath(); ctx.roundRect(x, y, barWidth, barHeight, 2); ctx.fill()
  const gradient = ctx.createLinearGradient(x, y, x + barWidth * progress, y)
  gradient.addColorStop(0, palette.accent)
  gradient.addColorStop(0.5, palette.glow || palette.accent)
  gradient.addColorStop(1, palette.bg1)
  ctx.fillStyle = gradient
  ctx.beginPath(); ctx.roundRect(x, y, barWidth * progress, barHeight, 2); ctx.fill()
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  let line = ''; const lines = []
  for (const word of words) {
    const testLine = line + word + ' '
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line.trim()); line = word + ' '
    } else { line = testLine }
  }
  lines.push(line.trim())
  return lines
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }
function easeOutBack(t) { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2) }

export function createVideoUrl(blob) {
  return URL.createObjectURL(blob)
}

export function downloadVideo(blob, filename = 'advertisement') {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${filename}.webm`
  document.body.appendChild(a); a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
