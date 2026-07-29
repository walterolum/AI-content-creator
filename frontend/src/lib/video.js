const THEMES = [
  { name: 'midnight', bg1: '#0f0c29', bg2: '#302b63', bg3: '#24243e', accent: '#a855f7', text: '#ffffff', glow: '#c084fc', caption: '#1e1b4b' },
  { name: 'coral', bg1: '#0d0d0d', bg2: '#1a1a2e', bg3: '#16213e', accent: '#f97316', text: '#ffffff', glow: '#fb923c', caption: '#1c1917' },
  { name: 'emerald', bg1: '#0a0a0a', bg2: '#0f172a', bg3: '#1e293b', accent: '#22c55e', text: '#ffffff', glow: '#4ade80', caption: '#052e16' },
  { name: 'sapphire', bg1: '#000814', bg2: '#001d3d', bg3: '#003566', accent: '#38bdf8', text: '#ffffff', glow: '#7dd3fc', caption: '#0c4a6e' },
  { name: 'rose', bg1: '#1a0a0a', bg2: '#2d1520', bg3: '#3d1a2e', accent: '#e11d48', text: '#ffffff', glow: '#fb7185', caption: '#2d0a1e' },
  { name: 'slate', bg1: '#020617', bg2: '#0f172a', bg3: '#1e293b', accent: '#94a3b8', text: '#ffffff', glow: '#cbd5e1', caption: '#0f172a' },
  { name: 'amber', bg1: '#0a0800', bg2: '#1a1500', bg3: '#2a2000', accent: '#f59e0b', text: '#ffffff', glow: '#fbbf24', caption: '#1c1300' },
  { name: 'teal', bg1: '#000a0a', bg2: '#001414', bg3: '#002222', accent: '#14b8a6', text: '#ffffff', glow: '#5eead4', caption: '#002020' },
  { name: 'violet', bg1: '#0a0015', bg2: '#150028', bg3: '#22003d', accent: '#8b5cf6', text: '#ffffff', glow: '#a78bfa', caption: '#1a0030' },
  { name: 'warm', bg1: '#0d0805', bg2: '#1a1210', bg3: '#2a1a15', accent: '#d97706', text: '#ffffff', glow: '#f59e0b', caption: '#1a0e08' },
  { name: 'ocean', bg1: '#000d1a', bg2: '#001a33', bg3: '#00264d', accent: '#06b6d4', text: '#ffffff', glow: '#67e8f9', caption: '#00334d' },
  { name: 'graphite', bg1: '#050505', bg2: '#0d0d0d', bg3: '#1a1a1a', accent: '#e5e5e5', text: '#ffffff', glow: '#ffffff', caption: '#141414' },
  { name: 'sunset', bg1: '#0d0500', bg2: '#1d0a02', bg3: '#2d1005', accent: '#f43f5e', text: '#ffffff', glow: '#fb7185', caption: '#200500' },
  { name: 'forest', bg1: '#000a00', bg2: '#001a00', bg3: '#003000', accent: '#84cc16', text: '#ffffff', glow: '#a3e635', caption: '#002000' },
  { name: 'platinum', bg1: '#0a0a0a', bg2: '#1a1a1a', bg3: '#2a2a2a', accent: '#d4d4d4', text: '#ffffff', glow: '#e5e5e5', caption: '#1a1a1a' },
]

let lastThemeIndex = -1

function pickTheme() {
  let idx
  do { idx = Math.floor(Math.random() * THEMES.length) } while (idx === lastThemeIndex && THEMES.length > 1)
  lastThemeIndex = idx
  return THEMES[idx]
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
  const stopWords = new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','need','dare','ought','used','to','of','in','for','on','with','at','by','from','as','into','through','during','before','after','above','below','between','and','but','or','nor','not','so','yet','both','either','neither','this','that','these','those','i','me','my','we','our','you','your','it','its','they','them','their','he','him','his','she','her','what','which','who','whom','whose','when','where','why','how'])
  return [...new Set(words.filter(w => w.length > 3 && !stopWords.has(w)))].slice(0, 5)
}

