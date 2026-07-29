import { useState } from 'react'
import { Download, Video, Image, Loader } from 'lucide-react'
import Button from '../ui/Button'
import { EXPORT_PRESETS, reencodeForFormat } from '../../lib/video'

export default function ExportDialog({ videoBlob, onClose, filename = 'advertisement' }) {
  const [exporting, setExporting] = useState(null)
  const [progress, setProgress] = useState(0)

  const handleExport = async (preset) => {
    if (!videoBlob) return
    setExporting(preset.label)
    setProgress(0)
    const pi = setInterval(() => setProgress(p => Math.min(p + 10, 80)), 500)
    try {
      const blob = preset.format === 'webm'
        ? videoBlob
        : await reencodeForFormat(videoBlob, preset.format, preset.width, preset.height)
      clearInterval(pi)
      setProgress(100)
      const ext = preset.format === 'mp4' ? 'mp4' : 'webm'
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}_${preset.width}x${preset.height}.${ext}`
      document.body.appendChild(a); a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setTimeout(() => setExporting(null), 500)
    } catch (e) {
      clearInterval(pi)
      setExporting(null)
      console.error('Export failed:', e)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-white">Export Video</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-sm">Close</button>
        </div>

        <div className="space-y-2">
          {EXPORT_PRESETS.map((preset, i) => (
            <button key={i} onClick={() => handleExport(preset)} disabled={exporting !== null}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${exporting === preset.label ? 'bg-amber-500/20 border-amber-500/40' : 'bg-white/5 border-white/10 hover:border-amber-500/30 hover:bg-white/10'}`}>
              {preset.format === 'mp4' ? <Video className="w-4 h-4 text-red-400" /> : <Image className="w-4 h-4 text-blue-400" />}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white">{preset.label}</p>
                <p className="text-[10px] text-gray-500">{preset.format.toUpperCase()} | {preset.width}x{preset.height}</p>
              </div>
              {exporting === preset.label ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span className="text-[10px] text-amber-400">{progress}%</span>
                </div>
              ) : (
                <Download className="w-4 h-4 text-gray-400" />
              )}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-gray-600 mt-4 text-center">
          MP4 export re-encodes the video and may take a moment. WebM exports are instant.
        </p>
      </div>
    </div>
  )
}
