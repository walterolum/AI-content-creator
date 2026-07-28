import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  Wand2, Sparkles, Copy, Save, RefreshCw, Download,
  FileText, Image, Film, Music, Play, Pause, Upload,
  Volume2, Video, Mic, Camera
} from 'lucide-react'
import Button from '../ui/Button'
import Select from '../ui/Select'
import Input from '../ui/Input'
import Card from '../ui/Card'
import FileUpload from '../ui/FileUpload'
import { useToast } from '../../contexts/ToastContext'
import { streamAI } from '../../lib/api'
import { generateSpeech, stopSpeech } from '../../lib/audio'
import { downloadVideoScript, generateVideoScript } from '../../lib/video'

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
  const [isPlaying, setIsPlaying] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [activeTab, setActiveTab] = useState('content')
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

  const onGenerate = async (data) => {
    setIsGenerating(true)
    setGeneratedContent('')

    try {
      // Include uploaded file info in the request
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

  const handleAudioPlay = () => {
    if (isPlaying) {
      stopSpeech()
      setIsPlaying(false)
    } else {
      const textOnly = generatedContent.replace(/[#*`\n]/g, ' ').substring(0, 500)
      generateSpeech(textOnly, { rate: 0.9 })
      setIsPlaying(true)
      addToast('Playing audio preview...', 'info')
      setTimeout(() => setIsPlaying(false), 30000)
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
          uploadedFiles: uploadedFiles.map(f => ({ name: f.name, type: f.type })),
          date: new Date().toISOString()
        }, null, 2)
        downloadFile(json, `${filename}.json`, 'application/json')
        break
      case 'video-script':
        const script = generateVideoScript(generatedContent, watchedPlatform || 'tiktok')
        downloadFile(script, `${filename}-video-script.txt`, 'text/plain')
        break
      case 'audio':
        handleAudioPlay()
        addToast('Playing audio. Use screen recording to save.', 'info')
        return
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
                {/* Audio Play Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAudioPlay}
                  title="Listen to content"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
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
                        <FileText className="w-4 h-4" /> Download as TXT
                      </button>
                      <button onClick={() => handleDownload('md')} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Download as Markdown
                      </button>
                      <button onClick={() => handleDownload('html')} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Download as HTML
                      </button>
                      <button onClick={() => handleDownload('json')} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Download as JSON
                      </button>
                      <div className="border-t border-secondary-200 dark:border-secondary-700 my-1" />
                      <button onClick={() => handleDownload('video-script')} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 flex items-center gap-2">
                        <Video className="w-4 h-4" /> Download Video Script
                      </button>
                      <button onClick={() => handleDownload('audio')} className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800 flex items-center gap-2">
                        <Music className="w-4 h-4" /> Play as Audio
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

          {/* Audio Player */}
          {generatedContent && (
            <div className="mt-4 p-4 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAudioPlay}
                  className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">Audio Preview</p>
                  <p className="text-xs text-secondary-500">
                    {isPlaying ? 'Playing content as speech...' : 'Click to listen to your content'}
                  </p>
                </div>
                <Mic className="w-5 h-5 text-secondary-400" />
              </div>
            </div>
          )}

          {/* Video Script Preview */}
          {generatedContent && watchedPlatform && (
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-5 h-5 text-purple-600" />
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  Video Script Available for {watchedPlatform}
                </p>
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mb-3">
                Download a complete video script with hooks, timing, and visual notes.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload('video-script')}
                className="border-purple-300 text-purple-600 hover:bg-purple-100"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Video Script
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
