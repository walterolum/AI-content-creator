import { useState } from 'react'
import { useStudio, useStudioActions } from '../../lib/studioStore'
import {
  Type, Image, Square, Circle, Star, Play,
  Move, RotateCw, Maximize, Minimize,
  ChevronDown, ChevronUp, Trash2, Copy, Plus,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Palette, Layers, Eye, EyeOff, Lock,
} from 'lucide-react'

const fontPairs = [
  { heading: 'Helvetica Neue', body: 'Arial' },
  { heading: 'Playfair Display', body: 'Source Sans Pro' },
  { heading: 'Montserrat', body: 'Open Sans' },
  { heading: 'Poppins', body: 'Roboto' },
  { heading: 'Merriweather', body: 'Lato' },
  { heading: 'Oswald', body: 'Inter' },
]

const animationPresets = [
  { id: 'fadeIn', name: 'Fade In', css: 'animate-fadeIn' },
  { id: 'slideUp', name: 'Slide Up', css: 'animate-slideUp' },
  { id: 'slideLeft', name: 'Slide Left', css: 'animate-slideLeft' },
  { id: 'zoomIn', name: 'Zoom In', css: 'animate-zoomIn' },
  { id: 'bounce', name: 'Bounce', css: 'animate-bounce' },
  { id: 'typewriter', name: 'Typewriter', css: 'animate-typewriter' },
  { id: 'blurIn', name: 'Blur In', css: 'animate-blurIn' },
  { id: 'scaleUp', name: 'Scale Up', css: 'animate-scaleUp' },
  { id: 'rotate', name: 'Rotate', css: 'animate-rotate' },
  { id: 'pulse', name: 'Pulse', css: 'animate-pulse' },
]

