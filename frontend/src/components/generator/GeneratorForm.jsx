import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  Wand2, Sparkles, Copy, Save, RefreshCw, Download,
  FileText, Film, Music, Play, Pause, Upload,
  Volume2, Video, Mic, Square, Settings
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
  generateCinematicVideo, generateBackgroundMusic,
  audioBufferToBlob, createVideoUrl
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
  const videoRef = useRef(null)
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

  const onGenerate = async (data) => {
    setIsGenerating(true)
    setGeneratedContent('')
    setVideoUrl(null)
    setShowVideo(false)

    try {
      const requestData = {
        ...data,
        hasImages: uploadedFiles.length > 0,
        imageCount: uploadedFiles.length,
      }

      await streamAI('/ai/generate', requestData, (chunk) => {
        setGeneratedContent(prev => prev + chunk)
      })
      addToast('Content generated successfully!', 'success')
    } catch (error) {
      addToast(error.message || 'Failed to generate content', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    addToast('Content saved to library!', 'success')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    addToast('Copied to clipboard!', 'success')
  }

  const handlePlayPause = () => {
    if (speaking) {
      if (paused) {
        resumeSpeech()
      } else {
        pauseSpeech()
      }
    } else {
      speak(generatedContent, selectedVoice, withMusic, () => {
        setSpeaking(false)
        setPaused(false)
      })
      setSpeaking(true)
      addToast(`Playing with ${voiceProfiles.find(v => v.id === selectedVoice)?.name} voice`, 'info')
    }
  }

  const handleStop = () => {
    stopSpeech()
    setSpeaking(false)
    setPaused(false)
  }

  const handleGenerateVideo = async () => {
    if (!generatedContent) {
      addToast('Generate content first', 'error')
      return
    }

    setIsGeneratingVideo(true)
    setVideoProgress(0)
    addToast('Creating cinematic video...', 'info')

    // Simulate progress
    const progressInterval = setInterval(() => {
      setVideoProgress(prev => Math.min(prev + 5, 90))
    }, 200)

    try {
      const blob = await generateCinematicVideo(generatedContent, watchedPlatform || 'instagram', {
        duration: 15000,
        width: 1080,
        height: 1920,
      })
      const url = createVideoUrl(blob)
      setVideoUrl(url)
      setShowVideo(true)
      setVideoProgress(100)
      addToast('Cinematic video ready! Click play to watch.', 'success')
    } catch (error) {
      addToast('Failed to generate video', 'error')
      console.error('Video generation error:', error)
    } finally {
      setIsGeneratingVideo(false)
      clearInterval(progressInterval)
    }
  }

  const handleDownloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement('a')
      a.href = videoUrl
      a.download = `cinematic-${watchedPlatform || 'social'}-video.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      addToast('Video downloaded!', 'success')
    }
  }

  const handleDownloadMusic = () => {
    try {
      const buffer = generateBackgroundMusic(15)
      const blob = audioBufferToBlob(buffer)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'background-music.wav'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      addToast('Background music downloaded!', 'success')
    } catch (error) {
      addToast('Failed to generate music', 'error')
    }
  }

  const handleDownload = (format) => {
    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `content-${timestamp}`

    switch (format) {
      case 'txt':
        downloadFile(generatedContent, `${filename}.txt`, 'text/plain')
        break
      case 'md':
        downloadFile(generatedContent, `${filename}.md`, 'text/markdown')
        break
      case 'html':
        const html = `<!DOCTYPE html>
<html>
<head><title>Generated Content</title>
<style>body{font-family:Arial;max-width:800px;margin:40px auto;padding:20px;line-height:1.6}</style>
</head>
<body>${generatedContent.replace(/\n/g, '<br>')}</body>
</html>`
        downloadFile(html, `${filename}.html`, 'text/html')
        break
      case 'json':
        const json = JSON.stringify({
          content: generatedContent,
          platform: watchedPlatform,
          date: new Date().toISOString()
        }, null, 2)
        downloadFile(json, `${filename}.json`, 'application/json')
        break
      default:
        downloadFile(generatedContent, `${filename}.txt`, 'text/plain')
    }
    addToast(`Downloaded as ${format.toUpperCase()}`, 'success')
  }

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'media', label: 'Upload Media', icon: Upload },
    { id: 'audio', label: 'Voice & Audio', icon: Music },
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

            <Select
              label="Business Type"
              placeholder="Select your business"
              options={businessTypes}
              error={errors.businessType?.message}
              {...register('businessType', { required: 'Required' })}
            />

            <Select
              label="Platform"
              placeholder="Select platform"
              options={platforms}
              error={errors.platform?.message}
              {...register('platform', { required: 'Required' })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select label="Tone" options={tones} {...register('tone')} />
              <Select label="Goal" options={goals} {...register('goal')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select label="Audience" options={audiences} {...register('audience')} />
              <Select label="Length" options={lengths} {...register('length')} />
            </div>

            <Select label="Language" options={languages} {...register('language')} />

            <Input
              label="Topic / Product"
              placeholder="e.g., Summer collection launch, weekly specials..."
              error={errors.topic?.message}
              {...register('topic', { required: 'Topic is required' })}
            />

            <Input
              label="Keywords (optional)"
              placeholder="e.g., organic, sustainable, sale"
              {...register('keywords')}
            />

            <Input
              label="Additional Info (optional)"
              placeholder="Any specific details or requirements..."
              {...register('additionalInfo')}
            />

            {activeTab === 'media' && (
              <FileUpload onFilesChange={setUploadedFiles} maxFiles={5} />
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Content
                </>
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
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                </Button>
                <div className="relative">
                  <Button variant="ghost" size="sm" onClick={() => setShowDownloads(!showDownloads)}>
                    <Download className="w-4 h-4" />
                  </Button>
                  {showDownloads && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-secondary-900 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 py-1 z-10">
                      <button onClick={() => handleDownload('txt')} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Download TXT
                      </button>
                      <button onClick={() => handleDownload('md')} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Download Markdown
                      </button>
                      <button onClick={() => handleDownload('html')} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Download HTML
                      </button>
                      <div className="border-t border-secondary-200 dark:border-secondary-700 my-1" />
                      <button onClick={handleDownloadMusic} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 flex items-center gap-2">
                        <Music className="w-4 h-4" /> Download Music
                      </button>
                      <button onClick={handleGenerateVideo} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 flex items-center gap-2">
                        <Video className="w-4 h-4" /> Generate Video
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Content Display */}
          <div className="min-h-[400px] rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 p-4">
            {isGenerating ? (
              <div className="space-y-3">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/4" />
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-full" />
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-5/6" />
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4" />
                </div>
                <p className="text-sm text-secondary-500 animate-pulse">AI is crafting your content...</p>
              </div>
            ) : generatedContent ? (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {generatedContent}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <Sparkles className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mb-4" />
                <p className="text-secondary-500">Your AI-generated content will appear here</p>
                <p className="text-sm text-secondary-400 mt-1">Fill in the form and click Generate</p>
              </div>
            )}
          </div>

          {/* Professional Voice Player */}
          {generatedContent && (
            <div className="mt-4 p-5 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-wide">CINEMATIC VOICEOVER</p>
                  <p className="text-xs text-gray-400">Professional advertising voice with background music</p>
                </div>
              </div>

              {/* Voice Selection */}
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full mb-3 p-3 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                {voiceProfiles.map(voice => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} - {voice.description}
                  </option>
                ))}
              </select>

              {/* Music Toggle */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/50 rounded-lg">
                <button
                  type="button"
                  onClick={() => setWithMusic(!withMusic)}
                  className={`w-12 h-6 rounded-full transition-colors ${withMusic ? 'bg-amber-500' : 'bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${withMusic ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <div>
                  <p className="text-sm font-medium text-white">Background Music</p>
                  <p className="text-xs text-gray-400">Ambient cinematic soundtrack</p>
                </div>
                <Music className={`w-5 h-5 ml-auto ${withMusic ? 'text-amber-500' : 'text-gray-500'}`} />
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/30"
                >
                  {speaking ? (
                    paused ? <Play className="w-6 h-6 text-white ml-1" /> : <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </button>
                <button
                  onClick={handleStop}
                  className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                >
                  <Square className="w-5 h-5 text-white" />
                </button>
                <div className="flex-1 ml-2">
                  <p className="text-sm font-semibold text-white">
                    {speaking ? (paused ? 'PAUSED' : 'PLAYING...') : 'READY'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {voiceProfiles.find(v => v.id === selectedVoice)?.name}
                    {withMusic && ' + Music'}
                  </p>
                </div>
                <Volume2 className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          )}

          {/* Video Generator */}
          {generatedContent && (
            <div className="mt-4 p-5 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 rounded-xl border border-purple-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-wide">CINEMATIC VIDEO</p>
                  <p className="text-xs text-purple-200">Professional video with moving visuals and effects</p>
                </div>
              </div>

              {!showVideo ? (
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg text-center">
                      <p className="text-xs text-purple-200">Duration</p>
                      <p className="text-sm font-bold text-white">15 sec</p>
                    </div>
                    <div className="p-2 bg-white/10 rounded-lg text-center">
                      <p className="text-xs text-purple-200">Resolution</p>
                      <p className="text-sm font-bold text-white">1080x1920</p>
                    </div>
                    <div className="p-2 bg-white/10 rounded-lg text-center">
                      <p className="text-xs text-purple-200">Platform</p>
                      <p className="text-sm font-bold text-white capitalize">{watchedPlatform || 'Instagram'}</p>
                    </div>
                  </div>

                  {isGeneratingVideo && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-purple-200 mb-1">
                        <span>Generating cinematic video...</span>
                        <span>{videoProgress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isGeneratingVideo ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Creating Cinematic Video...
                      </>
                    ) : (
                      <>
                        <Film className="w-4 h-4 mr-2" />
                        Generate Cinematic Video
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full max-w-[280px] mx-auto rounded-xl shadow-2xl border-2 border-purple-500"
                    style={{ maxHeight: '500px' }}
                  />
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleDownloadVideo} className="bg-gradient-to-r from-purple-600 to-pink-600" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download Video
                    </Button>
                    <Button onClick={() => { setShowVideo(false); setVideoUrl(null) }} variant="ghost" size="sm" className="text-white">
                      New Video
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
