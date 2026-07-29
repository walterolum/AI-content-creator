import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, RefreshCw, ArrowRight, Copy, Minimize2, Maximize2,
  Languages, Smile, Frown, History, Download, Eye, EyeOff,
  RotateCcw, Check, X, ChevronRight, Clock, Bookmark,
  Trash2, Sparkles, Split,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import { useToast } from '../contexts/ToastContext'
import { formatDate } from '../lib/utils'

const rewriteTools = [
  { id: 'rewrite', label: 'Rewrite', icon: RefreshCw, description: 'Fresh wording, same meaning', color: 'from-blue-500 to-cyan-500' },
  { id: 'expand', label: 'Expand', icon: Maximize2, description: 'Add more detail and depth', color: 'from-emerald-500 to-teal-500' },
  { id: 'shorten', label: 'Shorten', icon: Minimize2, description: 'Make it more concise', color: 'from-amber-500 to-orange-500' },
  { id: 'translate', label: 'Translate', icon: Languages, description: 'Translate to another language', color: 'from-purple-500 to-pink-500' },
  { id: 'humanize', label: 'Humanize', icon: Smile, description: 'Make it sound more natural', color: 'from-rose-500 to-red-500' },
  { id: 'formal', label: 'Formal', icon: FileText, description: 'Make it more professional', color: 'from-slate-500 to-gray-500' },
]

const languages = [
  { value: 'english', label: 'English' },
  { value: 'french', label: 'French' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'kiswahili', label: 'Kiswahili' },
  { value: 'luganda', label: 'Luganda' },
  { value: 'german', label: 'German' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'italian', label: 'Italian' },
  { value: 'dutch', label: 'Dutch' },
  { value: 'yoruba', label: 'Yoruba' },
  { value: 'hausa', label: 'Hausa' },
]

const mockHistory = [
  { id: 1, tool: 'rewrite', input: 'Our product is the best in the market', output: 'Our product leads the market with unmatched quality and performance', date: '2026-07-28' },
  { id: 2, tool: 'translate', input: 'Welcome to our platform', output: 'Bienvenue sur notre plateforme', date: '2026-07-27' },
  { id: 3, tool: 'shorten', input: 'We would like to take this opportunity to inform you about our new features that we have recently launched', output: 'Check out our new features!', date: '2026-07-26' },
]

