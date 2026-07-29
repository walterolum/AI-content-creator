import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, ChevronLeft, ChevronRight, Plus, Download, Sparkles,
  Grid, List, Clock, Edit3, Trash2, GripVertical,
  Camera, Briefcase, MessageSquare, Hash, Play,
  Sun, Moon, Sunrise, Sunset,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import { useToast } from '../contexts/ToastContext'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const platformConfig = {
  instagram: { icon: Camera, color: 'from-purple-500 to-pink-500', label: 'Instagram' },
  linkedin: { icon: Briefcase, color: 'bg-blue-700', label: 'LinkedIn' },
  facebook: { icon: MessageSquare, color: 'bg-blue-600', label: 'Facebook' },
  x: { icon: Hash, color: 'bg-secondary-900 dark:bg-secondary-700', label: 'X' },
  tiktok: { icon: Play, color: 'bg-black', label: 'TikTok' },
}

const initialPosts = [
  { id: 'p1', date: 15, title: 'Summer Sale Launch', platform: 'instagram', time: '09:00', status: 'published', mood: 'energetic' },
  { id: 'p2', date: 18, title: 'Product Feature', platform: 'linkedin', time: '10:30', status: 'draft', mood: 'professional' },
  { id: 'p3', date: 22, title: 'Customer Story', platform: 'facebook', time: '14:00', status: 'scheduled', mood: 'warm' },
  { id: 'p4', date: 25, title: 'Behind the Scenes', platform: 'tiktok', time: '16:00', status: 'scheduled', mood: 'fun' },
  { id: 'p5', date: 28, title: 'Weekly Tips', platform: 'x', time: '08:00', status: 'draft', mood: 'educational' },
  { id: 'p6', date: 15, title: 'Team Spotlight', platform: 'linkedin', time: '12:00', status: 'scheduled', mood: 'professional' },
  { id: 'p7', date: 22, title: 'Product Demo', platform: 'instagram', time: '11:00', status: 'draft', mood: 'energetic' },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [posts, setPosts] = useState(initialPosts)
  const [dragId, setDragId] = useState(null)
  const { addToast } = useToast()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1))

  const handleGenerateCalendar = () => setShowGenerateModal(true)

  const generateAI = () => {
    const newPosts = [
      { id: `ai-${Date.now()}-1`, date: Math.min(28, daysInMonth), title: 'Monday Motivation', platform: 'instagram', time: '09:00', status: 'draft', mood: 'energetic' },
      { id: `ai-${Date.now()}-2`, date: Math.min(15, daysInMonth), title: 'Industry Insights', platform: 'linkedin', time: '10:00', status: 'draft', mood: 'professional' },
      { id: `ai-${Date.now()}-3`, date: Math.min(20, daysInMonth), title: 'Weekend Vibes', platform: 'tiktok', time: '16:00', status: 'draft', mood: 'fun' },
    ]
    setPosts(prev => [...prev, ...newPosts])
    setShowGenerateModal(false)
    addToast('Calendar generated with 3 new posts!', 'success')
  }

  const handleDragStart = (id) => setDragId(id)

  const handleDrop = (newDate) => {
    if (!dragId) return
    setPosts(prev => prev.map(p => p.id === dragId ? { ...p, date: newDate } : p))
    setDragId(null)
  }

  const handleDelete = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id))
    addToast('Post removed from calendar', 'success')
  }

  const statusCounts = {
    published: posts.filter(p => p.status === 'published').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    draft: posts.filter(p => p.status === 'draft').length,
  }

  const weekDays = []
  const today_idx = new Date().getDay()
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - today_idx + i)
    weekDays.push(d)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Content Calendar</h1>
          <p className="text-secondary-500 mt-1">{posts.length} posts scheduled</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`p-2 rounded transition-all ${viewMode === 'month' ? 'bg-white dark:bg-secondary-700 shadow-sm' : 'hover:bg-secondary-200 dark:hover:bg-secondary-700'}`}
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`p-2 rounded transition-all ${viewMode === 'week' ? 'bg-white dark:bg-secondary-700 shadow-sm' : 'hover:bg-secondary-200 dark:hover:bg-secondary-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button variant="outline" onClick={handleGenerateCalendar}>
            <Sparkles className="w-4 h-4 mr-2" /> AI Generate
          </Button>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Add Post</Button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-success-500" />
          {statusCounts.published} Published
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-warning-500" />
          {statusCounts.scheduled} Scheduled
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-secondary-400" />
          {statusCounts.draft} Drafts
        </span>
      </div>

      {viewMode === 'month' ? (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">{months[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-sm font-medium text-secondary-500 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px] rounded-lg bg-secondary-50 dark:bg-secondary-800/20" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayPosts = posts.filter(p => p.date === day)
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()
              const hasOverflow = dayPosts.length > 3

              return (
                <div
                  key={day}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(day)}
                  className={`min-h-[100px] rounded-lg border p-1.5 text-sm transition-all ${
                    isToday
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-1 ring-primary-500/30'
                      : 'border-secondary-200 dark:border-secondary-800 hover:border-secondary-300 dark:hover:border-secondary-700'
                  } ${dragId ? 'border-dashed' : ''}`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                    isToday ? 'bg-primary-600 text-white' : 'text-secondary-700 dark:text-secondary-300'
                  }`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayPosts.slice(0, 3).map((post) => {
                      const pf = platformConfig[post.platform]
                      const Icon = pf?.icon || Calendar
                      return (
                        <div
                          key={post.id}
                          draggable
                          onDragStart={() => handleDragStart(post.id)}
                          className="group relative flex items-center gap-1 text-[10px] text-white px-1.5 py-1 rounded bg-gradient-to-r cursor-grab active:cursor-grabbing hover:opacity-90 transition-opacity"
                          style={{ background: pf?.color || 'var(--primary-500)' }}
                          title={`${post.title} (${post.time})`}
                        >
                          <Icon className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate flex-1">{post.title}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(post.id) }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-black/20 rounded shrink-0"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )
                    })}
                    {hasOverflow && (
                      <span className="text-[10px] text-primary-600 font-medium pl-1">
                        +{dayPosts.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ) : (
        /* Week View */
        <Card>
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Week of {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
            {weekDays.map((day, idx) => {
              const dayPosts = posts.filter(p => p.date === day.getDate() && month === day.getMonth())
              const isToday = day.toDateString() === new Date().toDateString()
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-3 rounded-lg ${isToday ? 'bg-primary-50/50 dark:bg-primary-950/20' : ''}`}
                >
                  <div className="w-12 text-center shrink-0">
                    <p className="text-xs text-secondary-400">{daysOfWeek[day.getDay()]}</p>
                    <p className={`text-xl font-bold ${isToday ? 'text-primary-600' : 'text-secondary-900 dark:text-white'}`}>
                      {day.getDate()}
                    </p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {dayPosts.length === 0 ? (
                      <p className="text-sm text-secondary-400 py-2">No posts scheduled</p>
                    ) : (
                      dayPosts.map((post) => {
                        const pf = platformConfig[post.platform]
                        const Icon = pf?.icon || Calendar
                        return (
                          <div key={post.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary-50 dark:bg-secondary-800/50 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors group">
                            <GripVertical className="w-4 h-4 text-secondary-300 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${pf?.color || 'from-primary-500 to-primary-600'} flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-secondary-900 dark:text-white">{post.title}</p>
                              <p className="text-xs text-secondary-500">{post.time} &bull; {pf?.label}</p>
                            </div>
                            <Badge variant={post.status === 'published' ? 'success' : post.status === 'scheduled' ? 'warning' : 'secondary'} className="text-[10px]">
                              {post.status}
                            </Badge>
                            <Button variant="ghost" size="sm"><Edit3 className="w-3.5 h-3.5" /></Button>
                            <button onClick={() => handleDelete(post.id)} className="p-1 rounded hover:bg-danger-50 dark:hover:bg-danger-950 transition-colors">
                              <Trash2 className="w-3.5 h-3.5 text-danger-500" />
                            </button>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Upcoming Posts */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-secondary-900 dark:text-white">Upcoming Scheduled Posts</h3>
          <span className="text-xs text-secondary-400">{posts.filter(p => p.status === 'scheduled').length} upcoming</span>
        </div>
        <div className="space-y-2">
          {posts.filter(p => p.status === 'scheduled').length === 0 ? (
            <p className="text-sm text-secondary-400 py-4 text-center">No scheduled posts</p>
          ) : (
            posts.filter(p => p.status === 'scheduled').map((post) => {
              const pf = platformConfig[post.platform]
              const Icon = pf?.icon || Calendar
              return (
                <div key={post.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors group">
                  <div className={`w-1 h-10 rounded-full bg-gradient-to-b ${pf?.color || 'from-primary-500 to-primary-600'}`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-secondary-900 dark:text-white flex items-center gap-2">
                      {post.title}
                      <Badge variant="secondary" className="text-[10px]">{post.mood}</Badge>
                    </p>
                    <p className="text-xs text-secondary-500 flex items-center gap-2">
                      <Icon className="w-3 h-3" />
                      {pf?.label} &bull; {months[month]} {post.date} at {post.time}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm"><Edit3 className="w-3.5 h-3.5" /></Button>
                  <button onClick={() => handleDelete(post.id)} className="p-1 rounded hover:bg-danger-50 dark:hover:bg-danger-950 transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-danger-500" />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </Card>

      {/* AI Generate Modal */}
      <Modal isOpen={showGenerateModal} onClose={() => setShowGenerateModal(false)} title="AI Calendar Generator">
        <div className="space-y-4">
          <p className="text-sm text-secondary-500">
            Generate a content calendar tailored to your business. AI will create optimized posts for the selected duration.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '7 Days', value: '7', desc: 'Quick week plan' },
              { label: '30 Days', value: '30', desc: 'Monthly strategy' },
              { label: '90 Days', value: '90', desc: 'Full quarter' },
            ].map(option => (
              <button
                key={option.value}
                className="p-3 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors text-center group"
              >
                <p className="font-semibold text-secondary-900 dark:text-white group-hover:text-primary-600 transition-colors">{option.label}</p>
                <p className="text-xs text-secondary-500 mt-0.5">{option.desc}</p>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['Balanced', 'Sales Focus', 'Brand Building', 'Engagement'].map((strategy) => (
              <label key={strategy} className="flex items-center gap-2 p-2 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 cursor-pointer transition-colors">
                <input type="radio" name="strategy" className="text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">{strategy}</span>
              </label>
            ))}
          </div>
          <Button className="w-full" onClick={generateAI}>
            <Sparkles className="w-4 h-4 mr-2" /> Generate Calendar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
