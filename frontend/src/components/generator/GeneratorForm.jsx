import { useState, useRef, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
  Wand2, Sparkles, Copy, Save, RefreshCw, Download,
  FileText, Film, Music, Play, Pause, Upload,
  Volume2, Video, Mic, Square
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
  isSpeaking, isPaused, voiceProfiles
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
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function GeneratorForm() {
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDownloads, setShowDownloads] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState('cinematic-male')
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [withMusic, setWithMusic] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [activeTab, setActiveTab] = useState('content')
  const [videoUrl, setVideoUrl] = useState(null)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [currentCaption, setCurrentCaption] = useState('')
  const [adPlaying, setAdPlaying] = useState(false)
  const videoRef = useRef(null)
  const captionTimerRef = useRef(null)
  const sceneTimerRef = useRef(null)
  const { addToast } = useToast()

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      businessType: '',
      platform: '',
      tone: 'professional',
      goal: 'engagement',
      audience: 'everyone',
      length: 'medium',
      language: 'english',
      topic: '',
      keywords: '',
      additionalInfo: '',
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

  // Cleanup timers
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

  // Play voiceover with synchronized captions
  const handlePlayAd = useCallback(() => {
    if (speaking) {
      if (paused) resumeSpeech()
      else pauseSpeech()
      return
    }

    const scenes = getScenesForContent(generatedContent)
    let sceneIndex = 0

    // Show first caption
    setCurrentCaption(scenes[0]?.text || '')

    // Cycle through captions synced with scenes
    const updateCaption = () => {
      sceneIndex++
      if (sceneIndex < scenes.length) {
        setCurrentCaption(scenes[sceneIndex].text)
        sceneTimerRef.current = setTimeout(updateCaption, scenes[sceneIndex].duration)
      }
    }

    sceneTimerRef.current = setTimeout(updateCaption, scenes[0]?.duration || 7000)

    // Start voiceover
    speak(generatedContent, selectedVoice, withMusic, () => {
      setSpeaking(false)
      setAdPlaying(false)
      setCurrentCaption('')
      clearTimeout(sceneTimerRef.current)
    })

    setSpeaking(true)
    setAdPlaying(true)
    addToast('Playing advertisement...', 'info')
  }, [generatedContent, selectedVoice, withMusic, speaking, paused, addToast])

  const handleStopAd = () => {
    stopSpeech()
    setSpeaking(false)
    setPaused(false)
    setAdPlaying(false)
    setCurrentCaption('')
    clearTimeout(sceneTimerRef.current)
  }

  // Generate video
  const handleGenerateVideo = async () => {
    if (!generatedContent) {
      addToast('Generate content first', 'error')
      return
    }

    setIsGeneratingVideo(true)
    setVideoProgress(0)
    addToast('Creating 30-second advertisement...', 'info')

    const progressInterval = setInterval(() => {
      setVideoProgress(prev => Math.min(prev + 4, 90))
    }, 400)

    try {
      const blob = await generateAdVideo(generatedContent, watchedPlatform || 'instagram')
      const url = createVideoUrl(blob)
      setVideoUrl(url)
      setShowVideo(true)
      setVideoProgress(100)
      addToast('Video ready! Click play.', 'success')
    } catch (error) {
      addToast('Failed to generate video', 'error')
    } finally {
      setIsGeneratingVideo(false)
      clearInterval(progressInterval)
    }
  }

  // Play video with background voiceover
  const handlePlayVideoWithVoice = () => {
    const video = videoRef.current
    if (!video) return

    video.play()
    setAdPlaying(true)

    // Start voiceover slightly after video starts
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

      speak(generatedContent, selectedVoice, withMusic, () => {
        setSpeaking(false)
        setCurrentCaption('')
        clearTimeout(sceneTimerRef.current)
      })

      setSpeaking(true)
    }, 300)
  }

  const handleStopVideo = () => {
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
    handleStopAd()
  }

  const handleDownloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement('a')
      a.href = videoUrl
      a.download = `advertisement-${watchedPlatform || 'social'}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      addToast('Downloaded!', 'success')
    }
  }

  const handleDownload = (format) => {
    const ts = new Date().toISOString().slice(0, 10)
    const fn = `content-${ts}`

    switch (format) {
      case 'txt':
        downloadFile(generatedContent, `${fn}.txt`, 'text/plain')
        break
      case 'md':
        downloadFile(generatedContent, `${fn}.md`, 'text/markdown')
        break
      case 'html':
        downloadFile(`<!DOCTYPE html><html><head><title>Content</title><style>body{font-family:Arial;max-width:800px;margin:40px auto;padding:20px;line-height:1.6}</style></head><body>${generatedContent.replace(/\n/g, '<br>')}</body></html>`, `${fn}.html`, 'text/html')
        break
      default:
        downloadFile(generatedContent, `${fn}.txt`, 'text/plain')
    }
    addToast(`Downloaded as ${format.toUpperCase()}`, 'success')
  }

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'media', label: 'Media', icon: Upload },
    { id: 'audio', label: 'Voice', icon: Music },
    { id: 'video', label: 'Video', icon: Film },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              activeTab === tab.id
                ? 'bg-white dark:bg-secondary-700 shadow text-primary-600'
                : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
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

            <Input label="Topic / Product" placeholder="e.g., Summer collection launch..." error={errors.topic?.message} {...register('topic', { required: 'Required' })} />
            <Input label="Keywords (optional)" placeholder="e.g., organic, sale" {...register('keywords')} />
            <Input label="Additional Info (optional)" placeholder="Any details..." {...register('additionalInfo')} />

            {activeTab === 'media' && <FileUpload onFilesChange={setUploadedFiles} maxFiles={5} />}

            <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
              {isGenerating ? (
                <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" /> Generate Content</>
              )}
            </Button>
          </form>
        </Card>

        {/* Output */}
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

          {/* Content Display */}
          <div className="min-h-[250px] rounded-lg border bg-secondary-50 dark:bg-secondary-800/50 p-4">
            {isGenerating ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/4" />
                <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-full" />
                <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-5/6" />
              </div>
            ) : generatedContent ? (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm">{generatedContent}</div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[250px] text-center">
                <Sparkles className="w-10 h-10 text-secondary-300 mb-3" />
                <p className="text-secondary-500 text-sm">Generate content to see preview</p>
              </div>
            )}
          </div>

          {/* Live Caption Overlay */}
          {currentCaption && (
            <div className="mt-3 p-3 bg-black/80 rounded-lg">
              <p className="text-center text-white text-base font-medium leading-relaxed">{currentCaption}</p>
            </div>
          )}

          {/* Voice Player */}
          {generatedContent && (
            <div className="mt-4 p-4 bg-gradient-to-r from-gray-900 to-black rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-400 tracking-widest">VOICEOVER</p>
                  <p className="text-xs text-gray-400">Professional background voice</p>
                </div>
              </div>

              <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full mb-3 p-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm">
                {voiceProfiles.map(v => (
                  <option key={v.id} value={v.id}>{v.name} - {v.description}</option>
                ))}
              </select>

              <div className="flex items-center gap-3 mb-3 p-2.5 bg-gray-800/50 rounded-lg">
                <button type="button" onClick={() => setWithMusic(!withMusic)}
                  className={`w-10 h-5 rounded-full transition-colors ${withMusic ? 'bg-amber-500' : 'bg-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${withMusic ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-xs text-white">Background Music</span>
                <Music className={`w-4 h-4 ml-auto ${withMusic ? 'text-amber-500' : 'text-gray-500'}`} />
              </div>

              <div className="flex items-center gap-3">
                <button onClick={handlePlayAd}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  {speaking ? (paused ? <Play className="w-6 h-6 text-white ml-0.5" /> : <Pause className="w-6 h-6 text-white" />) : <Play className="w-6 h-6 text-white ml-0.5" />}
                </button>
                <button onClick={handleStopAd} className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <Square className="w-4 h-4 text-white" />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{speaking ? 'PLAYING...' : 'READY'}</p>
                  <p className="text-xs text-amber-400">{voiceProfiles.find(v => v.id === selectedVoice)?.name}</p>
                </div>
                <Volume2 className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          )}

          {/* Video Generator */}
          {generatedContent && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-900 to-pink-900 rounded-xl border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-400 tracking-widest">VIDEO AD</p>
                  <p className="text-xs text-gray-400">30-sec with voiceover</p>
                </div>
              </div>

              {!showVideo ? (
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="p-2 bg-white/10 rounded text-center">
                      <p className="text-xs text-purple-200">Duration</p>
                      <p className="text-sm font-bold text-white">30s</p>
                    </div>
                    <div className="p-2 bg-white/10 rounded text-center">
                      <p className="text-xs text-purple-200">Quality</p>
                      <p className="text-sm font-bold text-white">HD</p>
                    </div>
                    <div className="p-2 bg-white/10 rounded text-center">
                      <p className="text-xs text-purple-200">Ratio</p>
                      <p className="text-sm font-bold text-white">9:16</p>
                    </div>
                  </div>

                  {isGeneratingVideo && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-purple-200 mb-1">
                        <span>Rendering...</span>
                        <span>{videoProgress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all" style={{ width: `${videoProgress}%` }} />
                      </div>
                    </div>
                  )}

                  <Button onClick={handleGenerateVideo} disabled={isGeneratingVideo}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    {isGeneratingVideo ? (
                      <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                    ) : (
                      <><Film className="w-4 h-4 mr-2" /> Generate 30-Second Ad</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden">
                    <video ref={videoRef} src={videoUrl} className="w-full max-w-[280px] mx-auto block"
                      style={{ maxHeight: '450px' }} onPlay={handlePlayVideoWithVoice} />

                    {/* Video overlay captions */}
                    {currentCaption && (
                      <div className="absolute bottom-16 left-3 right-3">
                        <div className="bg-black/75 rounded-lg p-2.5">
                          <p className="text-center text-white text-xs font-medium leading-relaxed">{currentCaption}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleDownloadVideo} className="bg-gradient-to-r from-purple-600 to-pink-600" size="sm">
                      <Download className="w-4 h-4 mr-1" /> Download
                    </Button>
                    <Button onClick={handleStopVideo} variant="ghost" size="sm" className="text-white border border-white/20">
                      Stop
                    </Button>
                    <Button onClick={() => { setShowVideo(false); setVideoUrl(null); handleStopAd() }} variant="ghost" size="sm" className="text-white border border-white/20">
                      New
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
