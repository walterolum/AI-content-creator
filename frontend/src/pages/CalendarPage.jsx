import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight, Plus, Download, Sparkles } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { useToast } from '../contexts/ToastContext'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const scheduledPosts = [
  { date: 15, title: 'Summer Sale Launch', platform: 'instagram', color: 'bg-pink-500' },
  { date: 18, title: 'Product Feature', platform: 'linkedin', color: 'bg-blue-600' },
  { date: 22, title: 'Customer Story', platform: 'facebook', color: 'bg-blue-500' },
  { date: 25, title: 'Behind the Scenes', platform: 'tiktok', color: 'bg-black' },
  { date: 28, title: 'Weekly Tips', platform: 'x', color: 'bg-secondary-800' },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const { addToast } = useToast()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1))

  const handleGenerateCalendar = () => {
    setShowGenerateModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Content Calendar</h1>
          <p className="text-secondary-500 mt-1">Plan and schedule your content</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGenerateCalendar}>
            <Sparkles className="w-4 h-4 mr-2" />
            AI Generate
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Post
          </Button>
        </div>
      </div>

      <Card>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
            {months[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center text-sm font-medium text-secondary-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 rounded-lg bg-secondary-50 dark:bg-secondary-800/30" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const posts = scheduledPosts.filter(p => p.date === day)
            const isToday = day === new Date().getDate() && month === new Date().getMonth()

            return (
              <div
                key={day}
                className={`h-24 rounded-lg border p-1.5 text-sm transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-800/50 ${
                  isToday
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                    : 'border-secondary-200 dark:border-secondary-800'
                }`}
              >
                <span className={`font-medium ${isToday ? 'text-primary-600' : 'text-secondary-700 dark:text-secondary-300'}`}>
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {posts.map((post, j) => (
                    <div
                      key={j}
                      className={`text-xs text-white px-1 py-0.5 rounded truncate ${post.color}`}
                      title={post.title}
                    >
                      {post.title}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Upcoming Posts */}
      <Card>
        <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Upcoming Scheduled Posts</h3>
        <div className="space-y-3">
          {scheduledPosts.map((post, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800">
              <div className={`w-1 h-10 rounded-full ${post.color}`} />
              <div className="flex-1">
                <p className="font-medium text-sm text-secondary-900 dark:text-white">{post.title}</p>
                <p className="text-xs text-secondary-500 capitalize">{post.platform} • {months[month]} {post.date}</p>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Generate Modal */}
      <Modal isOpen={showGenerateModal} onClose={() => setShowGenerateModal(false)} title="AI Content Calendar">
        <div className="space-y-4">
          <p className="text-sm text-secondary-500">
            Generate a content calendar tailored to your business. AI will create posts for the selected duration.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '7 Days', value: '7' },
              { label: '30 Days', value: '30' },
              { label: '90 Days', value: '90' },
            ].map(option => (
              <button
                key={option.value}
                className="p-3 rounded-lg border-2 border-secondary-200 dark:border-secondary-700 hover:border-primary-500 transition-colors text-center"
              >
                <p className="font-medium text-secondary-900 dark:text-white">{option.label}</p>
              </button>
            ))}
          </div>
          <Button className="w-full" onClick={() => { setShowGenerateModal(false); addToast('Calendar generation started!', 'success') }}>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Calendar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
