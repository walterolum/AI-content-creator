import { useState, useRef, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
  Wand2, Sparkles, Copy, Save, RefreshCw, Download,
  FileText, Film, Music, Play, Pause, Upload,
  Volume2, Video, Mic, Square, Sliders,
  Image, Smile, Layers, Radio
} from 'lucide-react'
import Button from '../ui/Button'
import Select from '../ui/Select'
import Input from '../ui/Input'
import Card from '../ui/Card'
import FileUpload from '../ui/FileUpload'
import { useToast } from '../../contexts/ToastContext'
import { streamAI } from '../../lib/api'
import {
  speak, stopSpeech, pauseSpeech, resumeSpeech,
  isSpeaking, isPaused, voiceProfiles, musicGenres
} from '../../lib/audio'
import {
  generateAdVideo, generateVoiceoverScript,
  createVideoUrl, getScenesForContent
} from '../../lib/video'

const businessTypes = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'salon', label: 'Salon & Beauty' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'school', label: 'School & Education' },
  { value: 'church', label: 'Church & Religious' },
  { value: 'ngo', label: 'NGO & Non-Profit' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'hotel', label: 'Hotel & Hospitality' },
  { value: 'coffee-shop', label: 'Coffee Shop' },
  { value: 'electronics', label: 'Electronics & Tech' },
  { value: 'personal-brand', label: 'Personal Brand' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'agency', label: 'Marketing Agency' },
]

const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'threads', label: 'Threads' },
]

const tones = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'funny', label: 'Funny' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'educational', label: 'Educational' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'youthful', label: 'Youthful' },
]

const goals = [
  { value: 'sales', label: 'Sales' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'awareness', label: 'Brand Awareness' },
  { value: 'lead-generation', label: 'Lead Generation' },
  { value: 'website-traffic', label: 'Website Traffic' },
  { value: 'brand-growth', label: 'Brand Growth' },
]

const audiences = [
  { value: 'teenagers', label: 'Teenagers' },
  { value: 'parents', label: 'Parents' },
  { value: 'students', label: 'Students' },
  { value: 'professionals', label: 'Professionals' },
  { value: 'business-owners', label: 'Business Owners' },
  { value: 'everyone', label: 'Everyone' },
]

const lengths = [
  { value: 'short', label: 'Short (1-2 sentences)' },
  { value: 'medium', label: 'Medium (3-5 sentences)' },
  { value: 'long', label: 'Long (Full post)' },
]

