import { useState, useEffect } from 'react'
import { Save, FolderOpen, Trash2, Plus } from 'lucide-react'
import Button from '../ui/Button'

const STORAGE_KEY = 'video_studio_templates'

function loadTemplates() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function saveTemplates(templates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
}

export default function TemplateManager({ currentSettings, onLoad }) {
  const [templates, setTemplates] = useState(loadTemplates)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [showLoadMenu, setShowLoadMenu] = useState(false)

  useEffect(() => { setTemplates(loadTemplates()) }, [])

  const handleSave = () => {
    if (!templateName.trim()) return
    const template = {
      id: Date.now().toString(),
      name: templateName.trim(),
      settings: currentSettings,
      createdAt: new Date().toISOString(),
    }
    const updated = [template, ...templates.filter(t => t.id !== template.id)]
    saveTemplates(updated)
    setTemplates(updated)
    setTemplateName('')
    setShowSaveDialog(false)
  }

  const handleLoad = (template) => {
    onLoad(template.settings)
    setShowLoadMenu(false)
  }

  const handleDelete = (id) => {
    const updated = templates.filter(t => t.id !== id)
    saveTemplates(updated)
    setTemplates(updated)
  }

  return (
    <div className="relative">
      <div className="flex gap-1">
        <button onClick={() => setShowSaveDialog(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
          <Save className="w-3 h-3" /> Save
        </button>
        <button onClick={() => setShowLoadMenu(!showLoadMenu)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
          <FolderOpen className="w-3 h-3" /> Load
        </button>
      </div>

      {showSaveDialog && (
        <div className="absolute top-full mt-2 right-0 bg-gray-900 border border-white/10 rounded-xl p-4 shadow-2xl z-20 min-w-[280px]">
          <p className="text-xs font-semibold text-white mb-3">Save Template</p>
          <input value={templateName} onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template name..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 mb-3 focus:outline-none focus:border-amber-500/40"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()} autoFocus />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowSaveDialog(false)} className="px-3 py-1.5 rounded text-[10px] text-gray-400 hover:text-white">Cancel</button>
            <button onClick={handleSave} className="px-3 py-1.5 rounded text-[10px] bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">Save</button>
          </div>
        </div>
      )}

      {showLoadMenu && (
        <div className="absolute top-full mt-2 right-0 bg-gray-900 border border-white/10 rounded-xl p-3 shadow-2xl z-20 min-w-[240px]">
          <p className="text-xs font-semibold text-white mb-2">Load Template</p>
          {templates.length === 0 ? (
            <p className="text-[10px] text-gray-500 py-3 text-center">No saved templates yet</p>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {templates.map(t => (
                <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 group">
                  <button onClick={() => handleLoad(t)} className="flex-1 text-left min-w-0">
                    <p className="text-xs text-white truncate">{t.name}</p>
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-1 rounded text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setShowLoadMenu(false)} className="w-full text-center text-[10px] text-gray-500 mt-2 hover:text-white">Close</button>
        </div>
      )}
    </div>
  )
}
