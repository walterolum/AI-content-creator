import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudioProvider, useStudio, useStudioActions, formatTime } from '../lib/studioStore'
import { useKeyboardShortcuts, ShortcutsModal } from '../lib/keyboardShortcuts'
import TimelineEditor from '../components/studio/TimelineEditor'
import SceneEditor from '../components/studio/SceneEditor'
import MediaLibrary from '../components/studio/MediaLibrary'
import {
  generateAdVideo, createVideoUrl, getScenesForContent, downloadBlob,
  EXPORT_PRESETS,
} from '../lib/video'
import { speak, stopSpeech, voiceProfiles, musicGenres } from '../lib/audio'
import { getSceneTimings, getMusicSyncPoints } from '../lib/scriptWriter'
import VideoPlayer from '../components/generator/VideoPlayer'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useToast } from '../contexts/ToastContext'
import {
  ArrowLeft, Play, Pause, Square, Download, Settings,
  Layout, Film, Image, Music, Sparkles, ChevronDown,
  Monitor, Smartphone, Maximize, Minimize, Scissors,
  Undo2, Redo2, Keyboard, Save, Clock,
} from 'lucide-react'

function StudioContent() {
  const navigate = useNavigate()
  const { state, dispatch } = useStudio()
  const actions = useStudioActions()
  const { addToast } = useToast()
  const [activePanel, setActivePanel] = useState('timeline')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [videoUrl, setVideoUrl] = useState(null)
  const [videoBlob, setVideoBlob] = useState(null)
  const [isRendering, setIsRendering] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [exportFormat, setExportFormat] = useState(EXPORT_PRESETS[0])
  const [showVoicePanel, setShowVoicePanel] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState('radio-presenter')
  const [musicGenre, setMusicGenre] = useState('cinematic')
  const [withMusic, setWithMusic] = useState(true)
  const videoContainerRef = useRef(null)

  const handlers = useCallback({
    togglePlay: () => actions.setPlaying(!state.isPlaying),
    undo: () => { if (state.undoStack.length > 0) { dispatch({ type: 'UNDO' }); addToast('Undo', 'info') }},
    redo: () => { if (state.redoStack.length > 0) { dispatch({ type: 'REDO' }); addToast('Redo', 'info') }},
    deleteSelected: () => {
      if (state.selectedClipId) actions.removeClip(state.selectedClipId)
      if (state.selectedSceneId) actions.removeScene(state.selectedSceneId)
    },
    selectAll: () => {},
    deselect: () => { actions.selectScene(null); actions.selectClip(null) },
    goToStart: () => actions.setCurrentTime(0),
    goToEnd: () => actions.setCurrentTime(state.project.duration),
    stepBackward: () => actions.setCurrentTime(Math.max(0, state.currentTime - 0.5)),
    stepForward: () => actions.setCurrentTime(Math.min(state.project.duration, state.currentTime + 0.5)),
    zoomIn: () => actions.setZoom(state.zoom * 1.3),
    zoomOut: () => actions.setZoom(state.zoom / 1.3),
    zoomReset: () => actions.setZoom(1),
    save: () => { addToast('Project saved to localStorage', 'success') },
    render: () => handleRender(),
  }, [actions, state, dispatch, addToast])

  useKeyboardShortcuts(handlers)

  const handleRender = async () => {
    if (state.scenes.length === 0) {
      addToast('Add at least one scene first', 'error')
      return
    }
    setIsRendering(true)
    actions.setRendering(true)
    try {
      const textContent = state.scenes.map(s => s.narration || '').join('. ')
      const blob = await generateAdVideo(textContent, 'instagram', {
        width: exportFormat.width || state.project.width,
        height: exportFormat.height || state.project.height,
        fps: state.project.fps,
        scenes: state.scenes.map((s, i) => ({
          id: s.id, type: s.type, title: s.onScreenText || s.title,
          narration: s.narration || s.text, duration: s.duration || 5,
          onScreenText: s.onScreenText,
        })),
      })
      setVideoBlob(blob)
      const url = createVideoUrl(blob)
      if (videoUrl) URL.revokeObjectURL(videoUrl)
      setVideoUrl(url)
      addToast('Video generated successfully!', 'success')
    } catch (err) {
      addToast('Render failed: ' + err.message, 'error')
    }
    setIsRendering(false)
    actions.setRendering(false)
  }

  const handleExport = () => {
    if (videoBlob) {
      downloadBlob(videoBlob, state.project.name || 'video')
      addToast('Download started', 'success')
    }
  }

  const handleVoicePreview = () => {
    const text = state.scenes.map(s => s.narration || '').join('. ') || state.scenes[0]?.narration
    if (!text) { addToast('No narration text', 'error'); return }
    const syncPoints = getMusicSyncPoints({ scenes: state.scenes, totalDuration: state.project.duration })
    speak(text, selectedVoice, {
      withMusic, musicGenre,
      sceneSyncPoints: syncPoints,
    })
  }

  const panels = [
    { id: 'timeline', label: 'Timeline', icon: Layout },
    { id: 'scene', label: 'Scene', icon: Film },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'voice', label: 'Voice', icon: Music },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/generator')} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <input
                  value={state.project.name}
                  onChange={(e) => actions.setProject({ name: e.target.value })}
                  className="text-sm font-bold text-white bg-transparent border-none outline-none w-48 focus:bg-white/5 focus:px-2 rounded transition-all"
                  placeholder="Project name..."
                />
                <p className="text-[10px] text-gray-500 leading-none mt-0.5">
                  {state.project.width}x{state.project.height} | {state.project.fps}fps | {state.project.duration}s
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-white/5 rounded-lg p-0.5 mr-2">
              <button onClick={() => actions.setProject({ width: 1080, height: 1920 })} className={`p-1.5 rounded ${state.project.width === 1080 ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:text-white'}`}>
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => actions.setProject({ width: 1920, height: 1080 })} className={`p-1.5 rounded ${state.project.width === 1920 ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:text-white'}`}>
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => actions.setProject({ width: 1080, height: 1080 })} className={`p-1.5 rounded ${state.project.width === 1080 && state.project.height === 1080 ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:text-white'}`}>
                <Maximize className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-0.5 mr-2">
              <button onClick={() => dispatch({ type: 'UNDO' })} disabled={state.undoStack.length === 0} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 text-gray-400 transition-colors" title="Undo (Ctrl+Z)">
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => dispatch({ type: 'REDO' })} disabled={state.redoStack.length === 0} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 text-gray-400 transition-colors" title="Redo (Ctrl+Shift+Z)">
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <button onClick={() => setShowShortcuts(true)} className="p-1.5 rounded hover:bg-white/10 text-gray-400 transition-colors" title="Keyboard Shortcuts">
              <Keyboard className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => addToast('Auto-save enabled', 'info')} className="p-1.5 rounded hover:bg-white/10 text-gray-400 transition-colors" title="Save (Ctrl+S)">
              <Save className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-5 bg-white/10 mx-1" />

            <button onClick={handleVoicePreview} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-xs hover:bg-white/10 transition-colors">
              <Music className="w-3 h-3 mr-1 inline" /> Preview
            </button>
            <button onClick={handleRender} disabled={isRendering}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-semibold hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 transition-all shadow-lg shadow-amber-600/20">
              {isRendering ? 'Rendering...' : 'Render'}
            </button>
            {videoBlob && (
              <button onClick={handleExport} className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-all">
                <Download className="w-3 h-3 mr-1 inline" /> Export
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-52px)]">
        {/* Left Panel */}
        <div className="w-[360px] shrink-0 border-r border-white/10 flex flex-col bg-gray-950/50">
          {/* Panel Tabs */}
          <div className="flex border-b border-white/10">
            {panels.map(p => (
              <button key={p.id} onClick={() => setActivePanel(p.id)}
                className={`flex items-center gap-1.5 flex-1 px-3 py-2.5 text-[10px] font-medium transition-all ${
                  activePanel === p.id ? 'bg-amber-500/10 text-amber-400 border-b-2 border-amber-500' : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}>
                <p.icon className="w-3 h-3" />
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {activePanel === 'timeline' && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Project Overview</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Scenes', value: state.scenes.length },
                    { label: 'Clips', value: state.clips.length },
                    { label: 'Duration', value: `${state.project.duration}s` },
                    { label: 'Tracks', value: state.tracks.length },
                  ].map(stat => (
                    <div key={stat.label} className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-[10px] text-gray-500">{stat.label}</p>
                      <p className="text-sm font-bold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-500">Render progress</span>
                    <span className="text-[10px] text-gray-500">{state.renderProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all" style={{ width: `${state.renderProgress}%` }} />
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Scenes</h3>
                  {state.scenes.length === 0 ? (
                    <p className="text-xs text-gray-500 py-4 text-center">No scenes. Create one below.</p>
                  ) : (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {state.scenes.map((scene, i) => (
                        <div key={scene.id}
                          onClick={() => actions.selectScene(scene.id)}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-xs transition-colors ${
                            state.selectedSceneId === scene.id ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}>
                          <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[9px] font-mono text-gray-500">{i + 1}</span>
                          <span className="capitalize flex-1">{scene.type || 'scene'}</span>
                          <span className="text-[9px] text-gray-600">{scene.duration || 5}s</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => actions.addScene({ type: 'intro', title: 'New Scene', duration: 5, narration: '' })}
                    className="w-full mt-2 px-3 py-1.5 rounded-lg border border-dashed border-white/20 text-gray-500 text-[10px] hover:border-amber-500/40 hover:text-amber-400 transition-all">
                    + Add Scene
                  </button>
                </div>
              </div>
            )}
            {activePanel === 'scene' && <SceneEditor />}
            {activePanel === 'media' && <MediaLibrary />}
            {activePanel === 'voice' && (
              <div className="space-y-3">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Voice Settings</p>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Voice Profile</label>
                  <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs">
                    {voiceProfiles.map(v => (
                      <option key={v.id} value={v.id} className="bg-gray-800">{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Background Music</label>
                  <select value={musicGenre} onChange={(e) => setMusicGenre(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs">
                    {musicGenres.map(g => (
                      <option key={g.id} value={g.id} className="bg-gray-800">{g.name}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={withMusic} onChange={(e) => setWithMusic(e.target.checked)} className="rounded accent-amber-500" />
                  <span className="text-xs text-gray-300">Enable background music</span>
                </label>
                <button onClick={handleVoicePreview}
                  className="w-full px-3 py-2 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-500 transition-colors">
                  <Music className="w-3 h-3 mr-1 inline" /> Preview Voice
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center - Timeline */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Preview */}
          <div className="flex-1 flex items-center justify-center bg-gray-950 relative overflow-hidden" ref={videoContainerRef}>
            {videoUrl ? (
              <div className="w-full max-w-md mx-auto">
                <VideoPlayer src={videoUrl} onStop={() => setVideoUrl(null)} />
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-white/10 flex items-center justify-center mb-4">
                  <Film className="w-8 h-8 text-amber-500/60" />
                </div>
                <p className="text-sm text-gray-500 mb-1">No video rendered yet</p>
                <p className="text-xs text-gray-600 mb-3">Add scenes and click Render</p>
                <button onClick={handleRender} disabled={isRendering || state.scenes.length === 0}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-semibold hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 transition-all">
                  {isRendering ? 'Rendering...' : 'Render Video'}
                </button>
              </div>
            )}
          </div>

          {/* Timeline Bottom */}
          <div className="shrink-0 border-t border-white/10">
            <TimelineEditor />
          </div>
        </div>
      </div>

      {showShortcuts && <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />}
    </div>
  )
}

export default function VideoStudioPage() {
  return (
    <StudioProvider>
      <StudioContent />
    </StudioProvider>
  )
}
