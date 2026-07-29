import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, Grid, List, Trash2, Copy, Edit, Star,
  Archive, Tag, MoreVertical, FolderPlus, CheckSquare,
  Share2, Download, SortAsc, X, Clock, CalendarDays,
  ChevronDown, Sparkles, FileText,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { useToast } from '../contexts/ToastContext'
import { formatDate } from '../lib/utils'

const mockContent = [
  { id: 1, title: 'Summer Sale Campaign', platform: 'instagram', content: 'Beat the heat with our sizzling summer collection! 🔥 Up to 50% off on selected items...', tags: ['sale', 'summer'], favorite: true, date: '2026-07-28', collection: 'Campaigns', status: 'published' },
  { id: 2, title: 'Company Milestone', platform: 'linkedin', content: 'We are thrilled to announce that we have reached 10,000 customers! 🎉', tags: ['milestone', 'company'], favorite: false, date: '2026-07-27', collection: 'Updates', status: 'published' },
  { id: 3, title: 'Product Feature Highlight', platform: 'facebook', content: 'Did you know our product comes with a lifetime warranty? Here are 5 reasons why...', tags: ['product', 'features'], favorite: false, date: '2026-07-26', collection: 'Products', status: 'draft' },
  { id: 4, title: 'Behind the Scenes', platform: 'tiktok', content: 'Take a peek behind the curtain! Here is how we create our magic every day...', tags: ['bts', 'team'], favorite: true, date: '2026-07-25', collection: 'Culture', status: 'scheduled' },
  { id: 5, title: 'Customer Testimonial', platform: 'x', content: '"This product changed my life!" - @happycustomer. We love hearing from you! 💜', tags: ['testimonial', 'social-proof'], favorite: false, date: '2026-07-24', collection: 'Social Proof', status: 'published' },
  { id: 6, title: 'Weekly Tips Thread', platform: 'x', content: 'Here are 5 tips to grow your business this week...', tags: ['tips', 'growth'], favorite: false, date: '2026-07-23', collection: 'Content', status: 'published' },
  { id: 7, title: 'Product Demo Video', platform: 'tiktok', content: 'Watch how easy it is to set up in under 60 seconds!', tags: ['demo', 'product'], favorite: true, date: '2026-07-22', collection: 'Products', status: 'published' },
  { id: 8, title: 'Team Spotlight', platform: 'linkedin', content: 'Meet Sarah, our lead engineer who makes magic happen every day.', tags: ['team', 'culture'], favorite: false, date: '2026-07-21', collection: 'Culture', status: 'draft' },
]

const platformBadges = {
  instagram: { label: 'Instagram', class: 'from-purple-500 to-pink-500' },
  facebook: { label: 'Facebook', class: 'bg-blue-600' },
  linkedin: { label: 'LinkedIn', class: 'bg-blue-700' },
  x: { label: 'X', class: 'bg-secondary-900 dark:bg-secondary-700' },
  tiktok: { label: 'TikTok', class: 'bg-black' },
  threads: { label: 'Threads', class: 'bg-secondary-900' },
}

const collections = ['All Content', 'Campaigns', 'Updates', 'Products', 'Culture', 'Social Proof', 'Content']
const sortOptions = ['Newest First', 'Oldest First', 'A-Z', 'Z-A']