function parseContentToScenes(text) {
  const cleaned = cleanTextForVoice(text)
  const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 8)
  const keywords = extractKeywords(text)
  const productName = keywords[0] || 'Your Brand'
  const scenes = []

  if (sentences.length >= 3) {
    scenes.push({ id: 'intro', type: 'intro', title: productName.toUpperCase(), subtitle: sentences[0].trim() + '.', text: sentences[0].trim() + '.', voiceText: sentences[0].trim() + '.', duration: 7000, startTime: 0, keywords })
    scenes.push({ id: 'problem', type: 'problem', title: 'The Challenge', text: sentences.slice(1, 3).join('. ').trim() + '.', voiceText: sentences.slice(1, 3).join('. ').trim() + '.', duration: 8000, startTime: 7000, keywords })
    scenes.push({ id: 'solution', type: 'solution', title: productName.charAt(0).toUpperCase() + productName.slice(1), text: sentences.slice(2, 4).join('. ').trim() + '.', voiceText: sentences.slice(2, 4).join('. ').trim() + '.', duration: 9000, startTime: 15000, keywords })
    scenes.push({ id: 'cta', type: 'cta', title: 'Act Now', subtitle: sentences[4] ? sentences[4].trim() + '.' : 'Don\'t miss out!', text: sentences[4] ? sentences[4].trim() + '.' : 'Don\'t miss out!', voiceText: sentences[4] ? sentences[4].trim() + '.' : 'Don\'t miss out!', duration: 7000, startTime: 24000, keywords })
    scenes.push({ id: 'outro', type: 'outro', title: productName.toUpperCase(), subtitle: 'Your Success Starts Here', text: 'Your Success Starts Here', voiceText: '', duration: 2000, startTime: 28000, keywords })
  } else {
    scenes.push({ id: 'intro', type: 'intro', title: productName.toUpperCase(), subtitle: cleaned.substring(0, 60) || 'Welcome!', text: cleaned.substring(0, 60) || 'Welcome!', voiceText: cleaned.substring(0, 60) || 'Welcome!', duration: 12000, startTime: 0, keywords })
    scenes.push({ id: 'cta', type: 'cta', title: 'Get Started', subtitle: 'Don\'t miss out!', text: 'Don\'t miss out!', voiceText: 'Don\'t miss out!', duration: 12000, startTime: 12000, keywords })
    scenes.push({ id: 'outro', type: 'outro', title: productName.toUpperCase(), subtitle: 'Your Success Starts Here', text: 'Your Success Starts Here', voiceText: '', duration: 6000, startTime: 24000, keywords })
  }
  return scenes
}

export function getScenesForContent(content) {
  return parseContentToScenes(content)
}

export async function generateAdVideo(content, platform = 'instagram', options = {}) {
  const { duration = 30000, width = 1080, height = 1920, fps = 60, images = [], scenes: providedScenes } = options

  const theme = pickTheme()
  const canvas = document.createElement('canvas')
  canvas.width = width; canvas.height = height
  const ctx = canvas.getContext('2d')

  const scenes = providedScenes && providedScenes.length > 0 ? providedScenes.map(s => normalizeScene(s)) : parseContentToScenes(content)
  const loadedImages = await loadImages(images)

  const motionPhase = Math.random() * Math.PI * 2
  const driftSpeed = 0.001 + Math.random() * 0.002

  const stream = canvas.captureStream(fps)
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 12000000 })
  const chunks = []
  mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }

  return new Promise((resolve) => {
    mediaRecorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }))
    mediaRecorder.start()

    const totalFrames = Math.floor(((providedScenes && providedScenes.length > 0 ? scenes.reduce((sum, s) => sum + s.duration, 0) : duration) / 1000) * fps)
    let frame = 0

    const animate = () => {
      if (frame >= totalFrames) { mediaRecorder.stop(); return }

      const t = frame / fps
      const currentTime = t * 1000
      const progress = frame / totalFrames
      ctx.clearRect(0, 0, width, height)

      const currentScene = scenes.find(s => currentTime >= s.startTime && currentTime < s.startTime + s.duration) || scenes[0]
      const sceneProgress = (currentTime - currentScene.startTime) / currentScene.duration
      const sceneIndex = scenes.indexOf(currentScene)
      const nextScene = scenes[sceneIndex + 1]

      let fade = 1
      if (nextScene && currentTime + 400 >= nextScene.startTime) {
        fade = 1 - (currentTime - (nextScene.startTime - 400)) / 400
      }
      if (sceneProgress < 0.15) {
        fade = Math.min(1, sceneProgress / 0.15)
      }

      drawBackground(ctx, width, height, t, theme, motionPhase, driftSpeed)
      drawSceneContent(ctx, width, height, currentScene, sceneProgress, theme, loadedImages, fade, t)
      drawCaptionBar(ctx, width, height, currentScene, sceneProgress, theme)
      drawProgressBar(ctx, width, height, progress, theme)

      frame++
      requestAnimationFrame(animate)
    }
    animate()
  })
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

