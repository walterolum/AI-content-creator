import { useState, useRef, useEffect, useCallback } from 'react'
import Button from '../ui/Button'
import Select from '../ui/Select'
import { useToast } from '../../contexts/ToastContext'
import {
  speak, stopSpeech, pauseSpeech, resumeSpeech,
  isSpeaking, isPaused, voiceProfiles, musicGenres
} from '../../lib/audio'
import {
  generateAdVideo, createVideoUrl, getScenesForContent
} from '../../lib/video'
import {
  Mic, Play, Pause, Square, Music, Volume2,
  Film, Download, RefreshCw, Sparkles, Smile,
  Edit3, Layers, Radio
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

  const videoRef = useRef(null)
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
    return () => {
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current)
    }
  }, [])

  const handlePlayAd = useCallback(() => {
    if (speaking) {
      if (paused) resumeSpeech()
      else pauseSpeech()
      return
    }
    const scenes = getScenesForContent(content)
    let sceneIndex = 0
    setCurrentCaption(scenes[0]?.text || '')
    const updateCaption = () => {
      sceneIndex++
      if (sceneIndex < scenes.length) {
        setCurrentCaption(scenes[sceneIndex].text)
        sceneTimerRef.current = setTimeout(updateCaption, scenes[sceneIndex].duration)
      }
    }
    sceneTimerRef.current = setTimeout(updateCaption, scenes[0]?.duration || 7000)
    speak(content, selectedVoice, {
      withMusic, musicGenre,
      onEnd: () => { setSpeaking(false); setAdPlaying(false); setCurrentCaption(''); clearTimeout(sceneTimerRef.current) },
      voiceVolume, musicVolume, useReverb, useEcho,
    })
    setSpeaking(true)
    setAdPlaying(true)
    addToast('Playing advertisement...', 'info')
  }, [content, selectedVoice, withMusic, musicGenre, voiceVolume, musicVolume, useReverb, useEcho, speaking, paused, addToast])

  const handleStopAd = () => {
    stopSpeech()
    setSpeaking(false); setPaused(false); setAdPlaying(false)
    setCurrentCaption('')
    clearTimeout(sceneTimerRef.current)
  }

  const handleGenerateVideo = async () => {
    if (!content) { addToast('No content to render', 'error'); return }
    setIsGeneratingVideo(true)
    setVideoProgress(0)
    addToast('Creating 30-second advertisement...', 'info')
    const progressInterval = setInterval(() => { setVideoProgress(prev => Math.min(prev + 3, 90)) }, 500)
    try {
      const files = images ? images.map(f => f.file) : []
      const blob = await generateAdVideo(content, platform || 'instagram', { images: files, showEmojis })
      const url = createVideoUrl(blob)
      setVideoUrl(url)
      setShowVideo(true)
      setVideoProgress(100)
      addToast('Video ready!', 'success')
    } catch (error) {
      addToast('Failed: ' + error.message, 'error')
    } finally {
      setIsGeneratingVideo(false)
      clearInterval(progressInterval)
    }
  }

  const handlePlayVideoWithVoice = () => {
    const video = videoRef.current
    if (!video) return
    video.play()
    setAdPlaying(true)
    setTimeout(() => {
      const scenes = getScenesForContent(content)
      let sceneIndex = 0
      setCurrentCaption(scenes[0]?.text || '')
      const updateCaption = () => {
        sceneIndex++
        if (sceneIndex < scenes.length) {
          setCurrentCaption(scenes[sceneIndex].text)
          sceneTimerRef.current = setTimeout(updateCaption, scenes[sceneIndex].duration)
        }
      }
      sceneTimerRef.current = setTimeout(updateCaption, scenes[0]?.duration || 7000)
      speak(content, selectedVoice, {
        withMusic, musicGenre,
        onEnd: () => { setSpeaking(false); setCurrentCaption(''); clearTimeout(sceneTimerRef.current) },
        voiceVolume, musicVolume, useReverb, useEcho,
      })
      setSpeaking(true)
    }, 300)
  }

  const handleStopVideo = () => {
    const video = videoRef.current
    if (video) { video.pause(); video.currentTime = 0 }
    handleStopAd()
  }

  const sectionTabs = [
    { id: 'content', label: 'Edit', icon: Edit3 },
    { id: 'voice', label: 'Voice', icon: Radio },
    { id: 'video', label: 'Video', icon: Film },
  ]

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Header */}
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
        <div className="flex items-center gap-2">
          {videoUrl && (
            <Button size="sm" onClick={() => { const a = document.createElement('a'); a.href = videoUrl; a.download = 'advertisement.webm'; a.click() }} variant="ghost" className="text-white border border-white/20">
              <Download className="w-4 h-4" />
            </Button>
          )}
          <Button size="sm" onClick={onClose} variant="ghost" className="text-white border border-white/20">
            Close
          </Button>
        </div>
      </div>

      {/* Section Tabs */}
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
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Film className="w-4 h-4 text-purple-500" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Video Ad (30s)</p>
            </div>

            {!showVideo ? (
              <div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-3 bg-white/5 rounded-xl text-center"><p className="text-[10px] text-purple-300">Duration</p><p className="text-sm font-bold text-white">30s</p></div>
                  <div className="p-3 bg-white/5 rounded-xl text-center"><p className="text-[10px] text-purple-300">Quality</p><p className="text-sm font-bold text-white">HD</p></div>
                  <div className="p-3 bg-white/5 rounded-xl text-center"><p className="text-[10px] text-purple-300">Ratio</p><p className="text-sm font-bold text-white">9:16</p></div>
                </div>

                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Upload product images in the Media tab to showcase them in scenes. Use <code className="text-amber-400">:rocket:</code> <code className="text-amber-400">:fire:</code> in content for emojis.
                </p>

                {isGeneratingVideo && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-purple-300 mb-1"><span>Rendering studio scenes...</span><span>{videoProgress}%</span></div>
                    <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all" style={{ width: `${videoProgress}%` }} /></div>
                  </div>
                )}

                <Button onClick={handleGenerateVideo} disabled={isGeneratingVideo}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  {isGeneratingVideo ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : <><Film className="w-4 h-4 mr-2" /> Generate Studio Ad</>}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <video ref={videoRef} src={videoUrl} className="w-full max-w-[260px] mx-auto block rounded-lg"
                    style={{ maxHeight: '420px' }} onPlay={handlePlayVideoWithVoice} />
                  {currentCaption && (
                    <div className="absolute bottom-12 left-3 right-3">
                      <div className="bg-black/70 backdrop-blur rounded-lg p-2 border border-white/10">
                        <p className="text-center text-white text-xs font-medium">{currentCaption}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => downloadVideo(videoUrl)} className="bg-gradient-to-r from-purple-600 to-pink-600" size="sm">
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                  <Button onClick={handleStopVideo} variant="ghost" size="sm" className="text-white border border-white/20">Stop</Button>
                  <Button onClick={() => { setShowVideo(false); setVideoUrl(null); handleStopAd() }} variant="ghost" size="sm" className="text-white border border-white/20">New</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