const languages = [
  { value: 'english', label: 'English' },
  { value: 'luganda', label: 'Luganda' },
  { value: 'kiswahili', label: 'Kiswahili' },
  { value: 'french', label: 'French' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'german', label: 'German' },
]

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function GeneratorForm() {
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDownloads, setShowDownloads] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState('radio-presenter')
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [withMusic, setWithMusic] = useState(true)
  const [musicGenre, setMusicGenre] = useState('cinematic')
  const [voiceVolume, setVoiceVolume] = useState(1)
  const [musicVolume, setMusicVolume] = useState(0.3)
  const [useReverb, setUseReverb] = useState(false)
  const [useEcho, setUseEcho] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [activeTab, setActiveTab] = useState('content')
  const [videoUrl, setVideoUrl] = useState(null)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [currentCaption, setCurrentCaption] = useState('')
  const [adPlaying, setAdPlaying] = useState(false)
  const [showEmojis, setShowEmojis] = useState(true)
  const [showAudioPanel, setShowAudioPanel] = useState(false)
  const [showVideoPanel, setShowVideoPanel] = useState(false)
  const videoRef = useRef(null)
  const captionTimerRef = useRef(null)
  const sceneTimerRef = useRef(null)
  const { addToast } = useToast()

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      businessType: '', platform: '', tone: 'professional',
      goal: 'engagement', audience: 'everyone', length: 'medium',
      language: 'english', topic: '', keywords: '', additionalInfo: '',
    }
  })

  const watchedPlatform = watch('platform')

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeaking(isSpeaking())
      setPaused(isPaused())
    }, 100)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    return () => {
      if (captionTimerRef.current) clearInterval(captionTimerRef.current)
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current)
    }
  }, [])

  const onGenerate = async (data) => {
    setIsGenerating(true)
    setGeneratedContent('')
    setVideoUrl(null)
    setShowVideo(false)
    try {
      await streamAI('/ai/generate', data, (chunk) => {
        setGeneratedContent(prev => prev + chunk)
      })
      addToast('Content generated!', 'success')
    } catch (error) {
      addToast(error.message || 'Failed to generate', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => addToast('Saved!', 'success')

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    addToast('Copied!', 'success')
  }

  const handlePlayAd = useCallback(() => {
    if (speaking) {
      if (paused) resumeSpeech()
      else pauseSpeech()
      return
    }

    const scenes = getScenesForContent(generatedContent)
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

    speak(generatedContent, selectedVoice, {
      withMusic,
      musicGenre,
      onEnd: () => {
        setSpeaking(false)
        setAdPlaying(false)
        setCurrentCaption('')
        clearTimeout(sceneTimerRef.current)
      },
      voiceVolume,
      musicVolume: musicVolume,
      useReverb,
      useEcho,
    })

    setSpeaking(true)
    setAdPlaying(true)
    addToast('Playing advertisement...', 'info')
  }, [generatedContent, selectedVoice, withMusic, musicGenre, voiceVolume, musicVolume, useReverb, useEcho, speaking, paused, addToast])

  const handleStopAd = () => {
    stopSpeech()
    setSpeaking(false); setPaused(false); setAdPlaying(false)
    setCurrentCaption('')
    clearTimeout(sceneTimerRef.current)
  }

  const handleGenerateVideo = async () => {
    if (!generatedContent) {
      addToast('Generate content first', 'error')
      return
    }
    setIsGeneratingVideo(true)
    setVideoProgress(0)
    addToast('Creating 30-second advertisement...', 'info')

    const progressInterval = setInterval(() => {
      setVideoProgress(prev => Math.min(prev + 3, 90))
    }, 500)

    try {
      const files = uploadedFiles.map(f => f.file)
      const blob = await generateAdVideo(generatedContent, watchedPlatform || 'instagram', {
        images: files,
        showEmojis,
      })
      const url = createVideoUrl(blob)
      setVideoUrl(url)
      setShowVideo(true)
      setVideoProgress(100)
      addToast('Video ready! Click play.', 'success')
    } catch (error) {
      addToast('Failed to generate video: ' + error.message, 'error')
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
      const scenes = getScenesForContent(generatedContent)
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

      speak(generatedContent, selectedVoice, {
        withMusic,
        musicGenre,
        onEnd: () => {
          setSpeaking(false)
          setCurrentCaption('')
          clearTimeout(sceneTimerRef.current)
        },
        voiceVolume,
        musicVolume,
        useReverb,
        useEcho,
      })
      setSpeaking(true)
    }, 300)
  }

  const handleStopVideo = () => {
    const video = videoRef.current
    if (video) { video.pause(); video.currentTime = 0 }
    handleStopAd()
  }

  const handleDownloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement('a')
      a.href = videoUrl
      a.download = `advertisement-${watchedPlatform || 'social'}.webm`
      document.body.appendChild(a); a.click()
      document.body.removeChild(a)
      addToast('Downloaded!', 'success')
    }
  }

  const handleDownload = (format) => {
    const ts = new Date().toISOString().slice(0, 10)
    const fn = `content-${ts}`
    switch (format) {
      case 'txt':
        downloadFile(generatedContent, `${fn}.txt`, 'text/plain'); break
      case 'md':
        downloadFile(generatedContent, `${fn}.md`, 'text/markdown'); break
      case 'html':
        downloadFile('<!DOCTYPE html><html><head><title>Content</title><style>body{font-family:Arial;max-width:800px;margin:40px auto;padding:20px;line-height:1.6}</style></head><body>' + generatedContent.replace(/\n/g, '<br>') + '</body></html>', `${fn}.html`, 'text/html'); break
      default:
        downloadFile(generatedContent, `${fn}.txt`, 'text/plain')
    }
    addToast(`Downloaded as ${format.toUpperCase()}`, 'success')
  }

  const voiceStyleGroups = [
    { label: '🎙️ Radio & Presenter', profiles: voiceProfiles.filter(v => ['radio-presenter', 'news-anchor', 'friendly-host', 'storyteller'].includes(v.id)) },
    { label: '📢 Advertiser & Promo', profiles: voiceProfiles.filter(v => ['advertiser-male', 'advertiser-female', 'energetic-promo'].includes(v.id)) },
    { label: '🏢 Corporate & Professional', profiles: voiceProfiles.filter(v => ['corporate-narrator', 'professional-male', 'professional-female'].includes(v.id)) },
    { label: '🎬 Cinematic & Luxury', profiles: voiceProfiles.filter(v => ['luxury-brand', 'documentary-narrator'].includes(v.id)) },
  ]

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'audio', label: 'Voice Studio', icon: Radio },
    { id: 'video', label: 'Video Pro', icon: Film },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${activeTab === tab.id ? 'bg-white dark:bg-secondary-700 shadow text-primary-600' : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400'}`}>
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <Card>
          <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">Content Settings</h2>
            </div>

            <Select label="Business Type" placeholder="Select" options={businessTypes} error={errors.businessType?.message} {...register('businessType', { required: 'Required' })} />
            <Select label="Platform" placeholder="Select" options={platforms} error={errors.platform?.message} {...register('platform', { required: 'Required' })} />

            <div className="grid grid-cols-2 gap-4">
              <Select label="Tone" options={tones} {...register('tone')} />
              <Select label="Goal" options={goals} {...register('goal')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Audience" options={audiences} {...register('audience')} />
              <Select label="Length" options={lengths} {...register('length')} />
            </div>
            <Select label="Language" options={languages} {...register('language')} />
            <Input label="Topic / Product" placeholder="e.g., Nano Banana organic fruit..." error={errors.topic?.message} {...register('topic', { required: 'Required' })} />
            <Input label="Keywords (optional)" placeholder="e.g., organic, healthy, natural" {...register('keywords')} />
            <Input label="Additional Info (optional)" placeholder="Any details..." {...register('additionalInfo')} />

            {activeTab === 'media' && (
              <div className="pt-2">
                <FileUpload onFilesChange={setUploadedFiles} maxFiles={5} />
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
              {isGenerating ? <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="w-5 h-5 mr-2" /> Generate Content</>}
            </Button>
          </form>
        </Card>

        {/* Right: Output */}
        <div className="space-y-4">
          {/* Generated Content */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">Generated Content</h2>
              {generatedContent && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy}><Copy className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={handleSave}><Save className="w-4 h-4" /></Button>
                  <div className="relative">
                    <Button variant="ghost" size="sm" onClick={() => setShowDownloads(!showDownloads)}><Download className="w-4 h-4" /></Button>
                    {showDownloads && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-secondary-900 rounded-lg shadow-lg border py-1 z-10">
                        <button onClick={() => handleDownload('txt')} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800">Download TXT</button>
                        <button onClick={() => handleDownload('md')} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800">Download MD</button>
                        <button onClick={() => handleDownload('html')} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800">Download HTML</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="min-h-[200px] rounded-lg border bg-secondary-50 dark:bg-secondary-800/50 p-4">
              {isGenerating ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/4" />
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-full" />
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-5/6" />
                </div>
              ) : generatedContent ? (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm">{generatedContent}</div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <Sparkles className="w-10 h-10 text-secondary-300 mb-3" />
                  <p className="text-secondary-500 text-sm">Generate content to see preview</p>
                </div>
              )}
            </div>

            {currentCaption && (
              <div className="mt-3 p-3 bg-black/80 rounded-lg">
                <p className="text-center text-white text-base font-medium leading-relaxed">{currentCaption}</p>
              </div>
            )}
          </Card>

          {/* Voice Studio Panel */}
          {generatedContent && activeTab === 'audio' && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-secondary-900 dark:text-white">Voice Studio</h3>
                </div>
                <button onClick={() => setShowAudioPanel(!showAudioPanel)}>
                  <Sliders className="w-4 h-4 text-secondary-400" />
                </button>
              </div>

              <div className="space-y-3">
                {voiceStyleGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 mb-1.5 uppercase tracking-wider">{group.label}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {group.profiles.map((v) => (
                        <button key={v.id} type="button" onClick={() => setSelectedVoice(v.id)}
                          className={`p-2.5 rounded-lg text-left transition-all border ${selectedVoice === v.id ? 'bg-amber-500/10 border-amber-500/40 shadow-sm' : 'bg-secondary-50 dark:bg-secondary-800 border-transparent hover:border-secondary-300 dark:hover:border-secondary-600'}`}>
                          <p className="text-sm font-medium text-secondary-900 dark:text-white">{v.name}</p>
                          <p className="text-xs text-secondary-500 mt-0.5">{v.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {showAudioPanel && (
                <div className="mt-4 space-y-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center gap-3 mb-3 p-2.5 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                    <button type="button" onClick={() => setWithMusic(!withMusic)}
                      className={`w-10 h-5 rounded-full transition-colors ${withMusic ? 'bg-amber-500' : 'bg-gray-600'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${withMusic ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                    <span className="text-sm text-secondary-700 dark:text-secondary-300">Background Music</span>
                    <Music className={`w-4 h-4 ml-auto ${withMusic ? 'text-amber-500' : 'text-gray-500'}`} />
                  </div>

                  {withMusic && (
                    <Select label="Music Genre" options={musicGenres.filter(g => g.id !== 'none')} value={musicGenre} onChange={(e) => setMusicGenre(e.target.value)} />
                  )}

                  <div>
                    <label className="block text-xs font-medium text-secondary-600 dark:text-secondary-400 mb-1">Voice Volume</label>
                    <input type="range" min="0" max="1" step="0.05" value={voiceVolume}
                      onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                      className="w-full accent-amber-500" />
                    <div className="flex justify-between text-xs text-secondary-400">
                      <span>0%</span><span>{Math.round(voiceVolume * 100)}%</span><span>100%</span>
                    </div>
                  </div>

                  {withMusic && (
                    <div>
                      <label className="block text-xs font-medium text-secondary-600 dark:text-secondary-400 mb-1">Music Volume</label>
                      <input type="range" min="0" max="0.8" step="0.05" value={musicVolume}
                        onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                        className="w-full accent-amber-500" />
                      <div className="flex justify-between text-xs text-secondary-400">
                        <span>0%</span><span>{Math.round(musicVolume / 0.8 * 100)}%</span><span>100%</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={useReverb} onChange={(e) => setUseReverb(e.target.checked)}
                        className="rounded accent-amber-500" />
                      <span className="text-sm text-secondary-700 dark:text-secondary-300">Reverb</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={useEcho} onChange={(e) => setUseEcho(e.target.checked)}
                        className="rounded accent-amber-500" />
                      <span className="text-sm text-secondary-700 dark:text-secondary-300">Echo</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mt-4">
                <button onClick={handlePlayAd}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-shadow">
                  {speaking ? (paused ? <Play className="w-6 h-6 text-white ml-0.5" /> : <Pause className="w-6 h-6 text-white" />) : <Play className="w-6 h-6 text-white ml-0.5" />}
                </button>
                <button onClick={handleStopAd} className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600">
                  <Square className="w-4 h-4 text-white" />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-bold text-secondary-900 dark:text-white">{speaking ? 'PLAYING...' : 'READY'}</p>
                  <p className="text-xs text-amber-500">{voiceProfiles.find(v => v.id === selectedVoice)?.name}</p>
                </div>
                <Volume2 className="w-5 h-5 text-amber-500" />
              </div>
            </Card>
          )}

          {/* Video Pro Panel */}
          {generatedContent && activeTab === 'video' && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold text-secondary-900 dark:text-white">Video Pro Studio</h3>
                </div>
                <button onClick={() => setShowVideoPanel(!showVideoPanel)}>
                  <Layers className="w-4 h-4 text-secondary-400" />
                </button>
              </div>

              {showVideoPanel && (
                <div className="space-y-3 mb-4 p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setShowEmojis(!showEmojis)}
                      className={`w-10 h-5 rounded-full transition-colors ${showEmojis ? 'bg-purple-500' : 'bg-gray-600'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${showEmojis ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                    <span className="text-sm text-secondary-700 dark:text-secondary-300">Show Emojis in Video</span>
                    <Smile className={`w-4 h-4 ml-auto ${showEmojis ? 'text-purple-500' : 'text-gray-500'}`} />
                  </div>
                  <p className="text-xs text-secondary-400">Use :rocket: :fire: :star: :crown: in your content to show emojis</p>
                </div>
              )}

              {!showVideo ? (
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="p-2 bg-white/10 rounded text-center"><p className="text-xs text-purple-200">Duration</p><p className="text-sm font-bold text-white">30s</p></div>
                    <div className="p-2 bg-white/10 rounded text-center"><p className="text-xs text-purple-200">Quality</p><p className="text-sm font-bold text-white">HD 1080p</p></div>
                    <div className="p-2 bg-white/10 rounded text-center"><p className="text-xs text-purple-200">Ratio</p><p className="text-sm font-bold text-white">9:16</p></div>
                  </div>

                  <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                    Upload product images in the <strong>Media</strong> tab to showcase them in your video ad.
                  </p>

                  {isGeneratingVideo && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-purple-200 mb-1"><span>Rendering scenes...</span><span>{videoProgress}%</span></div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all" style={{ width: `${videoProgress}%` }} />
                      </div>
                    </div>
                  )}

                  <Button onClick={handleGenerateVideo} disabled={isGeneratingVideo}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    {isGeneratingVideo ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Creating 30s Ad...</>
                      : <><Film className="w-4 h-4 mr-2" /> Generate Professional Ad</>}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden bg-black">
                    <video ref={videoRef} src={videoUrl} className="w-full max-w-[280px] mx-auto block" style={{ maxHeight: '450px' }} onPlay={handlePlayVideoWithVoice} />
                    {currentCaption && (
                      <div className="absolute bottom-14 left-3 right-3">
                        <div className="bg-black/75 backdrop-blur rounded-lg p-2.5 border border-white/10">
                          <p className="text-center text-white text-xs font-medium leading-relaxed">{currentCaption}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleDownloadVideo} className="bg-gradient-to-r from-purple-600 to-pink-600" size="sm">
                      <Download className="w-4 h-4 mr-1" /> Download
                    </Button>
                    <Button onClick={handleStopVideo} variant="ghost" size="sm" className="text-white border border-white/20">Stop</Button>
                    <Button onClick={() => { setShowVideo(false); setVideoUrl(null); handleStopAd() }} variant="ghost" size="sm" className="text-white border border-white/20">New</Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
