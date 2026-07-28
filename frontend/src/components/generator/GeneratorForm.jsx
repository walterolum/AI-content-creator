import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Sparkles, Copy, Save, RefreshCw, Download } from 'lucide-react'
import Button from '../ui/Button'
import Select from '../ui/Select'
import Input from '../ui/Input'
import Card from '../ui/Card'
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

export default function GeneratorForm() {
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('caption')
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

  const buildPrompt = (data) => {
    return `You are an expert social media content creator. Generate a ${data.length} ${data.tone} ${data.platform} post for a ${data.businessType} business.

Topic/Purpose: ${data.topic}
Goal: ${data.goal}
Target Audience: ${data.audience}
Language: ${data.language}
${data.keywords ? `Keywords to include: ${data.keywords}` : ''}
${data.additionalInfo ? `Additional context: ${data.additionalInfo}` : ''}

Please generate the following:
1. A compelling hook (first line)
2. A full caption/post
3. A call-to-action (CTA)
4. 10-15 relevant hashtags
5. 5 emoji suggestions
6. Image prompt suggestion for this post
7. 3 story ideas related to this post
8. 2 poll question ideas

Format your response with clear sections using markdown headers.`
  }

  const onGenerate = async (data) => {
    setIsGenerating(true)
    setGeneratedContent('')

    try {
      const prompt = buildPrompt(data)
      await streamAI('/ai/generate', { prompt, ...data }, (chunk) => {
        setGeneratedContent(prev => prev + chunk)
      })
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

  return (
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
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

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
      </Card>
    </div>
  )
}