function drawBackground(ctx, width, height, t, theme, phase, drift) {
  const cx = width / 2 + Math.sin(t * drift + phase) * 150
  const cy = height * 0.35 + Math.cos(t * drift * 0.7 + phase) * 100
  const grad = ctx.createRadialGradient(cx, cy, 0, width / 2, height / 2, height * 0.85)
  grad.addColorStop(0, theme.bg1)
  grad.addColorStop(0.3, theme.bg2)
  grad.addColorStop(0.7, theme.bg3)
  grad.addColorStop(1, '#000000')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  const lx = width * 0.3 + Math.sin(t * 0.3) * 100
  const ly = height * 0.25 + Math.cos(t * 0.25) * 80
  const lgrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, height * 0.5)
  lgrad.addColorStop(0, `rgba(255,255,255,0.03)`)
  lgrad.addColorStop(0.5, `rgba(255,255,255,0.008)`)
  lgrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = lgrad
  ctx.fillRect(0, 0, width, height)
}

function drawSceneContent(ctx, width, height, scene, progress, theme, loadedImages, fade, t) {
  ctx.save()
  ctx.globalAlpha = fade

  switch (scene.type) {
    case 'intro': drawIntroScene(ctx, width, height, scene, progress, theme, loadedImages, t); break
    case 'problem': drawProblemScene(ctx, width, height, scene, progress, theme, loadedImages, t); break
    case 'solution': drawSolutionScene(ctx, width, height, scene, progress, theme, loadedImages, t); break
    case 'cta': drawCTAScene(ctx, width, height, scene, progress, theme, loadedImages, t); break
    case 'outro': drawOutroScene(ctx, width, height, scene, progress, theme, loadedImages, t); break
  }

  ctx.restore()
}

function drawIntroScene(ctx, width, height, scene, progress, theme, loadedImages, t) {
  const p = easeOutCubic(Math.min(1, progress * 1.6))
  const alpha = Math.min(1, progress * 2)
  const yOff = (1 - p) * 80

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 64px "Helvetica Neue", Arial, sans-serif'
  ctx.shadowColor = theme.accent
  ctx.shadowBlur = 30
  ctx.fillStyle = theme.accent
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2
  ctx.fillText(scene.title, width / 2, height * 0.26 + yOff)

  ctx.shadowColor = 'rgba(0,0,0,0.4)'
  ctx.shadowBlur = 6
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 1
  ctx.font = '44px "Helvetica Neue", Arial, sans-serif'
  ctx.fillStyle = theme.text

  const subtitleLines = wrapText(ctx, scene.subtitle, width * 0.82)
  const lineHeight = 58
  const startY = height * 0.40 - (subtitleLines.length * lineHeight) / 2 + yOff * 0.5
  subtitleLines.forEach((line, i) => {
    const la = Math.min(1, (progress * subtitleLines.length - i) * 1.3)
    ctx.save()
    ctx.globalAlpha = la * alpha
    ctx.fillText(line, width / 2, startY + i * lineHeight)
    ctx.restore()
  })

  if (loadedImages.length > 0) {
    const img = loadedImages[0].image
    const s = 160; const x = (width - s) / 2
    const y = height * 0.62 + yOff * 0.3
    const ia = Math.min(1, progress * 2)
    ctx.save()
    ctx.globalAlpha = ia
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur = 25
    ctx.shadowOffsetY = 6
    ctx.beginPath(); ctx.roundRect(x, y, s, s, 20); ctx.clip()
    ctx.drawImage(img, x, y, s, s)
    ctx.restore()
  }
  ctx.restore()
}

