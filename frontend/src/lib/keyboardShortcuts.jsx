import { useEffect, useCallback } from 'react'

const defaultShortcuts = {
  'space': { action: 'togglePlay', label: 'Play / Pause' },
  'ctrl+z': { action: 'undo', label: 'Undo' },
  'ctrl+shift+z': { action: 'redo', label: 'Redo' },
  'ctrl+y': { action: 'redo', label: 'Redo (alt)' },
  'delete': { action: 'deleteSelected', label: 'Delete selected' },
  'backspace': { action: 'deleteSelected', label: 'Delete selected' },
  'ctrl+c': { action: 'copy', label: 'Copy' },
  'ctrl+v': { action: 'paste', label: 'Paste' },
  'ctrl+x': { action: 'cut', label: 'Cut' },
  'ctrl+s': { action: 'save', label: 'Save project' },
  'ctrl+a': { action: 'selectAll', label: 'Select all' },
  'escape': { action: 'deselect', label: 'Deselect' },
  'home': { action: 'goToStart', label: 'Go to start' },
  'end': { action: 'goToEnd', label: 'Go to end' },
  'arrowleft': { action: 'stepBackward', label: 'Step backward' },
  'arrowright': { action: 'stepForward', label: 'Step forward' },
  'ctrl+=': { action: 'zoomIn', label: 'Zoom in' },
  'ctrl+-': { action: 'zoomOut', label: 'Zoom out' },
  'ctrl+0': { action: 'zoomReset', label: 'Reset zoom' },
  'enter': { action: 'render', label: 'Render video' },
}

export function useKeyboardShortcuts(handlers) {
  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase()
    const mod = e.ctrlKey || e.metaKey
    const shift = e.shiftKey

    let combo = ''
    if (mod) combo += 'ctrl+'
    if (shift && key !== 'shift') combo += 'shift+'
    if (key === ' ') combo += 'space'
    else if (key !== 'control' && key !== 'shift' && key !== 'meta') combo += key

    const shortcut = defaultShortcuts[combo]
    if (!shortcut) return

    const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable
    if (isInput && !['escape', 'enter'].includes(combo)) return

    e.preventDefault()
    if (handlers[shortcut.action]) handlers[shortcut.action](e)
  }, [handlers])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return defaultShortcuts
}

export function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null
  const groups = [
    { label: 'Playback', actions: ['togglePlay', 'goToStart', 'goToEnd', 'stepBackward', 'stepForward'] },
    { label: 'Edit', actions: ['undo', 'redo', 'copy', 'paste', 'cut', 'deleteSelected', 'selectAll', 'deselect'] },
    { label: 'View', actions: ['zoomIn', 'zoomOut', 'zoomReset'] },
    { label: 'Project', actions: ['save', 'render'] },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">&times;</button>
        </div>
        <div className="space-y-4">
          {groups.map(group => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{group.label}</p>
              <div className="space-y-1">
                {group.actions.map(action => {
                  const entry = Object.entries(defaultShortcuts).find(([, v]) => v.action === action)
                  if (!entry) return null
                  const [keyCombo, { label }] = entry
                  return (
                    <div key={action} className="flex items-center justify-between py-1">
                      <span className="text-xs text-gray-300">{label}</span>
                      <kbd className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-white font-mono">
                        {keyCombo.split('+').map(k => k === 'ctrl' ? 'Ctrl' : k === 'shift' ? 'Shift' : k === 'space' ? 'Space' : k.charAt(0).toUpperCase() + k.slice(1)).join(' + ')}
                      </kbd>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default defaultShortcuts
