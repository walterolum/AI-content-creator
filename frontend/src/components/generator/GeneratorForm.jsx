import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  Wand2, Sparkles, Copy, Save, RefreshCw, Download,
  FileText, Image, Film, Music, Play, Pause, Upload,
  Volume2, Video, Mic, Camera, Square
} from 'lucide-react'
import Button from '../ui/Button'
import Select from '../ui/Select'
import Input from '../ui/Input'
import Card from '../ui/Card'
import FileUpload from '../ui/FileUpload'
import { useToast } from '../../contexts/ToastContext'
import { streamAI } from '../../lib/api'
import { speak, stopSpeech, pauseSpeech, resumeSpeech, isSpeaking, isPaused, voiceProfiles, getAvailableVoices } from '../../lib/audio'
import { generateVideo, downloadVideo, createVideoUrl } from '../../lib/video'

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
  const [selectedVoice, setSelectedVoice] = useState('professional-male')
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [activeTab, setActiveTab] = useState('content')
  const [videoUrl, setVideoUrl] = useState(null)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
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

  // Monitor speaking state
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

  // Audio controls
  const handlePlayPause = () => {
    if (speaking) {
      if (paused) {
        resumeSpeech()
      } else {
        pauseSpeech()
      }
    } else {
      speak(generatedContent, selectedVoice, () => {
        setSpeaking(false)
        setPaused(false)
      })
      setSpeaking(true)
    }
  }

  const handleStop = () => {
    stopSpeech()
    setSpeaking(false)
    setPaused(false)
  }

  // Video generation
  const handleGenerateVideo = async () => {
    if (!generatedContent) {
      addToast('Generate content first', 'error')
      return
    }

    setIsGeneratingVideo(true)
    addToast('Generating video...', 'info')

    try {
      const blob = await generateVideo(generatedContent, watchedPlatform || 'instagram', {
        duration: 15000,
        width: 1080,
        height: 1920,
      })
      const url = createVideoUrl(blob)
      setVideoUrl(url)
      setShowVideo(true)
      addToast('Video generated! Click play to preview.', 'success')
    } catch (error) {
      addToast('Failed to generate video', 'error')
      console.error('Video generation error:', error)
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  const handleDownloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement('a')
      a.href = videoUrl
      a.download = `content-video-${watchedPlatform || 'social'}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      addToast('Video downloaded!', 'success')
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
          uploadedFiles: uploadedFiles.map(f => ({ name: f.name, type: f.type })),
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
    { id: 'audio', label: 'Audio', icon: Music },
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

            {/* Image Upload Section */}
            {activeTab === 'media' && (
              <FileUpload onFilesChange={setUploadedFiles} maxFiles={5} />
            )}

            {/* Voice Selection */}
            {activeTab === 'audio' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Select Advertising Voice
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {voiceProfiles.map((voice) => (
                    <button
                      key={voice.id}
                      type="button"
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        selectedVoice === voice.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                          : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300'
                      }`}
                    >
                      <p className={`text-sm font-medium ${selectedVoice === voice.id ? 'text-primary-600' : 'text-secondary-900 dark:text-white'}`}>
                        {voice.name}
                      </p>
                      <p className="text-xs text-secondary-500 mt-0.5">{voice.description}</p>
                    </button>
                  ))}
                </div>
              </div>
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
                      <button onClick={() => handleDownload('json')} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Download JSON
                      </button>
                      <div className="border-t border-secondary-200 dark:border-secondary-700 my-1" />
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

          {/* Audio Player - Professional Voice */}
          {generatedContent && (
            <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 rounded-lg border border-primary-200 dark:border-primary-800">
              <div className="flex items-center gap-3 mb-3">
                <Mic className="w-5 h-5 text-primary-600" />
                <p className="text-sm font-semibold text-primary-900 dark:text-primary-100">Professional Voice Preview</p>
              </div>

              {/* Voice Selection */}
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full mb-3 p-2 rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-secondary-800 text-sm"
              >
                {voiceProfiles.map(voice => (
                  <option key={voice.id} value={voice.id}>{voice.name} - {voice.description}</option>
                ))}
              </select>

              {/* Audio Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  {speaking ? (
                    paused ? <Play className="w-5 h-5 text-white ml-0.5" /> : <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>
                <button
                  onClick={handleStop}
                  className="w-10 h-10 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center hover:bg-secondary-300 transition-colors"
                >
                  <Square className="w-4 h-4 text-secondary-600 dark:text-secondary-300" />
                </button>
                <div className="flex-1 ml-2">
                  <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                    {speaking ? (paused ? 'Paused' : 'Playing...') : 'Ready to play'}
                  </p>
                  <p className="text-xs text-primary-600 dark:text-primary-400">
                    No hashtags or emojis • Professional {voiceProfiles.find(v => v.id === selectedVoice)?.name}
                  </p>
                </div>
                <Volume2 className="w-5 h-5 text-primary-400" />
              </div>
            </div>
          )}

          {/* Video Player */}
          {generatedContent && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-3">
                <Video className="w-5 h-5 text-purple-600" />
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Video Generator</p>
              </div>

              {!showVideo ? (
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mb-3">
                    Generate an animated video for {watchedPlatform || 'social media'} with your content.
                  </p>
                  <Button
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isGeneratingVideo ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Creating Video...
                      </>
                    ) : (
                      <>
                        <Film className="w-4 h-4 mr-2" />
                        Generate Video
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
                    className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
                    style={{ maxHeight: '400px' }}
                  />
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleDownloadVideo} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download Video
                    </Button>
                    <Button onClick={() => { setShowVideo(false); setVideoUrl(null) }} variant="ghost" size="sm">
                      Generate New
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
