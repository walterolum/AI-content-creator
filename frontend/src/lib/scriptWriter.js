import { streamAI } from './api'

export const SCENE_TYPES = ['opening', 'problem', 'solution', 'feature', 'testimonial', 'cta', 'closing']

export const TRANSITIONS = ['fade', 'dissolve', 'wipe', 'slide', 'zoom', 'blur']

export const CAMERA_ANGLES = ['eye-level', 'low-angle', 'high-angle', 'close-up', 'wide', 'dolly', 'tracking']

export const LIGHTING_STYLES = ['warm', 'cool', 'dramatic', 'soft', 'natural', 'neon', 'golden-hour', 'studio']

export function generateVoiceoverScript(script) {
  if (!script || !script.scenes) return ''
  return script.scenes
    .filter(s => s.type !== 'closing')
    .map(s => s.narration)
    .join(' ')
}

export function extractVoiceoverText(script) {
  return generateVoiceoverScript(script)
}

export function getTotalDuration(script) {
  if (!script || !script.scenes) return 30
  return script.scenes.reduce((sum, s) => sum + (s.duration || 0), 0)
}

export function getSceneByTime(script, timeMs) {
  if (!script || !script.scenes) return null
  let elapsed = 0
  for (const scene of script.scenes) {
    const durMs = (scene.duration || 5) * 1000
    if (timeMs >= elapsed && timeMs < elapsed + durMs) {
      return { scene, progress: (timeMs - elapsed) / durMs, sceneIndex: script.scenes.indexOf(scene) }
    }
    elapsed += durMs
  }
  const last = script.scenes[script.scenes.length - 1]
  return { scene: last, progress: 1, sceneIndex: script.scenes.length - 1 }
}

export function getSceneTimings(script) {
  if (!script || !script.scenes) return []
  let elapsed = 0
  return script.scenes.map(s => {
    const startMs = elapsed
    const durMs = (s.duration || 5) * 1000
    elapsed += durMs
    return { ...s, startTime: startMs, durationMs: durMs }
  })
}

export function getMusicSyncPoints(script) {
  if (!script || !script.scenes) return []
  let elapsed = 0
  return script.scenes.map(s => {
    const beat = elapsed / 1000
    elapsed += (s.duration || 5) * 1000
    return {
      sceneId: s.id,
      timeSeconds: beat,
      durationSeconds: s.duration || 5,
      transition: s.transition || 'fade',
      mood: s.mood || 'neutral',
    }
  })
}

export async function generateScript(params, onChunk) {
  await streamAI('/ai/script', params, onChunk)
}

export function createEmptyScript(params = {}) {
  return {
    title: params.topic || 'New Advertisement',
    videoType: 'commercial',
    platform: params.platform || 'instagram',
    totalDuration: 30,
    scenes: [
      {
        id: 'scene-1',
        type: 'opening',
        title: 'YOUR BRAND',
        narration: 'Discover something amazing today.',
        onScreenText: 'YOUR BRAND',
        duration: 5,
        transition: 'fade',
        transitionDuration: 0.5,
        cameraAngle: 'eye-level',
        lighting: 'warm',
        bRoll: ['product showcase', 'elegant backdrop'],
        soundEffects: ['whoosh'],
        mood: 'confident',
        animation: 'text-slide-up',
        lowerThird: null,
      },
      {
        id: 'scene-2',
        type: 'problem',
        title: 'THE CHALLENGE',
        narration: 'Tired of solutions that do not deliver?',
        onScreenText: 'THE CHALLENGE',
        duration: 6,
        transition: 'slide',
        transitionDuration: 0.4,
        cameraAngle: 'close-up',
        lighting: 'dramatic',
        bRoll: ['frustrated expression', 'clock ticking'],
        soundEffects: ['subtle transition'],
        mood: 'urgent',
        animation: 'text-fade-in',
        lowerThird: null,
      },
      {
        id: 'scene-3',
        type: 'solution',
        title: 'THE ANSWER',
        narration: 'We built exactly what you need.',
        onScreenText: 'THE ANSWER',
        duration: 7,
        transition: 'dissolve',
        transitionDuration: 0.5,
        cameraAngle: 'eye-level',
        lighting: 'soft',
        bRoll: ['product in use', 'smiling customer'],
        soundEffects: ['subtle transition'],
        mood: 'assured',
        animation: 'text-fade-in',
        lowerThird: null,
      },
      {
        id: 'scene-4',
        type: 'cta',
        title: 'ACT NOW',
        narration: 'Do not wait. Start your journey today.',
        onScreenText: 'ACT NOW',
        duration: 5,
        transition: 'zoom',
        transitionDuration: 0.4,
        cameraAngle: 'close-up',
        lighting: 'warm',
        bRoll: ['phone screen with action', 'hand reaching out'],
        soundEffects: ['subtle transition'],
        mood: 'compelling',
        animation: 'text-pulse',
        lowerThird: null,
      },
      {
        id: 'scene-5',
        type: 'closing',
        title: params.topic || 'YOUR BRAND',
        narration: '',
        onScreenText: params.topic || 'YOUR BRAND',
        duration: 2,
        transition: 'fade',
        transitionDuration: 0.5,
        cameraAngle: 'eye-level',
        lighting: 'soft',
        bRoll: ['logo animation', 'fade to black'],
        soundEffects: ['logo sting'],
        mood: 'memorable',
        animation: 'text-fade-in',
        lowerThird: null,
      },
    ],
    musicGenre: 'cinematic',
    musicMood: 'uplifting',
    brandName: params.topic || 'Brand',
    keywords: [],
  }
}
