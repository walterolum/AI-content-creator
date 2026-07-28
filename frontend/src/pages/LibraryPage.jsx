import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List, Trash2, Copy, Edit, Star, Archive, Tag, MoreVertical } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useToast } from '../contexts/ToastContext'
import { formatDate } from '../lib/utils'

const mockContent = [
  { id: 1, title: 'Summer Sale Campaign', platform: 'instagram', content: 'Beat the heat with our sizzling summer collection! 🔥 Up to 50% off on selected items...', tags: ['sale', 'summer'], favorite: true, date: '2026-07-28' },
  { id: 2, title: 'Company Milestone', platform: 'linkedin', content: 'We are thrilled to announce that we have reached 10,000 customers! 🎉', tags: ['milestone', 'company'], favorite: false, date: '2026-07-27' },
  { id: 3, title: 'Product Feature Highlight', platform: 'facebook', content: 'Did you know our product comes with a lifetime warranty? Here are 5 reasons why...', tags: ['product', 'features'], favorite: false, date: '2026-07-26' },
  { id: 4, title: 'Behind the Scenes', platform: 'tiktok', content: 'Take a peek behind the curtain! Here is how we create our magic every day...', tags: ['bts', 'team'], favorite: true, date: '2026-07-25' },
  { id: 5, title: 'Customer Testimonial', platform: 'x', content: '"This product changed my life!" - @happycustomer. We love hearing from you! 💜', tags: ['testimonial', 'social-proof'], favorite: false, date: '2026-07-24' },
]

const platformColors = {
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  facebook: 'bg-blue-600',
  linkedin: 'bg-blue-700',
  x: 'bg-black',
  tiktok: 'bg-black',
  threads: 'bg-secondary-900',
}

export default function LibraryPage() {
  const [search, setSearch] = useState('')
  const [view, setView] = useState('grid')
  const [filter, setFilter] = useState('all')
  const { addToast } = useToast()

  const filteredContent = mockContent.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.content.toLowerCase().includes(search.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  )

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content)
    addToast('Copied to clipboard!', 'success')
  }

  const handleDelete = (id) => {
    addToast('Content deleted', 'success')
  }

  const handleFavorite = (id) => {
    addToast('Updated favorites', 'success')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Content Library</h1>
          <p className="text-secondary-500 mt-1">Manage all your generated content</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search content, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-secondary-300 bg-white text-sm dark:border-secondary-700 dark:bg-secondary-900 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded ${view === 'grid' ? 'bg-white dark:bg-secondary-700 shadow' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded ${view === 'list' ? 'bg-white dark:bg-secondary-700 shadow' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-secondary-300 bg-white text-sm dark:border-secondary-700 dark:bg-secondary-900 dark:text-white"
          >
            <option value="all">All Content</option>
            <option value="favorites">Favorites</option>
            <option value="drafts">Drafts</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {view === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <Card hover className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className={`px-2 py-1 rounded text-white text-xs font-medium ${platformColors[item.platform]}`}>
                    {item.platform}
                  </div>
                  <button
                    onClick={() => handleFavorite(item.id)}
                    className="p-1"
                  >
                    <Star className={`w-4 h-4 ${item.favorite ? 'fill-warning-500 text-warning-500' : 'text-secondary-400'}`} />
                  </button>
                </div>
                <h3 className="font-semibold text-secondary-900 dark:text-white text-sm mb-2">{item.title}</h3>
                <p className="text-secondary-500 text-sm flex-1 line-clamp-3">{item.content}</p>
                <div className="flex items-center gap-1 mt-3 flex-wrap">
                  {item.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-secondary-100 dark:border-secondary-800">
                  <span className="text-xs text-secondary-400">{formatDate(item.date)}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleCopy(item.content)} className="p-1.5 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800">
                      <Copy className="w-3.5 h-3.5 text-secondary-500" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800">
                      <Edit className="w-3.5 h-3.5 text-secondary-500" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-danger-50 dark:hover:bg-danger-950">
                      <Trash2 className="w-3.5 h-3.5 text-danger-500" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
            {filteredContent.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                <div className={`w-2 h-10 rounded-full ${platformColors[item.platform]}`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-secondary-900 dark:text-white text-sm">{item.title}</h3>
                  <p className="text-xs text-secondary-500 truncate">{item.content}</p>
                </div>
                <div className="flex items-center gap-2">
                  {item.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs hidden sm:inline-flex">{tag}</Badge>
                  ))}
                  <span className="text-xs text-secondary-400 hidden sm:block">{formatDate(item.date)}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleCopy(item.content)} className="p-1.5 rounded hover:bg-secondary-100">
                      <Copy className="w-4 h-4 text-secondary-500" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-danger-50">
                      <Trash2 className="w-4 h-4 text-danger-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
