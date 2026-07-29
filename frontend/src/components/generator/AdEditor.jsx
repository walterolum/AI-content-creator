import { useState, useRef, useEffect, useCallback } from 'react'
import Button from '../ui/Button'
import { useToast } from '../../contexts/ToastContext'
import {
  speak, stopSpeech, pauseSpeech, resumeSpeech,
  isSpeaking, isPaused, voiceProfiles, musicGenres
} from '../../lib/audio'
import {
  generateAdVideo, createVideoUrl, getScenesForContent
} from '../../lib/video'
import VideoPlayer from './VideoPlayer'
import {
  Play, Pause, Square, Music, Volume2,
  Film, RefreshCw, Sparkles, Smile,
  Edit3, Layers, Radio, Shuffle
} from 'lucide-react'

const voiceStyleGroups = [
  { label: '🎙️ Radio & Presenter', ids: ['radio-presenter', 'news-anchor', 'friendly-host', 'storyteller'] },
  { label: '📢 Advertiser & Promo', ids: ['advertiser-male', 'advertiser-female', 'energetic-promo'] },
  { label: '🏢 Corporate & Professional', ids: ['corporate-narrator', 'professional-male', 'professional-female'] },
  { label: '🎬 Cinematic & Luxury', ids: ['luxury-brand', 'documentary-narrator'] },
  { label: '🌍 African Voices', ids: ['nigerian-male', 'nigerian-female', 'kenyan-male', 'kenyan-female', 'south-african-male', 'south-african-female'] },
]