export default function RewritePage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [activeTool, setActiveTool] = useState('rewrite')
  const [loading, setLoading] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState('french')
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState(mockHistory)
  const [compareMode, setCompareMode] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const { addToast } = useToast()

  const handleRewrite = async () => {
    if (!input.trim()) {
      addToast('Please enter some text to rewrite', 'error')
      return
    }
    setLoading(true)
    setCompareMode(false)
    setTimeout(() => {
      const result = generateMockOutput(input, activeTool, targetLanguage)
      setOutput(result)
      setLoading(false)
      setHistory(prev => [{ id: Date.now(), tool: activeTool, input: input.slice(0, 80), output: result.slice(0, 80), date: new Date().toISOString().split('T')[0] }, ...prev])
      addToast('Content rewritten!', 'success')
    }, 1500)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    addToast('Copied to clipboard!', 'success')
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setCompareMode(false)
  }

  const handleHistorySelect = (item) => {
    setInput(item.input.length > 80 ? item.input + ' ' : item.input)
    setOutput(item.output)
    setActiveTool(item.tool)
    addToast('Loaded from history', 'info')
  }

  const handleDeleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(h => h.id !== id))
    addToast('Removed from history', 'success')
  }

  const getToolColor = (id) => rewriteTools.find(t => t.id === id)?.color || 'from-gray-500 to-gray-500'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">AI Rewrite Tools</h1>
          <p className="text-secondary-500 mt-1">Transform and improve your content with AI in multiple ways</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
            <Clock className="w-4 h-4 mr-2" />
            History ({history.length})
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Tool Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {rewriteTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  activeTool === tool.id
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 shadow-lg shadow-primary-500/10'
                    : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600 hover:shadow-sm'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-2`}>
                  <tool.icon className="w-4 h-4 text-white" />
                </div>
                <p className={`text-sm font-medium ${activeTool === tool.id ? 'text-primary-600' : 'text-secondary-900 dark:text-white'}`}>
                  {tool.label}
                </p>
                <p className="text-[10px] text-secondary-500 mt-0.5 leading-tight">{tool.description}</p>
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
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Input Text
                </label>
                <span className="text-xs text-secondary-400">{input.length} chars</span>
              </div>
              <textarea
                value={input}
                onChange={(e) => { setInput(e.target.value); setCharCount(e.target.value.length) }}
                placeholder="Paste or type your content here..."
                className="w-full h-56 p-3 rounded-lg border border-secondary-300 bg-white text-sm resize-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white transition-all"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary-400">{input.split(/\s+/).filter(Boolean).length} words</span>
                  {input && (
                    <button onClick={() => { setInput(''); setOutput('') }} className="text-xs text-danger-500 hover:underline">
                      Clear
                    </button>
                  )}
                </div>
                <Button onClick={handleRewrite} disabled={loading || !input.trim()}>
                  {loading ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                  ) : (
                    <><ArrowRight className="w-4 h-4 mr-2" /> {activeTool === 'translate' ? 'Translate' : 'Rewrite'}</>
                  )}
                </Button>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  {compareMode ? 'Original (vs Rewritten)' : 'Output'}
                </label>
                <div className="flex items-center gap-1">
                  {output && (
                    <button onClick={() => setCompareMode(!compareMode)} className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${compareMode ? 'bg-primary-100 text-primary-600' : 'hover:bg-secondary-100'}`}>
                      <Split className="w-3 h-3" /> Compare
                    </button>
                  )}
                </div>
              </div>
              {compareMode && output ? (
                <div className="w-full h-56 rounded-lg overflow-auto">
                  <div className="grid grid-cols-2 gap-2 h-full">
                    <div className="p-3 bg-danger-50/50 dark:bg-danger-950/20 text-sm whitespace-pre-wrap overflow-y-auto border border-danger-200 dark:border-danger-800 rounded-lg">
                      <p className="text-[10px] font-semibold text-danger-500 uppercase mb-1">Original</p>
                      <span className="text-secondary-700 dark:text-secondary-300">{input}</span>
                    </div>
                    <div className="p-3 bg-success-50/50 dark:bg-success-950/20 text-sm whitespace-pre-wrap overflow-y-auto border border-success-200 dark:border-success-800 rounded-lg">
                      <p className="text-[10px] font-semibold text-success-500 uppercase mb-1">Rewritten</p>
                      <span className="text-secondary-700 dark:text-secondary-300">{output}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-56 p-3 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 text-sm overflow-auto whitespace-pre-wrap">
                  {loading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4" />
                      <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-full" />
                      <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-5/6" />
                      <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-2/3" />
                    </div>
                  ) : output ? (
                    <span className="text-secondary-900 dark:text-secondary-100">{output}</span>
                  ) : (
                    <span className="text-secondary-400">Rewritten content will appear here</span>
                  )}
                </div>
              )}
              {output && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-secondary-400">{output.length} chars | {output.split(/\s+/).filter(Boolean).length} words</span>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setInput(output); setOutput(''); addToast('Moved to input', 'info') }}>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <Card>
            <h3 className="font-semibold text-secondary-900 dark:text-white text-sm mb-3">Quick Stats</h3>
            <div className="space-y-2">
              {[
                { label: 'Total Rewrites', value: history.length.toString() },
                { label: 'Today', value: history.filter(h => h.date === new Date().toISOString().split('T')[0]).length.toString() },
                { label: 'Fav Tool', value: (() => { const counts = {}; history.forEach(h => { counts[h.tool] = (counts[h.tool] || 0) + 1 }); return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-' })() },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-xs text-secondary-500">{stat.label}</span>
                  <span className="text-sm font-bold text-secondary-900 dark:text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* History */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-secondary-900 dark:text-white text-sm">History</h3>
                    <Bookmark className="w-4 h-4 text-secondary-400" />
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {history.length === 0 ? (
                      <p className="text-xs text-secondary-400 text-center py-4">No history yet</p>
                    ) : (
                      history.map(item => (
                        <div key={item.id} className="group flex items-center gap-2 p-2 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors cursor-pointer" onClick={() => handleHistorySelect(item)}>
                          <div className={`w-6 h-6 rounded bg-gradient-to-br ${getToolColor(item.tool)} flex items-center justify-center`}>
                            <FileText className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-secondary-900 dark:text-white truncate capitalize">{item.tool}</p>
                            <p className="text-[10px] text-secondary-400 truncate">{item.input}</p>
                          </div>
                          <span className="text-[10px] text-secondary-400 shrink-0">{formatDate(item.date)}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteHistoryItem(item.id) }} className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-danger-50 rounded">
                            <Trash2 className="w-3 h-3 text-danger-500" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips */}
          <Card>
            <h3 className="font-semibold text-secondary-900 dark:text-white text-sm mb-3">Pro Tips</h3>
            <div className="space-y-2 text-xs text-secondary-500">
              {[
                'Use "Expand" for social media posts',
                '"Shorten" works great for ad copy',
                'Translate maintains tone across languages',
                '"Humanize" removes AI-sounding phrases',
                'Use "Formal" for business communications',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Sparkles className="w-3 h-3 text-primary-500 mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function generateMockOutput(input, tool, lang) {
  const prefixes = {
    rewrite: ['Here is a fresh take:', 'Consider this version:', 'A polished alternative:'],
    expand: ['Here is an expanded version:', 'Let me elaborate:', 'With more detail:'],
    shorten: ['In short:', 'To summarize:', 'Concise version:'],
    humanize: ['A more natural version:', 'Here it is in plain language:', 'Conversational style:'],
    formal: ['Formal version:', 'Professional tone:', 'Business-ready:'],
    translate: [`[${lang.charAt(0).toUpperCase() + lang.slice(1)} translation]:`],
  }
  const prefix = prefixes[tool]?.[Math.floor(Math.random() * prefixes[tool].length)] || ''
  return `${prefix}\n\n${input}`
}
