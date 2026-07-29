import { useState, useRef } from 'react'
import { useStudio, useStudioActions } from '../../lib/studioStore'
import {
  Image, Video, Music, Folder, FolderPlus, Search,
  Upload, Trash2, Star, Grid, List, Download,
  FileText, Plus, X, Tag, ChevronRight,
} from 'lucide-react'

const mockFolders = [
  { id: 'all', name: 'All Media', icon: Folder },
  { id: 'images', name: 'Images', icon: Image },
  { id: 'videos', name: 'Videos', icon: Video },
  { id: 'audio', name: 'Audio', icon: Music },
  { id: 'brand', name: 'Brand Assets', icon: Star },
]

export default function MediaLibrary() {
  const { state } = useStudio()
  const actions = useStudioActions()
  const [activeFolder, setActiveFolder] = useState('all')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [showUpload, setShowUpload] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const type = file.type.startsWith('image/') ? 'image' :
                   file.type.startsWith('video/') ? 'video' :
                   file.type.startsWith('audio/') ? 'audio' : 'other'
      const url = URL.createObjectURL(file)
      actions.addMedia({
        name: file.name,
        type,
        file,
        url,
        size: file.size,
        folder: type === 'image' ? 'images' : type === 'video' ? 'videos' : 'audio',
        favorite: false,
        tags: [],
      })
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
    setShowUpload(false)
  }

  const filteredMedia = state.mediaLibrary.filter(m => {
    if (activeFolder !== 'all' && activeFolder !== m.folder && !(activeFolder === 'brand' && m.folder === 'brand')) return false
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />
      case 'video': return <Video className="w-5 h-5" />
      case 'audio': return <Music className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'image': return 'from-blue-500 to-cyan-500'
      case 'video': return 'from-purple-500 to-pink-500'
      case 'audio': return 'from-amber-500 to-orange-500'
      default: return 'from-gray-500 to-gray-400'
    }
  }

  const formatSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + 'B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
  }

  return (
    <div className="bg-gray-900/95 rounded-xl border border-white/10 overflow-hidden flex flex-col" style={{ maxHeight: 500 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">Media Library</span>
          <span className="text-[10px] text-gray-500">({state.mediaLibrary.length})</span>
        </div>
        <button onClick={() => setShowUpload(!showUpload)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-[10px] font-medium hover:bg-amber-500/30 transition-colors">
          <Upload className="w-3 h-3" /> Upload
        </button>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,audio/*" onChange={handleFileUpload} className="hidden" />

      {/* Upload area */}
      {showUpload && (
        <div className="px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-amber-500/40 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-6 h-6 text-gray-500 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Drop files or click to upload</p>
            <p className="text-[10px] text-gray-600 mt-0.5">Images, videos, audio up to 100MB</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-3 py-2 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40"
            placeholder="Search media..." />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Folder + Content layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Folders sidebar */}
        <div className="w-28 shrink-0 border-r border-white/10 p-2 space-y-0.5 overflow-y-auto">
          {mockFolders.map(f => (
            <button key={f.id} onClick={() => setActiveFolder(f.id)}
              className={`flex items-center gap-1.5 w-full px-2 py-1.5 rounded-lg text-[10px] transition-all ${
                activeFolder === f.id ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}>
              <f.icon className="w-3 h-3" />
              {f.name}
            </button>
          ))}
        </div>

        {/* Media items */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Image className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-xs text-gray-500">No media files yet</p>
              <button onClick={() => fileInputRef.current?.click()} className="mt-2 text-[10px] text-amber-500 hover:underline">
                Upload your first file
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-gray-500">{filteredMedia.length} items</span>
                <div className="flex gap-0.5">
                  <button onClick={() => setViewMode('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                    <Grid className="w-3 h-3 text-gray-400" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                    <List className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              </div>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {filteredMedia.map((media) => (
                    <div key={media.id}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all cursor-grab"
                      draggable>
                      {media.type === 'image' && media.url ? (
                        <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getTypeColor(media.type)} flex items-center justify-center`}>
                          {getTypeIcon(media.type)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[9px] text-white truncate max-w-[60%]">{media.name}</span>
                          <button onClick={() => actions.removeMedia(media.id)} className="p-0.5 rounded hover:bg-red-500/30 text-red-400">
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredMedia.map((media) => (
                    <div key={media.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-grab"
                      draggable>
                      <div className={`w-6 h-6 rounded bg-gradient-to-br ${getTypeColor(media.type)} flex items-center justify-center`}>
                        {getTypeIcon(media.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-300 truncate">{media.name}</p>
                        <p className="text-[8px] text-gray-600">{formatSize(media.size)}</p>
                      </div>
                      <button onClick={() => actions.removeMedia(media.id)} className="p-0.5 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400">
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/10 bg-white/5">
        <span className="text-[10px] text-gray-500">{state.mediaLibrary.length} files</span>
        <button onClick={() => fileInputRef.current?.click()} className="text-[10px] text-amber-500 hover:underline">
          <Plus className="w-2.5 h-2.5 inline mr-0.5" /> Add files
        </button>
      </div>
    </div>
  )
}