export default function LibraryPage() {
  const [search, setSearch] = useState('')
  const [view, setView] = useState('grid')
  const [activeCollection, setActiveCollection] = useState('All Content')
  const [sortBy, setSortBy] = useState('Newest First')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const { addToast } = useToast()

  const filteredContent = mockContent
    .filter(item =>
      (activeCollection === 'All Content' || item.collection === activeCollection) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
       item.content.toLowerCase().includes(search.toLowerCase()) ||
       item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'Oldest First': return new Date(a.date) - new Date(b.date)
        case 'A-Z': return a.title.localeCompare(b.title)
        case 'Z-A': return b.title.localeCompare(a.title)
        default: return new Date(b.date) - new Date(a.date)
      }
    })

  const toggleSelect = (id) => {
    const next = new Set(selectedIds)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelectedIds(next)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredContent.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredContent.map(c => c.id)))
    }
  }

  const handleBulkDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    addToast(`Deleted ${selectedIds.size} items`, 'success')
    setSelectedIds(new Set())
    setShowDeleteModal(false)
  }

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content)
    addToast('Copied to clipboard!', 'success')
  }

  const handleFavorite = (id) => {
    addToast('Updated favorites', 'success')
  }

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      addToast(`Collection "${newCollectionName}" created`, 'success')
      setNewCollectionName('')
      setShowCollectionModal(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Content Library</h1>
          <p className="text-secondary-500 mt-1">{mockContent.length} items across {collections.length - 1} collections</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 ? (
            <>
              <span className="text-sm text-secondary-500">{selectedIds.size} selected</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
              <Button variant="outline" size="sm">
                <Archive className="w-4 h-4 mr-1" /> Archive
              </Button>
              <Button variant="outline" size="sm" className="text-danger-600 border-danger-300 hover:bg-danger-50" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setShowCollectionModal(true)}>
                <FolderPlus className="w-4 h-4 mr-2" /> New Collection
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Collections Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {collections.map((col) => (
          <button
            key={col}
            onClick={() => setActiveCollection(col)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeCollection === col
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                : 'bg-white dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400 border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
          >
            {col}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search content, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-secondary-300 bg-white text-sm dark:border-secondary-700 dark:bg-secondary-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-secondary-400 hover:text-secondary-600" />
              </button>
            )}
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-lg border border-secondary-300 bg-white text-sm appearance-none dark:border-secondary-700 dark:bg-secondary-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
            >
              {sortOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleSelectAll}>
            <CheckSquare className="w-4 h-4 mr-1" />
            {selectedIds.size === filteredContent.length ? 'Deselect All' : 'Select All'}
          </Button>
          <div className="flex bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded transition-all ${view === 'grid' ? 'bg-white dark:bg-secondary-700 shadow-sm' : 'hover:bg-secondary-200 dark:hover:bg-secondary-700'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded transition-all ${view === 'list' ? 'bg-white dark:bg-secondary-700 shadow-sm' : 'hover:bg-secondary-200 dark:hover:bg-secondary-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {filteredContent.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-1">No content found</h3>
            <p className="text-sm text-secondary-500 mb-4">Try adjusting your search or filters</p>
            <Button onClick={() => { setSearch(''); setActiveCollection('All Content') }}>
              <Sparkles className="w-4 h-4 mr-2" /> Reset Filters
            </Button>
          </motion.div>
        ) : view === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredContent.map((item, i) => {
              const platform = platformBadges[item.platform]
              const isSelected = selectedIds.has(item.id)
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  layout
                >
                  <Card hover className={`h-full flex flex-col relative transition-all ${isSelected ? 'ring-2 ring-primary-500' : ''}`}>
                    <div className="absolute top-3 left-3 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`px-2.5 py-1 rounded text-white text-xs font-medium bg-gradient-to-r ${platform.class}`}>
                        {platform.label}
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant={item.status === 'published' ? 'success' : item.status === 'scheduled' ? 'warning' : 'secondary'} className="text-[10px]">
                          {item.status}
                        </Badge>
                        <button onClick={() => handleFavorite(item.id)} className="p-1">
                          <Star className={`w-4 h-4 ${item.favorite ? 'fill-warning-500 text-warning-500' : 'text-secondary-400'}`} />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-secondary-900 dark:text-white text-sm mb-2 line-clamp-1">{item.title}</h3>
                    <p className="text-secondary-500 text-sm flex-1 line-clamp-3 leading-relaxed">{item.content}</p>
                    <div className="flex items-center gap-1 mt-3 flex-wrap">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                          <Tag className="w-2.5 h-2.5 mr-0.5" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-secondary-100 dark:border-secondary-800">
                      <div className="flex items-center gap-1 text-xs text-secondary-400">
                        <CalendarDays className="w-3 h-3" />
                        {formatDate(item.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleCopy(item.content)} className="p-1.5 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors" title="Copy">
                          <Copy className="w-3.5 h-3.5 text-secondary-500" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors" title="Edit">
                          <Edit className="w-3.5 h-3.5 text-secondary-500" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors" title="Share">
                          <Share2 className="w-3.5 h-3.5 text-secondary-500" />
                        </button>
                        <button onClick={() => toggleSelect(item.id)} className="p-1.5 rounded hover:bg-danger-50 dark:hover:bg-danger-950 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5 text-danger-500" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
                <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-secondary-400 uppercase tracking-wider">
                  <div className="w-4"><input type="checkbox" checked={selectedIds.size === filteredContent.length && filteredContent.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-secondary-300 text-primary-600" /></div>
                  <div className="w-8" />
                  <div className="flex-1">Title</div>
                  <div className="w-20 hidden sm:block">Platform</div>
                  <div className="w-20 hidden md:block">Status</div>
                  <div className="w-24 hidden lg:block">Tags</div>
                  <div className="w-24 hidden lg:block">Date</div>
                  <div className="w-20 text-right">Actions</div>
                </div>
                {filteredContent.map((item) => {
                  const platform = platformBadges[item.platform]
                  const isSelected = selectedIds.has(item.id)
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors ${isSelected ? 'bg-primary-50/50 dark:bg-primary-950/20' : ''}`}
                    >
                      <div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                      </div>
                      <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${platform.class}`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-secondary-900 dark:text-white text-sm truncate">{item.title}</h3>
                        <p className="text-xs text-secondary-500 truncate">{item.content}</p>
                      </div>
                      <div className={`w-20 px-2 py-0.5 rounded text-white text-[10px] font-medium text-center bg-gradient-to-r ${platform.class} hidden sm:block`}>
                        {platform.label}
                      </div>
                      <div className="w-20 hidden md:block">
                        <Badge variant={item.status === 'published' ? 'success' : item.status === 'scheduled' ? 'warning' : 'secondary'} className="text-[10px]">
                          {item.status}
                        </Badge>
                      </div>
                      <div className="w-24 gap-1 hidden lg:flex flex-wrap">
                        {item.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                      <div className="w-24 text-xs text-secondary-400 hidden lg:block">{formatDate(item.date)}</div>
                      <div className="flex items-center gap-1 w-20 justify-end">
                        <button onClick={() => handleCopy(item.content)} className="p-1.5 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800">
                          <Copy className="w-3.5 h-3.5 text-secondary-500" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800">
                          <Edit className="w-3.5 h-3.5 text-secondary-500" />
                        </button>
                        <button onClick={() => toggleSelect(item.id)} className="p-1.5 rounded hover:bg-danger-50 dark:hover:bg-danger-950">
                          <Trash2 className="w-3.5 h-3.5 text-danger-500" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Content">
        <div className="space-y-4">
          <p className="text-sm text-secondary-500">
            Are you sure you want to delete {selectedIds.size} item{selectedIds.size > 1 ? 's' : ''}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </div>
        </div>
      </Modal>

      {/* New Collection Modal */}
      <Modal isOpen={showCollectionModal} onClose={() => setShowCollectionModal(false)} title="New Collection">
        <div className="space-y-4">
          <Input
            label="Collection Name"
            placeholder="Enter collection name..."
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCollectionModal(false)}>Cancel</Button>
            <Button onClick={handleCreateCollection}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
