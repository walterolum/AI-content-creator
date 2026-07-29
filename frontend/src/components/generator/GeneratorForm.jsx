import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Wand2, Sparkles, RefreshCw, FileText, Image as ImageIcon, Clapperboard, FolderOpen, Zap } from 'lucide-react'
import Button from '../ui/Button'
import Select from '../ui/Select'
import Input from '../ui/Input'
import Card from '../ui/Card'
import FileUpload from '../ui/FileUpload'
import AdEditor from './AdEditor'
import TemplateManager from './TemplateManager'
import { useToast } from '../../contexts/ToastContext'
import { streamAI } from '../../lib/api'
import { generateScript, createEmptyScript, generateVoiceoverScript } from '../../lib/scriptWriter'

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

const MAX_STATEMENTS = 4

const videoTypes = [
  { value: 'commercial', label: 'Commercial Ad' },
  { value: 'social', label: 'Social Media' },
  { value: 'explainer', label: 'Explainer Video' },
  { value: 'educational', label: 'Educational' },
  { value: 'testimonial', label: 'Testimonial' },
]

export default function GeneratorForm() {
  const [generatedContent, setGeneratedContent] = useState('')
  const [generatedScript, setGeneratedScript] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [activeTab, setActiveTab] = useState('content')
  const [showEditor, setShowEditor] = useState(false)
  const [quickPrompt, setQuickPrompt] = useState('')
  const [isQuickCreating, setIsQuickCreating] = useState(false)
  const { addToast } = useToast()

  const quickCreate = async () => {
    if (!quickPrompt.trim()) { addToast('Enter a prompt', 'error'); return }
    setIsQuickCreating(true)
    try {
      const parsed = parseQuickPrompt(quickPrompt)
      Object.entries(parsed).forEach(([key, value]) => {
        if (value) setValue(key, value)
      })
      await onGenerate(parsed)
    } catch (e) {
      addToast('Quick create failed: ' + e.message, 'error')
      setIsQuickCreating(false)
    }
    setIsQuickCreating(false)
  }

  function parseQuickPrompt(prompt) {
    const lower = prompt.toLowerCase()
    const result = {
      businessType: 'business',
      platform: 'instagram',
      tone: 'professional',
      goal: 'engagement',
      audience: 'everyone',
      topic: prompt,
      keywords: '',
      videoType: 'commercial',
      language: 'english',
    }
    const platformMap = { instagram: 'instagram', facebook: 'facebook', linkedin: 'linkedin', tiktok: 'tiktok', twitter: 'x', youtube: 'youtube', threads: 'threads' }
    for (const [key, val] of Object.entries(platformMap)) {
      if (lower.includes(key)) result.platform = val
    }
    const toneMap = { luxury: 'luxury', professional: 'professional', funny: 'funny', friendly: 'friendly', inspirational: 'inspirational', persuasive: 'persuasive', educational: 'educational', corporate: 'corporate', youthful: 'youthful' }
    for (const [key, val] of Object.entries(toneMap)) {
      if (lower.includes(key)) result.tone = val
    }
    const bizMap = { restaurant: 'restaurant', fashion: 'fashion', salon: 'salon', beauty: 'salon', pharmacy: 'pharmacy', school: 'school', education: 'school', church: 'church', 'real estate': 'real-estate', hotel: 'hotel', 'coffee': 'coffee-shop', tech: 'technology', 'e-commerce': 'ecommerce', 'ecommerce': 'ecommerce', 'non-profit': 'ngo', 'ngo': 'ngo', agency: 'agency' }
    for (const [key, val] of Object.entries(bizMap)) {
      if (lower.includes(key)) result.businessType = val
    }
    const audMap = { teenager: 'teenagers', student: 'students', professional: 'professionals', parent: 'parents', 'business owner': 'business-owners', entrepreneur: 'business-owners' }
    for (const [key, val] of Object.entries(audMap)) {
      if (lower.includes(key)) result.audience = val
    }
    const goalMap = { sales: 'sales', awareness: 'awareness', leads: 'lead-generation', traffic: 'website-traffic', growth: 'brand-growth', engage: 'engagement' }
    for (const [key, val] of Object.entries(goalMap)) {
      if (lower.includes(key)) result.goal = val
    }
    const typeMap = { explainer: 'explainer', educational: 'educational', testimonial: 'testimonial', commercial: 'commercial', social: 'social', ad: 'commercial' }
    for (const [key, val] of Object.entries(typeMap)) {
      if (lower.includes(key)) result.videoType = val
    }
    return result
  }

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      businessType: '', platform: '', tone: 'professional',
      goal: 'engagement', audience: 'everyone', length: 'medium',
      language: 'english', topic: '', keywords: '', additionalInfo: '',
      videoType: 'commercial',
    }
  })

  const watchedPlatform = watch('platform')

  const onLoadTemplate = (settings) => {
    Object.entries(settings).forEach(([key, value]) => {
      setValue(key, value)
    })
    addToast('Template loaded', 'success')
  }

  const onGenerate = async (data) => {
    setIsGenerating(true)
    setGeneratedContent('')
    setGeneratedScript(null)
    setShowEditor(false)

    try {
      const scriptData = { ...data, maxStatements: MAX_STATEMENTS }
      let fullContent = ''
      await generateScript(scriptData, (chunk) => {
        fullContent += chunk
      })
      // Try to parse the final JSON as a structured script
      let script = null
      try {
        const cleaned = fullContent.replace(/^data:\s*\{/, '{').replace(/\}\s*data:\s*\[DONE\]/, '}')
        const lines = fullContent.split('\n')
        let jsonPart = ''
        for (const line of lines) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            try {
              const parsed = JSON.parse(line.slice(6))
              if (parsed.script) {
                script = parsed.script
                break
              }
            } catch (e) { jsonPart += line }
          }
        }
      } catch (e) { /* fallback */ }

      if (!script) {
        script = createEmptyScript({ ...data })
      }

      setGeneratedScript(script)
      const voiceText = script.scenes
        .filter(s => s.type !== 'closing')
        .map(s => s.narration)
        .join('. ')

      setGeneratedContent(voiceText || script.scenes.map(s => s.onScreenText).join('. '))
      addToast('Script generated! Opening studio...', 'success')
    } catch (error) {
      addToast(error.message || 'Failed to generate', 'error')
      setIsGenerating(false)
      return
    }
    setIsGenerating(false)
    setShowEditor(true)
  }

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'quick', label: 'Quick Create', icon: Zap },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white dark:bg-secondary-700 shadow text-primary-600' : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400'}`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">Create Your Ad</h2>
                <p className="text-xs text-secondary-500">Generate {MAX_STATEMENTS} statements for a 30-second professional advertisement</p>
              </div>
              <TemplateManager
                currentSettings={{
                  businessType: watch('businessType'),
                  platform: watch('platform'),
                  tone: watch('tone'),
                  goal: watch('goal'),
                  audience: watch('audience'),
                  topic: watch('topic'),
                  keywords: watch('keywords'),
                  videoType: watch('videoType'),
                  language: watch('language'),
                }}
                onLoad={onLoadTemplate}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="Business Type" placeholder="Select" options={businessTypes} error={errors.businessType?.message} {...register('businessType', { required: 'Required' })} />
              <Select label="Platform" placeholder="Select" options={platforms} error={errors.platform?.message} {...register('platform', { required: 'Required' })} />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <Select label="Tone" options={tones} {...register('tone')} />
              <Select label="Goal" options={goals} {...register('goal')} />
              <Select label="Audience" options={audiences} {...register('audience')} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="Length" options={lengths} {...register('length')} />
              <Select label="Language" options={languages} {...register('language')} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="Video Type" options={videoTypes} {...register('videoType')} />
            </div>

            <Input label="Topic / Product Name" placeholder="e.g., Nano Banana organic fruit snacks" error={errors.topic?.message} {...register('topic', { required: 'Required' })} />
            <Input label="Keywords (optional)" placeholder="e.g., organic, healthy, natural" {...register('keywords')} />
            <Input label="Additional Info (optional)" placeholder="Any special details..." {...register('additionalInfo')} />

            {activeTab === 'media' && (
              <div className="pt-2">
                <p className="text-xs text-secondary-500 mb-2">Upload product images to showcase in your video ad</p>
                <FileUpload onFilesChange={setUploadedFiles} maxFiles={5} />
              </div>
            )}

            {activeTab === 'quick' && (
              <div className="pt-2 space-y-3">
                <p className="text-xs text-secondary-500">Describe your video in plain English. AI will auto-detect settings and generate everything.</p>
                <textarea value={quickPrompt} onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder='e.g. "Create a 60-second luxury coffee advertisement targeting young professionals on Instagram"'
                  className="w-full h-28 rounded-xl bg-white/5 border border-white/10 text-white text-sm p-4 resize-none focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20" />
                <Button onClick={quickCreate} className="w-full bg-gradient-to-r from-purple-600 to-pink-600" disabled={isQuickCreating}>
                  {isQuickCreating ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : <><Zap className="w-4 h-4 mr-2" /> Quick Create Video</>}
                </Button>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
              {isGenerating ? (
                <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Writing script & storyboard...</>
              ) : (
                <><Clapperboard className="w-5 h-5 mr-2" /> Generate Video Script</>
              )}
            </Button>

            <p className="text-center text-[10px] text-secondary-400">
              AI builds a complete scene-by-scene script with narration, visuals, and timing
            </p>
          </form>
        </Card>
      </div>

      {/* Ad Editor - appears after generation */}
      {showEditor && generatedContent && (
        <div className="max-w-6xl mx-auto animate-fade-in">
          <AdEditor
            content={generatedContent}
            script={generatedScript}
            platform={watchedPlatform}
            images={uploadedFiles}
            onClose={() => setShowEditor(false)}
          />
        </div>
      )}
    </div>
  )
}