export default function AdEditor({ content: initialContent, platform, images, onClose }) {
  const [content, setContent] = useState(initialContent)
  const [selectedVoice, setSelectedVoice] = useState('radio-presenter')
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [withMusic, setWithMusic] = useState(true)
  const [musicGenre, setMusicGenre] = useState('cinematic')
  const [voiceVolume, setVoiceVolume] = useState(1)
  const [musicVolume, setMusicVolume] = useState(0.3)
  const [useReverb, setUseReverb] = useState(false)
  const [useEcho, setUseEcho] = useState(false)
  const [showEmojis, setShowEmojis] = useState(true)
  const [showAudioAdvanced, setShowAudioAdvanced] = useState(false)
  const [activeSection, setActiveSection] = useState('content')
  const [currentCaption, setCurrentCaption] = useState('')
  const [videoUrl, setVideoUrl] = useState(null)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [adPlaying, setAdPlaying] = useState(false)
  const [generationKey, setGenerationKey] = useState(0)

  const sceneTimerRef = useRef(null)
  const { addToast } = useToast()

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeaking(isSpeaking())
      setPaused(isPaused())
    }, 100)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    return () => { if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current) }
  }, [])

  const handlePlayAd = useCallback(() => {
    if (speaking) {
      if (paused) resumeSpeech()
      else pauseSpeech()
      return
    }
    const scenes = getScenesForContent(content)
    let idx = 0
    setCurrentCaption(scenes[0]?.text || '')
    const updateCaption = () => {
      idx++
      if (idx < scenes.length) {
        setCurrentCaption(scenes[idx].text)
        sceneTimerRef.current = setTimeout(updateCaption, scenes[idx].duration)
      }
    }
    sceneTimerRef.current = setTimeout(updateCaption, scenes[0]?.duration || 7000)
    speak(content, selectedVoice, {
      withMusic, musicGenre,
      onEnd: () => { setSpeaking(false); setAdPlaying(false); setCurrentCaption(''); clearTimeout(sceneTimerRef.current) },
      voiceVolume, musicVolume, useReverb, useEcho,
    })
    setSpeaking(true); setAdPlaying(true)
  }, [content, selectedVoice, withMusic, musicGenre, voiceVolume, musicVolume, useReverb, useEcho, speaking, paused, addToast])

  const handleStopAd = () => {
    stopSpeech()
    setSpeaking(false); setPaused(false); setAdPlaying(false)
    setCurrentCaption(''); clearTimeout(sceneTimerRef.current)
  }

  const renderVideo = async () => {
    if (!content) { addToast('No content to render', 'error'); return }
    setIsGeneratingVideo(true)
    setVideoProgress(0)
    const pi = setInterval(() => { setVideoProgress(prev => Math.min(prev + 4, 90)) }, 400)
    try {
      const files = images ? images.map(f => f.file) : []
      const blob = await generateAdVideo(content, platform || 'instagram', { images: files })
      const url = createVideoUrl(blob)
      if (videoUrl) URL.revokeObjectURL(videoUrl)
      setVideoUrl(url)
      setShowVideo(true)
      setVideoProgress(100)
      addToast('Video ready! Each render has a unique look.', 'success')
    } catch (error) {
      addToast('Failed: ' + error.message, 'error')
    } finally {
      setIsGeneratingVideo(false)
      clearInterval(pi)
    }
  }

  const handlePlayVideoWithVoice = () => {
    if (adPlaying) return
    setAdPlaying(true)
    setTimeout(() => {
      const scenes = getScenesForContent(content)
      let idx = 0
      setCurrentCaption(scenes[0]?.text || '')
      const updateCaption = () => {
        idx++
        if (idx < scenes.length) {
          setCurrentCaption(scenes[idx].text)
          sceneTimerRef.current = setTimeout(updateCaption, scenes[idx].duration)
        }
      }
      sceneTimerRef.current = setTimeout(updateCaption, scenes[0]?.duration || 7000)
      speak(content, selectedVoice, {
        withMusic, musicGenre,
        onEnd: () => { setSpeaking(false); setCurrentCaption(''); clearTimeout(sceneTimerRef.current); setAdPlaying(false) },
        voiceVolume, musicVolume, useReverb, useEcho,
      })
      setSpeaking(true)
    }, 300)
  }

  const handleStopVideo = () => {
    handleStopAd()
  }

  const handleNewVideo = () => {
    setShowVideo(false)
    if (videoUrl) { URL.revokeObjectURL(videoUrl); setVideoUrl(null) }
    setGenerationKey(k => k + 1)
    renderVideo()
  }

  const sectionTabs = [
    { id: 'content', label: 'Edit', icon: Edit3 },
    { id: 'voice', label: 'Voice', icon: Radio },
    { id: 'video', label: 'Video', icon: Film },
  ]

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">AD EDITOR</h2>
            <p className="text-xs text-gray-500">Customize your professional advertisement</p>
          </div>
        </div>
        <Button size="sm" onClick={onClose} variant="ghost" className="text-white border border-white/20">Close</Button>
      </div>

      <div className="flex gap-1 px-4 py-3 bg-white/5 border-b border-white/5">
        {sectionTabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeSection === tab.id ? 'bg-white/10 text-amber-400 shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeSection === 'content' && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Advertisement Script</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 rounded-xl bg-white/5 border border-white/10 text-white text-sm p-4 resize-none focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20"
              placeholder="Your ad content..." />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{content.split(' ').length} words | 4 statements max</p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setShowEmojis(!showEmojis)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${showEmojis ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-400'}`}>
                  <Smile className="w-3 h-3" /> Emojis
                </button>
              </div>
            </div>

            {currentCaption && (
              <div className="p-3 bg-black/60 rounded-xl border border-white/10">
                <p className="text-center text-white text-sm font-medium leading-relaxed">{currentCaption}</p>
              </div>
            )}

            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
              <button onClick={handlePlayAd}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-shadow">
                {speaking ? (paused ? <Play className="w-5 h-5 text-white ml-0.5" /> : <Pause className="w-5 h-5 text-white" />) : <Play className="w-5 h-5 text-white ml-0.5" />}
              </button>
              <button onClick={handleStopAd} className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600">
                <Square className="w-3.5 h-3.5 text-white" />
              </button>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{speaking ? 'PLAYING...' : 'VOICE PREVIEW'}</p>
                <p className="text-xs text-amber-400">{voiceProfiles.find(v => v.id === selectedVoice)?.name}</p>
              </div>
              <Volume2 className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        )}

        {activeSection === 'voice' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Voice Talent</p>
            </div>

            <div className="space-y-3">
              {voiceStyleGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{group.label}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {group.ids.map(id => {
                      const v = voiceProfiles.find(p => p.id === id)
                      if (!v) return null
                      return (
                        <button key={v.id} type="button" onClick={() => setSelectedVoice(v.id)}
                          className={`p-2.5 rounded-lg text-left transition-all border ${selectedVoice === v.id ? 'bg-amber-500/15 border-amber-500/40 shadow-sm shadow-amber-500/10' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                          <p className="text-xs font-medium text-white">{v.name}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{v.description}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10">
              <button onClick={() => setShowAudioAdvanced(!showAudioAdvanced)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white">
                <Layers className="w-3 h-3" />
                {showAudioAdvanced ? 'Hide' : 'Show'} advanced audio settings
              </button>

              {showAudioAdvanced && (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg">
                    <button type="button" onClick={() => setWithMusic(!withMusic)}
                      className={`w-10 h-5 rounded-full transition-colors ${withMusic ? 'bg-amber-500' : 'bg-gray-600'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${withMusic ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                    <span className="text-xs text-gray-300">Background Music</span>
                    <Music className={`w-3.5 h-3.5 ml-auto ${withMusic ? 'text-amber-500' : 'text-gray-600'}`} />
                  </div>

                  {withMusic && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Music Genre</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {musicGenres.filter(g => g.id !== 'none').map(g => (
                          <button key={g.id} type="button" onClick={() => setMusicGenre(g.id)}
                            className={`p-2 rounded-lg text-xs transition-all border ${musicGenre === g.id ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'}`}>
                            {g.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-400 mb-1">Voice Volume</p>
                    <input type="range" min="0" max="1" step="0.05" value={voiceVolume}
                      onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                      className="w-full accent-amber-500" />
                    <div className="flex justify-between text-[10px] text-gray-500"><span>0%</span><span>{Math.round(voiceVolume * 100)}%</span><span>100%</span></div>
                  </div>

                  {withMusic && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Music Volume</p>
                      <input type="range" min="0" max="0.8" step="0.05" value={musicVolume}
                        onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                        className="w-full accent-amber-500" />
                      <div className="flex justify-between text-[10px] text-gray-500"><span>0%</span><span>{Math.round(musicVolume / 0.8 * 100)}%</span><span>100%</span></div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={useReverb} onChange={(e) => setUseReverb(e.target.checked)} className="rounded accent-amber-500" />
                      <span className="text-xs text-gray-300">Reverb</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={useEcho} onChange={(e) => setUseEcho(e.target.checked)} className="rounded accent-amber-500" />
                      <span className="text-xs text-gray-300">Echo</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'video' && (
          <div>
            {!showVideo ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Film className="w-4 h-4 text-purple-500" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Video Ad (30s)</p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-3 bg-white/5 rounded-xl text-center">
                    <p className="text-[10px] text-purple-300">Duration</p>
                    <p className="text-sm font-bold text-white">30s</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl text-center">
                    <p className="text-[10px] text-purple-300">Quality</p>
                    <p className="text-sm font-bold text-white">HD</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl text-center">
                    <p className="text-[10px] text-purple-300">Theme</p>
                    <p className="text-sm font-bold text-amber-400">Random</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Each generation picks from 15 unique color themes with random motion. Click <strong className="text-amber-400">Generate</strong> now, or <strong className="text-amber-400">Generate New</strong> later for a different look.
                </p>

                {isGeneratingVideo && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-purple-300 mb-1">
                      <span>Rendering...</span>
                      <span>{videoProgress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all" style={{ width: `${videoProgress}%` }} />
                    </div>
                  </div>
                )}

                <Button onClick={renderVideo} disabled={isGeneratingVideo}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  {isGeneratingVideo ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : <><Film className="w-4 h-4 mr-2" /> Generate Video</>}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-0">
                  <div onPlay={handlePlayVideoWithVoice} className="w-full">
                    <VideoPlayer
                      key={generationKey}
                      src={videoUrl}
                      onStop={handleStopVideo}
                      onNew={handleNewVideo}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-64 shrink-0 space-y-3">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-purple-500" />
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Video Ad (30s)</p>
                  </div>

                  {currentCaption && (
                    <div className="bg-black/60 backdrop-blur rounded-lg p-3 border border-white/10">
                      <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Current Caption</p>
                      <p className="text-white text-sm font-medium leading-relaxed">{currentCaption}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={handleNewVideo} className="bg-gradient-to-r from-amber-600 to-orange-600" size="sm">
                      <Shuffle className="w-4 h-4 mr-1.5" /> New
                    </Button>
                    <Button onClick={handleStopVideo} variant="ghost" size="sm" className="text-white border border-white/20">
                      <Square className="w-4 h-4 mr-1.5" /> Stop
                    </Button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 space-y-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Info</p>
                    <div className="flex justify-between text-xs"><span className="text-gray-400">Duration</span><span className="text-white font-medium">30s</span></div>
                    <div className="flex justify-between text-xs"><span className="text-gray-400">FPS</span><span className="text-white font-medium">60</span></div>
                    <div className="flex justify-between text-xs"><span className="text-gray-400">Quality</span><span className="text-white font-medium">HD</span></div>
                    <div className="flex justify-between text-xs"><span className="text-gray-400">Theme</span><span className="text-amber-400 font-medium">Random</span></div>
                    <div className="flex justify-between text-xs"><span className="text-gray-400">Bitrate</span><span className="text-white font-medium">12 Mbps</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