function drawProblemScene(ctx, width, height, scene, progress, theme, loadedImages, t) {
  const alpha = Math.min(1, progress * 1.4)
  const slide = (1 - easeOutCubic(Math.min(1, progress * 1.2))) * 150

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 40px "Helvetica Neue", Arial, sans-serif'
  ctx.shadowColor = 'rgba(0,0,0,0.4)'
  ctx.shadowBlur = 6
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 1
  ctx.fillStyle = theme.accent
  ctx.fillText(scene.title, width / 2 - slide * 0.3, height * 0.18)

  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 4
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 1
  const words = scene.text.split(' ')
  const wc = Math.floor(words.length * Math.min(1, progress * 1.2))
  const vt = words.slice(0, wc).join(' ')
  const lines = wrapText(ctx, vt, width * 0.8)
  const lineHeight = 54
  const startY = height * 0.40 - (lines.length * lineHeight) / 2 - slide * 0.1

  lines.forEach((line, i) => {
    const la = Math.min(1, (progress * lines.length - i) * 1.0)
    ctx.save()
    ctx.globalAlpha = la * alpha
    ctx.fillStyle = theme.text
    ctx.fillText(line, width / 2, startY + i * lineHeight)
    ctx.restore()
  })

  if (loadedImages.length > 0) {
    const img = loadedImages[0].image
    const s = 170; const x = (width - s) / 2; const y = height * 0.66
    const ia = Math.min(1, (progress - 0.15) * 2)
    if (ia > 0) {
      ctx.save()
      ctx.globalAlpha = ia * alpha * 0.5
      ctx.shadowColor = 'rgba(0,0,0,0.4)'
      ctx.shadowBlur = 15
      ctx.shadowOffsetY = 4
      ctx.beginPath(); ctx.roundRect(x, y, s, s, 16); ctx.clip()
      ctx.drawImage(img, x, y, s, s)
      ctx.restore()
    }
  }
  ctx.restore()
}

function drawSolutionScene(ctx, width, height, scene, progress, theme, loadedImages, t) {
  const alpha = Math.min(1, progress * 1.2)
  const yOff = (1 - easeOutCubic(Math.min(1, progress * 1.1))) * 50

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 52px "Helvetica Neue", Arial, sans-serif'
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2
  ctx.fillStyle = theme.accent
  ctx.fillText(scene.title, width / 2, height * 0.18 + yOff)

  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 5
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 1
  const words = scene.text.split(' ')
  const wc = Math.floor(words.length * Math.min(1, progress * 1.1))
  const vt = words.slice(0, wc).join(' ')
  const lines = wrapText(ctx, vt, width * 0.78)
  const lineHeight = 52
  const startY = height * 0.36 - (lines.length * lineHeight) / 2 + yOff * 0.5

  lines.forEach((line, i) => {
    const la = Math.min(1, (progress * lines.length - i) * 1.0)
    ctx.save()
    ctx.globalAlpha = la * alpha
    ctx.fillStyle = theme.text
    ctx.fillText(line, width / 2, startY + i * lineHeight)
    ctx.restore()
  })

  if (loadedImages.length > 0) {
    const img = loadedImages[0].image
    const s = 220; const x = (width - s) / 2
    const y = height * 0.66 + yOff * 0.3
    const ia = Math.min(1, (progress - 0.2) * 2.5)
    if (ia > 0) {
      ctx.save()
      ctx.globalAlpha = ia * alpha
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 30
      ctx.shadowOffsetY = 8
      ctx.beginPath(); ctx.roundRect(x, y, s, s, 22); ctx.clip()
      ctx.drawImage(img, x, y, s, s)
      ctx.restore()
    }
  }
  ctx.restore()
}

function drawCTAScene(ctx, width, height, scene, progress, theme, loadedImages, t) {
  const pulse = 1 + Math.sin(t * 3) * 0.012
  const alpha = Math.min(1, progress * 2)
  const glowP = 10 + Math.sin(t * 4) * 6

  ctx.save()
  ctx.globalAlpha = alpha

  ctx.font = 'bold 56px "Helvetica Neue", Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 12
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2
  ctx.fillStyle = theme.accent
  ctx.save()
  ctx.translate(width / 2, height * 0.28)
  ctx.scale(pulse, pulse)
  ctx.fillText(scene.title, 0, 0)
  ctx.restore()

  ctx.shadowColor = 'rgba(0,0,0,0.3)'
  ctx.shadowBlur = 4
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 1
  ctx.font = '38px "Helvetica Neue", Arial, sans-serif'
  ctx.fillStyle = theme.text
  const lines = wrapText(ctx, scene.subtitle, width * 0.78)
  const lineHeight = 48
  lines.forEach((line, i) => {
    ctx.save()
    ctx.globalAlpha = alpha * Math.max(0, 1 - i * 0.1)
    ctx.fillText(line, width / 2, height * 0.44 + i * lineHeight)
    ctx.restore()
  })

  ctx.strokeStyle = theme.accent
  ctx.lineWidth = 2
  ctx.shadowColor = 'rgba(0,0,0,0.4)'
  ctx.shadowBlur = 6
  const bw = 80 + Math.sin(t * 2) * 10
  ctx.beginPath(); ctx.moveTo(width / 2 - bw, height * 0.36); ctx.lineTo(width / 2 + bw, height * 0.36); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(width / 2 - bw * 0.6, height * 0.56); ctx.lineTo(width / 2 + bw * 0.6, height * 0.56); ctx.stroke()
  ctx.shadowBlur = 0

  if (loadedImages.length > 1) {
    const img = loadedImages[1].image
    const s = 110; const x = (width - s) / 2; const y = height * 0.68
    const ia = Math.min(1, progress * 2)
    ctx.save()
    ctx.globalAlpha = ia * alpha
    ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 15; ctx.shadowOffsetY = 4
    ctx.beginPath(); ctx.roundRect(x, y, s, s, 14); ctx.clip()
    ctx.drawImage(img, x, y, s, s)
    ctx.restore()
  }
  ctx.restore()
}

