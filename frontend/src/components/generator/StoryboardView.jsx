import { useState } from 'react'
import { ArrowUp, ArrowDown, Trash2, Edit3, Check, X, Camera, Sun, Film } from 'lucide-react'
import Button from '../ui/Button'

const SCENE_ICONS = {
  opening: '🎬',
  problem: '😟',
  solution: '💡',
  feature: '⭐',
  testimonial: '🗣️',
  cta: '🎯',
  closing: '🏁',
}

const TYPE_COLORS = {
  opening: 'border-l-amber-500',
  problem: 'border-l-red-500',
  solution: 'border-l-green-500',
  feature: 'border-l-blue-500',
  testimonial: 'border-l-purple-500',
  cta: 'border-l-orange-500',
  closing: 'border-l-gray-500',
}

export default function StoryboardView({ scene, index, total, isSelected, isEditing, onSelect, onEdit, onMoveUp, onMoveDown, onRemove, onUpdateField }) {
  const [localNarration, setLocalNarration] = useState(scene.narration)
  const [localText, setLocalText] = useState(scene.onScreenText)
  const [localDuration, setLocalDuration] = useState(scene.duration)

  const handleSave = () => {
    onUpdateField('narration', localNarration)
    onUpdateField('onScreenText', localText)
    onUpdateField('duration', Math.max(2, Math.min(15, parseInt(localDuration) || 5)))
    onEdit()
  }

  const handleCancel = () => {
    setLocalNarration(scene.narration)
    setLocalText(scene.onScreenText)
    setLocalDuration(scene.duration)
    onEdit()
  }

  return (
    <div
      className={`bg-white/5 rounded-xl border ${isSelected ? 'border-amber-500/40 bg-white/10' : 'border-white/5'} overflow-hidden transition-all ${TYPE_COLORS[scene.type] || 'border-l-gray-500'} border-l-4`}
    >
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <span className="text-sm">{SCENE_ICONS[scene.type] || '📄'}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500">#{index + 1}</span>
                <span className="text-xs font-semibold text-white uppercase">{scene.type}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400">{scene.duration}s</span>
                <span className="text-[10px] text-gray-600">{scene.transition}</span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 truncate">{scene.onScreenText}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button onClick={onSelect} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <Camera className="w-3 h-3" />
            </button>
            <button onClick={onEdit} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <Edit3 className="w-3 h-3" />
            </button>
            <button onClick={onMoveUp} disabled={index === 0} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
              <ArrowUp className="w-3 h-3" />
            </button>
            <button onClick={onMoveDown} disabled={index === total - 1} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
              <ArrowDown className="w-3 h-3" />
            </button>
            <button onClick={onRemove} className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {isSelected && !isEditing && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <div>
                <span className="text-gray-500">Camera:</span>
                <span className="text-gray-300 ml-1">{scene.cameraAngle || 'eye-level'}</span>
              </div>
              <div>
                <span className="text-gray-500">Lighting:</span>
                <span className="text-gray-300 ml-1">{scene.lighting || 'warm'}</span>
              </div>
              <div>
                <span className="text-gray-500">Mood:</span>
                <span className="text-gray-300 ml-1">{scene.mood || 'neutral'}</span>
              </div>
              <div>
                <span className="text-gray-500">Animation:</span>
                <span className="text-gray-300 ml-1">{scene.animation || 'text-fade-in'}</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-500">Narration: <span className="text-gray-300">{scene.narration || '—'}</span></p>
            {scene.bRoll && scene.bRoll.length > 0 && (
              <p className="text-[10px] text-gray-500">B-Roll: <span className="text-gray-400">{scene.bRoll.join(', ')}</span></p>
            )}
          </div>
        )}

        {isEditing && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-2.5">
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">On-Screen Text</label>
              <input value={localText} onChange={(e) => setLocalText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/40" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">Narration</label>
              <textarea value={localNarration} onChange={(e) => setLocalNarration(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white resize-none h-16 focus:outline-none focus:border-amber-500/40" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">Duration (seconds)</label>
              <input type="number" min="2" max="15" value={localDuration} onChange={(e) => setLocalDuration(parseInt(e.target.value) || 5)}
                className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/40" />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={handleCancel} className="px-3 py-1 rounded text-[10px] text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-3 h-3 inline mr-1" /> Cancel
              </button>
              <button onClick={handleSave} className="px-3 py-1 rounded text-[10px] bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors">
                <Check className="w-3 h-3 inline mr-1" /> Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
