import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, RefreshCw, ArrowRight, Copy, Minimize2, Maximize2, Languages, Smile, Frown } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import { useToast } from '../contexts/ToastContext'

const rewriteTools = [
  { id: 'rewrite', label: 'Rewrite', icon: RefreshCw, description: 'Rewrite the content with fresh wording' },
  { id: 'expand', label: 'Expand', icon: Maximize2, description: 'Add more detail and depth' },
  { id: 'shorten', label: 'Shorten', icon: Minimize2, description: 'Make it more concise' },
  { id: 'translate', label: 'Translate', icon: Languages, description: 'Translate to another language' },
  { id: 'humanize', label: 'Humanize', icon: Smile, description: 'Make it sound more natural' },
  { id: 'formal', label: 'Formal', icon: FileText, description: 'Make it more professional' },
]

const languages = [
  { value: 'english', label: 'English' },
  { value: 'french', label: 'French' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'kiswahili', label: 'Kiswahili' },
  { value: 'luganda', label: 'Luganda' },
]

export default function RewritePage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [activeTool, setActiveTool] = useState('rewrite')
  const [loading, setLoading] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState('french')
  const { addToast } = useToast()

  const handleRewrite = async () => {
    if (!input.trim()) {
      addToast('Please enter some text to rewrite', 'error')
      return
    }
    setLoading(true)
    // Simulate AI rewrite
    setTimeout(() => {
      setOutput(`[AI ${activeTool} output]\n\n${input}`)
      setLoading(false)
      addToast('Content rewritten!', 'success')
    }, 1500)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    addToast('Copied to clipboard!', 'success')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">AI Rewrite Tools</h1>
        <p className="text-secondary-500 mt-1">Transform and improve your content with AI</p>
      </div>

      {/* Tool Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {rewriteTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              activeTool === tool.id
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-950'
                : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300'
            }`}
          >
            <tool.icon className={`w-5 h-5 mb-2 ${activeTool === tool.id ? 'text-primary-600' : 'text-secondary-500'}`} />
            <p className={`text-sm font-medium ${activeTool === tool.id ? 'text-primary-600' : 'text-secondary-900 dark:text-white'}`}>
              {tool.label}
            </p>
            <p className="text-xs text-secondary-500 mt-0.5">{tool.description}</p>
          </button>
        ))}
      </div>

      {activeTool === 'translate' && (
        <div className="max-w-xs">
          <Select
            label="Target Language"
            options={languages}
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          />
        </div>
      )}

      {/* Editor */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Input Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste or type your content here..."
            className="w-full h-64 p-3 rounded-lg border border-secondary-300 bg-white text-sm resize-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-secondary-400">{input.length} characters</span>
            <Button onClick={handleRewrite} disabled={loading || !input.trim()}>
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  {activeTool === 'translate' ? 'Translate' : 'Rewrite'}
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Output
          </label>
          <div className="w-full h-64 p-3 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 text-sm overflow-auto whitespace-pre-wrap">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4" />
                <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-full" />
                <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-5/6" />
              </div>
            ) : output ? (
              <span className="text-secondary-900 dark:text-secondary-100">{output}</span>
            ) : (
              <span className="text-secondary-400">Rewritten content will appear here</span>
            )}
          </div>
          {output && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-secondary-400">{output.length} characters</span>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