export default function SceneEditor() {
  const { state } = useStudio()
  const actions = useStudioActions()
  const [activeTab, setActiveTab] = useState('text')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const selectedScene = state.scenes.find(s => s.id === state.selectedSceneId)

  if (!selectedScene) {
    return (
      <div className="bg-gray-900/95 rounded-xl border border-white/10 p-6 text-center">
        <Layers className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-sm text-gray-400">Select a scene from the storyboard or timeline to edit it here</p>
      </div>
    )
  }

  const update = (field, value) => {
    actions.updateScene(selectedScene.id, { [field]: value })
  }

  const tabs = [
    { id: 'text', label: 'Text', icon: Type },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'shapes', label: 'Shapes', icon: Square },
    { id: 'animation', label: 'Animation', icon: Play },
  ]

  return (
    <div className="bg-gray-900/95 rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${
            selectedScene.type === 'intro' ? 'bg-emerald-500' :
            selectedScene.type === 'cta' ? 'bg-amber-500' :
            selectedScene.type === 'outro' ? 'bg-purple-500' :
            'bg-blue-500'
          }`} />
          <span className="text-sm font-semibold text-white capitalize">{selectedScene.type || 'Scene'}</span>
          <span className="text-xs text-gray-500">({selectedScene.duration || 5}s)</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => { const i = state.scenes.indexOf(selectedScene); if (i > 0) { const s = [...state.scenes]; [s[i - 1], s[i]] = [s[i], s[i - 1]]; actions.reorderScenes(s) } }} className="p-1 rounded hover:bg-white/10 text-gray-400">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => { const i = state.scenes.indexOf(selectedScene); if (i < state.scenes.length - 1) { const s = [...state.scenes]; [s[i], s[i + 1]] = [s[i + 1], s[i]]; actions.reorderScenes(s) } }} className="p-1 rounded hover:bg-white/10 text-gray-400">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => actions.addScene({ ...selectedScene, id: `scene-${Date.now()}` })} className="p-1 rounded hover:bg-white/10 text-gray-400">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => actions.removeScene(selectedScene.id)} className="p-1 rounded hover:bg-red-500/20 text-red-400">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-white/5">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all ${
              activeTab === tab.id ? 'bg-white/10 text-amber-400 border-b-2 border-amber-500' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}>
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
        {activeTab === 'text' && (
          <>
            {/* Main Text */}
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">On-Screen Text</label>
              <input
                type="text"
                value={selectedScene.onScreenText || selectedScene.title || ''}
                onChange={(e) => update('onScreenText', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/40"
                placeholder="Main headline..."
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Subtitle / Narration</label>
              <textarea
                value={selectedScene.narration || selectedScene.text || ''}
                onChange={(e) => update('narration', e.target.value)}
                className="w-full h-20 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none focus:outline-none focus:border-amber-500/40"
                placeholder="Supporting text..." />
            </div>

            {/* Typography Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Font Pair</label>
                <select value={selectedScene.fontHeading || fontPairs[0].heading}
                  onChange={(e) => update('fontHeading', e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/40">
                  {fontPairs.map(fp => (
                    <option key={fp.heading} value={fp.heading} className="bg-gray-800">{fp.heading} + {fp.body}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Font Size</label>
                <div className="flex items-center gap-2">
                  <input type="range" min="12" max="96" value={selectedScene.fontSize || 48}
                    onChange={(e) => update('fontSize', parseInt(e.target.value))}
                    className="flex-1 accent-amber-500 h-1" />
                  <span className="text-xs text-gray-400 w-8">{selectedScene.fontSize || 48}</span>
                </div>
              </div>
            </div>

            {/* Style Controls */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Bold, field: 'fontBold', label: 'Bold' },
                { icon: Italic, field: 'fontItalic', label: 'Italic' },
                { icon: Underline, field: 'fontUnderline', label: 'Underline' },
              ].map(({ icon: Icon, field, label }) => (
                <button key={field} onClick={() => update(field, !selectedScene[field])}
                  className={`p-2 rounded-lg text-xs flex items-center justify-center gap-1 transition-all ${
                    selectedScene[field] ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/30'
                  }`}>
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>

            {/* Alignment */}
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Alignment</label>
              <div className="flex gap-1">
                {[
                  { icon: AlignLeft, value: 'left' },
                  { icon: AlignCenter, value: 'center' },
                  { icon: AlignRight, value: 'right' },
                ].map(({ icon: Icon, value }) => (
                  <button key={value} onClick={() => update('textAlign', value)}
                    className={`p-2 rounded-lg transition-all ${
                      (selectedScene.textAlign || 'center') === value ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Text Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={selectedScene.textColor || '#ffffff'}
                    onChange={(e) => update('textColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                  <span className="text-[10px] text-gray-400 font-mono">{selectedScene.textColor || '#ffffff'}</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Stroke</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={selectedScene.strokeColor || '#000000'}
                    onChange={(e) => update('strokeColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                  <input type="number" min="0" max="10" value={selectedScene.strokeWidth || 0}
                    onChange={(e) => update('strokeWidth', parseInt(e.target.value))}
                    className="w-12 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" />
                </div>
              </div>
            </div>

            {/* Shadow */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Shadow Blur</label>
                <input type="number" min="0" max="40" value={selectedScene.shadowBlur || 0}
                  onChange={(e) => update('shadowBlur', parseInt(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-xs" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Letter Spacing</label>
                <input type="number" min="-5" max="20" value={selectedScene.letterSpacing || 0}
                  onChange={(e) => update('letterSpacing', parseInt(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-xs" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Line Height</label>
                <input type="number" min="0.5" max="3" step="0.1" value={selectedScene.lineHeight || 1.2}
                  onChange={(e) => update('lineHeight', parseFloat(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-xs" />
              </div>
            </div>
          </>
        )}

        {activeTab === 'media' && (
          <>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Background</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs hover:border-white/30 transition-colors text-left">
                  <Image className="w-3 h-3 mr-1.5 inline" />Upload Image
                </button>
                <button className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs hover:border-white/30 transition-colors text-left">
                  <Play className="w-3 h-3 mr-1.5 inline" />Upload Video
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Background Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={selectedScene.bgColor || '#000000'}
                  onChange={(e) => update('bgColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
                <span className="text-xs text-gray-400 font-mono">{selectedScene.bgColor || '#000000'}</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Overlay Opacity</label>
              <input type="range" min="0" max="1" step="0.05" value={selectedScene.overlayOpacity ?? 0.6}
                onChange={(e) => update('overlayOpacity', parseFloat(e.target.value))}
                className="w-full accent-amber-500" />
            </div>

            {/* Logo */}
            <div className="pt-3 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selectedScene.showLogo ?? true}
                  onChange={(e) => update('showLogo', e.target.checked)}
                  className="rounded accent-amber-500" />
                <span className="text-xs text-gray-300">Show Logo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input type="checkbox" checked={selectedScene.showBrandColors ?? true}
                  onChange={(e) => update('showBrandColors', e.target.checked)}
                  className="rounded accent-amber-500" />
                <span className="text-xs text-gray-300">Use Brand Colors</span>
              </label>
            </div>
          </>
        )}

        {activeTab === 'shapes' && (
          <>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: Square, label: 'Rectangle' },
                { icon: Circle, label: 'Circle' },
                { icon: Star, label: 'Star' },
                { icon: Type, label: 'Label' },
              ].map(({ icon: Icon, label }) => (
                <button key={label} onClick={() => actions.addClip({ name: label, type: 'text', trackId: 'text-1', duration: 3, shape: label.toLowerCase() })}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all">
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px]">{label}</span>
                </button>
              ))}
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Shape Color</label>
              <input type="color" value={selectedScene.shapeColor || '#a855f7'}
                onChange={(e) => update('shapeColor', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
            </div>
          </>
        )}

        {activeTab === 'animation' && (
          <>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Entry Animation</label>
              <div className="grid grid-cols-2 gap-1.5">
                {animationPresets.map(preset => (
                  <button key={preset.id} onClick={() => update('animation', preset.id)}
                    className={`px-2 py-1.5 rounded text-[10px] transition-all ${
                      selectedScene.animation === preset.id ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/30'
                    }`}>
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration & Delay */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Scene Duration</label>
                <div className="flex items-center gap-2">
                  <input type="range" min="2" max="30" step="0.5" value={selectedScene.duration || 5}
                    onChange={(e) => update('duration', parseFloat(e.target.value))}
                    className="flex-1 accent-amber-500" />
                  <span className="text-xs text-gray-400 w-8">{selectedScene.duration || 5}s</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Animation Delay</label>
                <input type="number" min="0" max="5" step="0.1" value={selectedScene.animationDelay || 0}
                  onChange={(e) => update('animationDelay', parseFloat(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-xs" />
              </div>
            </div>

            {/* Position */}
            <div className="pt-2 border-t border-white/10">
              <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-white">
                {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Advanced Keyframes
              </button>
              {showAdvanced && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Position X</label>
                    <input type="number" value={selectedScene.positionX ?? 50}
                      onChange={(e) => update('positionX', parseInt(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Position Y</label>
                    <input type="number" value={selectedScene.positionY ?? 50}
                      onChange={(e) => update('positionY', parseInt(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Scale %</label>
                    <input type="number" min="0" max="300" value={selectedScene.scale ?? 100}
                      onChange={(e) => update('scale', parseInt(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Rotation</label>
                    <input type="number" min="-360" max="360" value={selectedScene.rotation ?? 0}
                      onChange={(e) => update('rotation', parseInt(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Opacity</label>
                    <input type="number" min="0" max="100" value={selectedScene.opacity ?? 100}
                      onChange={(e) => update('opacity', parseInt(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Easing</label>
                    <select value={selectedScene.easing || 'ease-out'}
                      onChange={(e) => update('easing', e.target.value)}
                      className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs">
                      <option value="ease-out">Ease Out</option>
                      <option value="ease-in">Ease In</option>
                      <option value="ease-in-out">Ease In Out</option>
                      <option value="linear">Linear</option>
                      <option value="bounce">Bounce</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