function drawOutroScene(ctx, width, height, scene, progress, theme, loadedImages, t) {
  const p = easeOutCubic(Math.min(1, progress * 1.1))
  const alpha = 1 - p * 0.3
  const scale = 1 - (1 - p) * 0.15

  ctx.save()
  ctx.translate(width / 2, height * 0.42)
  ctx.scale(scale, scale)
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.font = 'bold 56px "Helvetica Neue", Arial, sans-serif'
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2
  ctx.fillStyle = theme.accent
  ctx.fillText(scene.title, 0, 0)

  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 5
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 1
  ctx.font = '36px "Helvetica Neue", Arial, sans-serif'
  ctx.fillStyle = theme.text
  ctx.fillText(scene.subtitle, 0, 78)
  ctx.restore()

  const fade = Math.max(0, 1 - (1 - progress) * 4)
  if (fade > 0) {
    ctx.save()
    ctx.globalAlpha = 1 - fade
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }
}

function drawCaptionBar(ctx, width, height, scene, progress, theme) {
  const y = height - 180
  const h = 90

  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.beginPath()
  ctx.roundRect(30, y, width - 60, h, 16)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.roundRect(30, y, width - 60, h, 16); ctx.stroke()

  const words = scene.text.split(' ')
  const wc = Math.floor(words.length * Math.min(1, progress * 1.08))
  const ct = words.slice(0, wc).join(' ')

  ctx.font = '30px "Helvetica Neue", Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(0,0,0,0.4)'
  ctx.shadowBlur = 3
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 1

  const lines = wrapText(ctx, ct, width - 110)
  lines.slice(0, 2).forEach((line, i) => {
    ctx.fillText(line, width / 2, y + 36 + i * 38)
  })
  ctx.shadowBlur = 0
}

function drawProgressBar(ctx, width, height, progress, theme) {
  const bw = width - 70; const bh = 3
  const x = 35; const y = height - 42

  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 2); ctx.fill()

  const grad = ctx.createLinearGradient(x, y, x + bw * progress, y)
  grad.addColorStop(0, theme.accent)
  grad.addColorStop(1, theme.glow)
  ctx.fillStyle = grad
  ctx.beginPath(); ctx.roundRect(x, y, bw * progress, bh, 2); ctx.fill()
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  let line = ''; const lines = []
  for (const word of words) {
    const tl = line + word + ' '
    if (ctx.measureText(tl).width > maxWidth && line) {
      lines.push(line.trim()); line = word + ' '
    } else { line = tl }
  }
  lines.push(line.trim())
  return lines
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }

function normalizeScene(s, index, allScenes) {
  const prevEnd = index > 0 ? allScenes.slice(0, index).reduce((sum, sc) => sum + (sc.duration || 5), 0) : 0
  return {
    id: s.id || `scene-${index + 1}`,
    type: s.type === 'opening' ? 'intro' : s.type === 'closing' ? 'outro' : s.type === 'cta' ? 'cta' : s.type === 'problem' ? 'problem' : s.type === 'solution' ? 'solution' : s.type === 'feature' ? 'solution' : s.type === 'testimonial' ? 'solution' : 'intro',
    title: s.onScreenText || s.title || '',
    subtitle: s.narration || s.subtitle || '',
    text: s.narration || s.text || '',
    voiceText: s.narration || '',
    duration: (s.duration || 5) * 1000,
    startTime: prevEnd * 1000,
    keywords: [],
    original: s,
  }
}

export function createVideoUrl(blob) {
  return URL.createObjectURL(blob)
}

export function downloadBlob(blob, filename = 'advertisement') {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${filename}.webm`
  document.body.appendChild(a); a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
