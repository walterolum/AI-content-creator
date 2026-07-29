import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, Clock, TrendingUp, Zap, ChevronRight,
  Camera, Briefcase, MessageSquare, Hash, Play,
  ArrowRight, Plus,
} from 'lucide-react'
import GeneratorForm from '../components/generator/GeneratorForm'
import Card, { CardHeader, CardTitle } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const templates = [
  { id: 1, name: 'Product Launch', desc: 'Announce new products with impact', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { id: 2, name: 'Summer Sale', desc: 'Seasonal promotions that convert', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
  { id: 3, name: 'Company Update', desc: 'Share milestones and news', icon: Zap, color: 'from-blue-500 to-cyan-500' },
  { id: 4, name: 'Behind the Scenes', desc: 'Humanize your brand', icon: Play, color: 'from-green-500 to-emerald-500' },
]

const recentScripts = [
  { id: 1, title: 'Summer Sale Campaign', platform: 'Instagram', date: '2h ago', duration: '0:30' },
  { id: 2, title: 'Product Feature Highlight', platform: 'LinkedIn', date: '5h ago', duration: '0:45' },
  { id: 3, title: 'Customer Testimonial', platform: 'Facebook', date: '1d ago', duration: '0:60' },
]

const platformIcons = { Instagram: Camera, Linkedin: Briefcase, Facebook: MessageSquare, Twitter: Hash, TikTok: Play }

export default function GeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">AI Content Generator</h1>
          <p className="text-secondary-500 mt-1">Create professional social media content in seconds</p>
        </div>
        <Link to="/library">
          <Button variant="outline">
            <Clock className="w-4 h-4 mr-2" />
            View Library
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Quick Templates */}
          <div>
            <h2 className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Quick Start Templates
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {templates.map((template, i) => (
                <motion.button
                  key={template.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    selectedTemplate === template.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 shadow-sm'
                      : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-2`}>
                    <template.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">{template.name}</p>
                  <p className="text-xs text-secondary-500 mt-0.5">{template.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>

          <GeneratorForm templateId={selectedTemplate} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <Card>
            <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
            <div className="space-y-3">
              {[
                { label: 'This Week', value: '12', change: '+3', color: 'text-primary-600' },
                { label: 'Avg. Generation', value: '8s', change: '-2s', color: 'text-success-600' },
                { label: 'Templates Saved', value: '6', change: '', color: 'text-secondary-600' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-sm text-secondary-500">{stat.label}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-secondary-900 dark:text-white">{stat.value}</span>
                    {stat.change && (
                      <span className={`text-xs ${stat.color}`}>{stat.change}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Scripts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent</CardTitle>
                <Link to="/library" className="text-xs text-primary-600 hover:underline">View all</Link>
              </div>
            </CardHeader>
            <div className="space-y-1">
              {recentScripts.map((script) => {
                const Icon = platformIcons[script.platform] || Sparkles
                return (
                  <div key={script.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors cursor-pointer group">
                    <div className="w-7 h-7 rounded bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-secondary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-secondary-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                        {script.title}
                      </p>
                      <p className="text-[10px] text-secondary-400">{script.platform} &bull; {script.duration}</p>
                    </div>
                    <span className="text-[10px] text-secondary-400">{script.date}</span>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader><CardTitle>Pro Tips</CardTitle></CardHeader>
            <div className="space-y-2 text-sm text-secondary-500">
              <p>&bull; Use specific goals for better results</p>
              <p>&bull; Add visual descriptions for richer content</p>
              <p>&bull; Save templates to reuse later</p>
              <p>&bull; Try different tones for the same topic</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
