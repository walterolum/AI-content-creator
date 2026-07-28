import { useState, useRef, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
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
  isSpeaking, isPaused, voiceProfiles, cleanContentForSpeech
} from '../../lib/audio'
import {
  generateAdVideo, generateVoiceoverScript,
  createVideoUrl, downloadVideo
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
  const [adPlaying, setAdPlaying] = useState(false)
  const [currentCaption, setCurrentCaption] = useState('')
  const videoRef = useRef(null)
  const captionIntervalRef = useRef(null)
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

  // Cleanup caption interval
  useEffect(() => {
    return () => {
      if (captionIntervalRef.current) {
        clearInterval(captionIntervalRef.current)
      }
    }
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

  // Play advertisement with voiceover and captions
  const handlePlayAd = useCallback(() => {
    if (speaking) {
      if (paused) {
        resumeSpeech()
      } else {
        pauseSpeech()
      }
      return
    }

    // Clean content for voice
    const voiceText = generateVoiceoverScript(generatedContent)

    // Split into caption chunks
    const sentences = voiceText.split(/[.!?]+/).filter(s => s.trim().length > 5)
    let captionIndex = 0

    // Show captions synchronized with voice
    setCurrentCaption(sentences[0]?.trim() + '.' || '')

    captionIntervalRef.current = setInterval(() => {
      captionIndex++
      if (captionIndex < sentences.length) {
        setCurrentCaption(sentences[captionIndex].trim() + '.')
      } else {
        clearInterval(captionIntervalRef.current)
      }
    }, 3000) // Change caption every 3 seconds

    // Start voiceover
    speak(generatedContent, selectedVoice, withMusic, () => {
      setSpeaking(false)
      setPaused(false)
      clearInterval(captionIntervalRef.current)
      setCurrentCaption('')
    })

    setSpeaking(true)
    setAdPlaying(true)
    addToast('Playing advertisement with voiceover...', 'info')
  }, [generatedContent, selectedVoice, withMusic, speaking, paused, addToast])

  const handleStopAd = () => {
    stopSpeech()
    setSpeaking(false)
    setPaused(false)
    setAdPlaying(false)
    setCurrentCaption('')
    if (captionIntervalRef.current) {
      clearInterval(captionIntervalRef.current)
    }
  }

  // Generate and play video with voiceover
  const handleGenerateVideo = async () => {
    if (!generatedContent) {
      addToast('Generate content first', 'error')
      return
    }

    setIsGeneratingVideo(true)
    setVideoProgress(0)
    addToast('Creating 30-second professional advertisement...', 'info')

    const progressInterval = setInterval(() => {
      setVideoProgress(prev => Math.min(prev + 3, 90))
    }, 500)

    try {
      const blob = await generateAdVideo(generatedContent, watchedPlatform || 'instagram', {
        duration: 30000,
        width: 1080,
        height: 1920,
      })
      const url = createVideoUrl(blob)
      setVideoUrl(url)
      setShowVideo(true)
      setVideoProgress(100)
      addToast('Advertisement ready! Click play to watch with voiceover.', 'success')
    } catch (error) {
      addToast('Failed to generate video', 'error')
      console.error('Video generation error:', error)
    } finally {
      setIsGeneratingVideo(false)
      clearInterval(progressInterval)
    }
  }

  // Play video with synchronized voiceover
  const handlePlayVideoWithVoice = () => {
    if (videoRef.current) {
      videoRef.current.play()

      // Start voiceover after a short delay
      setTimeout(() => {
        const voiceText = generateVoiceoverScript(generatedContent)
        const sentences = voiceText.split(/[.!?]+/).filter(s => s.trim().length > 5)
        let captionIndex = 0

        setCurrentCaption(sentences[0]?.trim() + '.' || '')

        captionIntervalRef.current = setInterval(() => {
          captionIndex++
          if (captionIndex < sentences.length) {
            setCurrentCaption(sentences[captionIndex].trim() + '.')
          } else {
            clearInterval(captionIntervalRef.current)
          }
        }, 3000)

        speak(generatedContent, selectedVoice, withMusic, () => {
          setSpeaking(false)
          setCurrentCaption('')
          if (captionIntervalRef.current) {
            clearInterval(captionIntervalRef.current)
          }
        })

        setSpeaking(true)
      }, 500)
    }
  }

  const handleDownloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement('a')
      a.href = videoUrl
      a.download = `advertisement-${watchedPlatform || 'social'}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      addToast('Advertisement downloaded!', 'success')
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
                      <button onClick={handleGenerateVideo} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 flex items-center gap-2">
                        <Video className="w-4 h-4" /> Generate Video Ad
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Content Display */}
          <div className="min-h-[300px] rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 p-4">
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
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
                {generatedContent}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <Sparkles className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mb-4" />
                <p className="text-secondary-500">Your AI-generated content will appear here</p>
                <p className="text-sm text-secondary-400 mt-1">Fill in the form and click Generate</p>
              </div>
            )}
          </div>

          {/* Live Caption Display */}
          {currentCaption && (
            <div className="mt-4 p-4 bg-black rounded-lg">
              <p className="text-center text-white text-lg font-medium animate-pulse">
                {currentCaption}
              </p>
            </div>
          )}

          {/* Professional Ad Player */}
          {generatedContent && (
            <div className="mt-4 p-5 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl border border-amber-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-400 tracking-widest">PROFESSIONAL ADVERTISEMENT</p>
                  <p className="text-xs text-gray-400">30-sec voiceover with synchronized captions</p>
                </div>
              </div>

              {/* Voice Selection */}
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full mb-3 p-3 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm focus:border-amber-500"
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
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Background Music</p>
                  <p className="text-xs text-gray-400">Cinematic ambient soundtrack</p>
                </div>
                <Music className={`w-5 h-5 ${withMusic ? 'text-amber-500' : 'text-gray-500'}`} />
              </div>

              {/* Ad Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayAd}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/30"
                >
                  {speaking ? (
                    paused ? <Play className="w-7 h-7 text-white ml-1" /> : <Pause className="w-7 h-7 text-white" />
                  ) : (
                    <Play className="w-7 h-7 text-white ml-1" />
                  )}
                </button>
                <button
                  onClick={handleStopAd}
                  className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                >
                  <Square className="w-5 h-5 text-white" />
                </button>
                <div className="flex-1 ml-2">
                  <p className="text-sm font-bold text-white">
                    {speaking ? (paused ? 'PAUSED' : 'PLAYING AD...') : 'READY TO PLAY'}
                  </p>
                  <p className="text-xs text-amber-400">
                    Voice: {voiceProfiles.find(v => v.id === selectedVoice)?.name}
                    {withMusic && ' + Music'}
                  </p>
                </div>
                <Volume2 className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          )}

          {/* Video Player with Voiceover */}
          {generatedContent && (
            <div className="mt-4 p-5 bg-gradient-to-br from-purple-900 via-black to-pink-900 rounded-xl border border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-purple-400 tracking-widest">VIDEO ADVERTISEMENT</p>
                  <p className="text-xs text-gray-400">30-sec video with voiceover and captions</p>
                </div>
              </div>

              {!showVideo ? (
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="p-3 bg-white/10 rounded-lg text-center">
                      <p className="text-xs text-purple-200">Duration</p>
                      <p className="text-lg font-bold text-white">30s</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg text-center">
                      <p className="text-xs text-purple-200">Resolution</p>
                      <p className="text-lg font-bold text-white">1080p</p>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg text-center">
                      <p className="text-xs text-purple-200">Format</p>
                      <p className="text-lg font-bold text-white">9:16</p>
                    </div>
                  </div>

                  {isGeneratingVideo && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-purple-200 mb-1">
                        <span>Rendering professional advertisement...</span>
                        <span>{videoProgress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-4"
                  >
                    {isGeneratingVideo ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Creating Professional Advertisement...
                      </>
                    ) : (
                      <>
                        <Film className="w-5 h-5 mr-2" />
                        Generate 30-Second Video Ad
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Video with overlay captions */}
                  <div className="relative rounded-xl overflow-hidden shadow-2xl">
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full max-w-[300px] mx-auto"
                      style={{ maxHeight: '500px' }}
                      onPlay={() => {
                        setAdPlaying(true)
                        handlePlayVideoWithVoice()
                      }}
                      onPause={() => {
                        setAdPlaying(false)
                      }}
                    />

                    {/* Overlay Captions */}
                    {currentCaption && (
                      <div className="absolute bottom-20 left-4 right-4">
                        <div className="bg-black/70 rounded-lg p-3">
                          <p className="text-center text-white text-sm font-medium">
                            {currentCaption}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Controls */}
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleDownloadVideo} className="bg-gradient-to-r from-purple-600 to-pink-600" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download Video
                    </Button>
                    <Button onClick={() => { setShowVideo(false); setVideoUrl(null); handleStopAd() }} variant="ghost" size="sm" className="text-white border border-white/20">
                      New Ad
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
