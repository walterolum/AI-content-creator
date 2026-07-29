import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Wand2, Sparkles, RefreshCw, FileText, Image as ImageIcon } from 'lucide-react'
import Button from '../ui/Button'
import Select from '../ui/Select'
import Input from '../ui/Input'
import Card from '../ui/Card'
import FileUpload from '../ui/FileUpload'
import AdEditor from './AdEditor'
import { useToast } from '../../contexts/ToastContext'
import { streamAI } from '../../lib/api'

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

export default function GeneratorForm() {
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [activeTab, setActiveTab] = useState('content')
  const [showEditor, setShowEditor] = useState(false)
  const { addToast } = useToast()

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      businessType: '', platform: '', tone: 'professional',
      goal: 'engagement', audience: 'everyone', length: 'medium',
      language: 'english', topic: '', keywords: '', additionalInfo: '',
    }
  })

  const watchedPlatform = watch('platform')

  const onGenerate = async (data) => {
    setIsGenerating(true)
    setGeneratedContent('')
    setShowEditor(false)

    try {
      const prompt = `Generate a ${data.tone} advertisement for ${data.businessType} on ${data.platform}.
Topic: ${data.topic}
Keywords: ${data.keywords || 'none'}
Goal: ${data.goal} — ${data.goal === 'sales' ? 'drive purchases' : data.goal === 'engagement' ? 'spark conversation' : data.goal === 'awareness' ? 'build recognition' : data.goal === 'lead-generation' ? 'generate leads' : data.goal === 'website-traffic' ? 'drive traffic' : 'grow the brand'}
Audience: ${data.audience}
Language: ${data.language}
Tone: ${data.tone}

CRITICAL RULES — YOU MUST FOLLOW EVERY RULE:
1. Write EXACTLY ${MAX_STATEMENTS} short, punchy statements (no more, no less).
2. Each statement must be ONE short, catchy sentence — maximum 15 words each.
3. Every statement must match the "${data.tone}" tone and speak directly to "${data.audience}" audience.
4. Every statement must serve the goal "${data.goal}" — each line must help achieve this goal.
5. Structure: Hook → Problem → Solution → Call-to-Action.
6. Total must fit in a 30-second voiceover (keep it tight).
7. Do NOT use hashtags, markdown, section headers, or emojis unless the tone is "funny" or "youthful".
8. Write in ${data.language}.`

      await streamAI('/ai/generate', { ...data, systemPrompt: prompt, maxStatements: MAX_STATEMENTS }, (chunk) => {
        setGeneratedContent(prev => prev + chunk)
      })
      addToast('Content generated! Opening editor...', 'success')
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
              <div>
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">Create Your Ad</h2>
                <p className="text-xs text-secondary-500">Generate {MAX_STATEMENTS} statements for a 30-second professional advertisement</p>
              </div>
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

            <Input label="Topic / Product Name" placeholder="e.g., Nano Banana organic fruit snacks" error={errors.topic?.message} {...register('topic', { required: 'Required' })} />
            <Input label="Keywords (optional)" placeholder="e.g., organic, healthy, natural" {...register('keywords')} />
            <Input label="Additional Info (optional)" placeholder="Any special details..." {...register('additionalInfo')} />

            {activeTab === 'media' && (
              <div className="pt-2">
                <p className="text-xs text-secondary-500 mb-2">Upload product images to showcase in your video ad</p>
                <FileUpload onFilesChange={setUploadedFiles} maxFiles={5} />
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
              {isGenerating ? (
                <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Generating {MAX_STATEMENTS} statements...</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" /> Generate Advertisement</>
              )}
            </Button>

            <p className="text-center text-[10px] text-secondary-400">
              AI generates exactly {MAX_STATEMENTS} persuasive statements for your 30-second ad
            </p>
          </form>
        </Card>
      </div>

      {/* Ad Editor - appears after generation */}
      {showEditor && generatedContent && (
        <div className="max-w-6xl mx-auto animate-fade-in">
          <AdEditor
            content={generatedContent}
            platform={watchedPlatform}
            images={uploadedFiles}
            onClose={() => setShowEditor(false)}
          />
        </div>
      )}
    </div>
  )
}
