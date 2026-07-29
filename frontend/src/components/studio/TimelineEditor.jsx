import { useState, useRef, useCallback, useEffect } from 'react'
import { useStudio, useStudioActions, formatTime } from '../../lib/studioStore'
import {
  GripVertical, Lock, Eye, EyeOff, Trash2, Plus,
  Scissors, Copy, ChevronLeft, ChevronRight,
  Magnet, ZoomIn, ZoomOut,
} from 'lucide-react'

const PIXELS_PER_SECOND = 60
const TRACK_HEIGHT = 56
const HEADER_HEIGHT = 32
const RULER_HEIGHT = 24
const LABEL_WIDTH = 140

export default function TimelineEditor() {
  const { state } = useStudio()
  const actions = useStudioActions()
  const containerRef = useRef(null)
  const [dragClip, setDragClip] = useState(null)
  const [trimEdge, setTrimEdge] = useState(null)

  const totalDuration = state.project.duration
  const totalWidth = totalDuration * PIXELS_PER_SECOND * state.zoom

  const handleTimelineClick = useCallback((e) => {
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - LABEL_WIDTH
    const time = Math.max(0, x / (PIXELS_PER_SECOND * state.zoom))
    actions.setCurrentTime(Math.min(time, totalDuration))
  }, [actions, state.zoom, totalDuration])

  const handleClipDragStart = (clipId, e) => {
    setDragClip(clipId)
  }

  const handleDrop = useCallback((e, trackId) => {
    if (!dragClip) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - LABEL_WIDTH
    const startTime = Math.max(0, x / (PIXELS_PER_SECOND * state.zoom))
    actions.updateClip(dragClip, { trackId, startTime: Math.round(startTime * 10) / 10 })
    setDragClip(null)
  }, [dragClip, actions, state.zoom])

  const handleSplit = () => {
    if (!state.selectedClipId) return
    const clip = state.clips.find(c => c.id === state.selectedClipId)
    if (!clip) return
    const splitTime = state.currentTime - clip.startTime
    if (splitTime <= 0 || splitTime >= clip.duration) return
    const newClip = { ...clip, id: `clip-${Date.now()}`, startTime: state.currentTime, duration: clip.duration - splitTime }
    actions.updateClip(clip.id, { duration: splitTime })
    actions.addClip(newClip)
  }

  const handleDuplicate = () => {
    if (!state.selectedClipId) return
    const clip = state.clips.find(c => c.id === state.selectedClipId)
    if (!clip) return
    actions.addClip({ ...clip, id: `clip-${Date.now()}`, startTime: clip.startTime + clip.duration + 0.5 })
  }

  const handleDeleteSelected = () => {
    if (state.selectedClipId) actions.removeClip(state.selectedClipId)
  }

  const handleTrimStart = (clipId, edge) => {
    setTrimEdge({ clipId, edge, startX: 0 })
  }

  const handleTrimMove = useCallback((e) => {
    if (!trimEdge) return
    const clip = state.clips.find(c => c.id === trimEdge.clipId)
    if (!clip) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - LABEL_WIDTH
    const newTime = Math.max(0, x / (PIXELS_PER_SECOND * state.zoom))
    const snapToCurrent = Math.abs(newTime - state.currentTime) < 0.3
    const snapTime = snapToCurrent ? state.currentTime : newTime

    if (trimEdge.edge === 'left') {
      const diff = clip.startTime - snapTime
      if (diff > 0 && diff < clip.duration) {
        actions.updateClip(clip.id, { startTime: snapTime, duration: clip.duration + (clip.startTime - snapTime) })
      }
    } else {
      const newDur = snapTime - clip.startTime
      if (newDur > 0.5) {
        actions.updateClip(clip.id, { duration: newDur })
      }
    }
  }, [trimEdge, state.clips, state.currentTime, actions, state.zoom])

  const handleTrimEnd = () => setTrimEdge(null)

  useEffect(() => {
    if (trimEdge) {
      window.addEventListener('mousemove', handleTrimMove)
      window.addEventListener('mouseup', handleTrimEnd)
      return () => {
        window.removeEventListener('mousemove', handleTrimMove)
        window.removeEventListener('mouseup', handleTrimEnd)
      }
    }
  }, [trimEdge, handleTrimMove])

  const getClipStyle = (clip) => {
    const left = clip.startTime * PIXELS_PER_SECOND * state.zoom
    const width = clip.duration * PIXELS_PER_SECOND * state.zoom
    return { left: `${left}px`, width: `${width}px`, top: '4px', height: `${TRACK_HEIGHT - 8}px` }
  }

  return (
    <div className="bg-gray-900/95 rounded-xl border border-white/10 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-1">
          <button onClick={handleSplit} disabled={!state.selectedClipId} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Split (S)">
            <Scissors className="w-3.5 h-3.5 text-white" />
          </button>
          <button onClick={handleDuplicate} disabled={!state.selectedClipId} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Duplicate (Ctrl+D)">
            <Copy className="w-3.5 h-3.5 text-white" />
          </button>
          <button onClick={handleDeleteSelected} disabled={!state.selectedClipId} className="p-1.5 rounded hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Delete (Delete)">
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
          <div className="w-px h-5 bg-white/10 mx-2" />
          <button onClick={() => actions.setZoom(state.zoom * 1.3)} className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Zoom in">
            <ZoomIn className="w-3.5 h-3.5 text-white" />
          </button>
          <button onClick={() => actions.setZoom(state.zoom / 1.3)} className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Zoom out">
            <ZoomOut className="w-3.5 h-3.5 text-white" />
          </button>
          <span className="text-[10px] text-gray-500 ml-1 w-10">{Math.round(state.zoom * 100)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => actions.setSnap(!state.snapEnabled)} className={`p-1.5 rounded transition-colors ${state.snapEnabled ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:bg-white/10'}`} title="Snap">
            <Magnet className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-gray-400 font-mono">{formatTime(state.currentTime)}</span>
        </div>
      </div>

      {/* Timeline Body */}
      <div className="flex" ref={containerRef}>
        {/* Track Labels */}
        <div className="shrink-0 border-r border-white/10 bg-gray-900/50" style={{ width: LABEL_WIDTH }}>
          <div style={{ height: RULER_HEIGHT }} className="border-b border-white/5" />
          {state.tracks.map((track) => (
            <div key={track.id} className="flex items-center gap-1 px-2 border-b border-white/5" style={{ height: TRACK_HEIGHT }}>
              <GripVertical className="w-3 h-3 text-gray-600 cursor-grab" />
              <span className="text-[10px] text-gray-400 truncate flex-1">{track.name}</span>
              <button onClick={() => actions.updateTrack(track.id, { locked: !track.locked })} className="p-0.5">
                {track.locked ? <Lock className="w-2.5 h-2.5 text-amber-500" /> : <Lock className="w-2.5 h-2.5 text-gray-600" />}
              </button>
              <button onClick={() => actions.updateTrack(track.id, { visible: !track.visible })} className="p-0.5">
                {track.visible ? <Eye className="w-2.5 h-2.5 text-gray-400" /> : <EyeOff className="w-2.5 h-2.5 text-gray-600" />}
              </button>
            </div>
          ))}
          <button onClick={() => actions.addTrack({ name: `Track ${state.tracks.length + 1}`, type: 'video', locked: false, visible: true })} className="flex items-center justify-center w-full py-2 text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Tracks Area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden" style={{ maxHeight: 400 }}>
          {/* Ruler */}
          <div className="relative border-b border-white/5 bg-gray-900/30" style={{ height: RULER_HEIGHT, minWidth: totalWidth }}>
            {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, i) => (
              <div key={i} className="absolute top-0 flex" style={{ left: i * PIXELS_PER_SECOND * state.zoom, width: PIXELS_PER_SECOND * state.zoom }}>
                <span className="text-[9px] text-gray-600 pl-1">{i}s</span>
                <div className="absolute bottom-0 left-0 w-px h-2 bg-white/10" />
              </div>
            ))}
            {Array.from({ length: Math.ceil(totalDuration * 2) }).map((_, i) => (
              <div key={`sub-${i}`} className="absolute bottom-0" style={{ left: i * (PIXELS_PER_SECOND / 2) * state.zoom }}>
                <div className="w-px h-1 bg-white/5" />
              </div>
            ))}
          </div>

          {/* Tracks */}
          <div onClick={handleTimelineClick} className="relative cursor-crosshair" style={{ minWidth: totalWidth }}>
            {state.tracks.map((track) => (
              <div
                key={track.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, track.id)}
                className="relative border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                style={{ height: TRACK_HEIGHT }}
              >
                {!track.visible && (
                  <div className="absolute inset-0 bg-gray-900/60 z-10 flex items-center justify-center">
                    <span className="text-[10px] text-gray-600">Hidden</span>
                  </div>
                )}
                {state.clips
                  .filter(c => c.trackId === track.id)
                  .map((clip) => {
                    const isSelected = state.selectedClipId === clip.id
                    return (
                      <div
                        key={clip.id}
                        draggable
                        onDragStart={() => handleClipDragStart(clip.id)}
                        onClick={(e) => { e.stopPropagation(); actions.selectClip(clip.id) }}
                        className={`absolute rounded cursor-pointer group transition-shadow ${
                          isSelected ? 'ring-2 ring-amber-500 shadow-lg shadow-amber-500/20 z-10' : 'hover:brightness-110'
                        } ${track.locked ? 'cursor-not-allowed opacity-60' : ''}`}
                        style={getClipStyle(clip)}
                      >
                        <div className={`w-full h-full rounded overflow-hidden ${
                          clip.type === 'video' ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80' :
                          clip.type === 'text' ? 'bg-gradient-to-r from-emerald-600/80 to-teal-600/80' :
                          clip.type === 'audio' ? 'bg-gradient-to-r from-amber-600/80 to-orange-600/80' :
                          'bg-gradient-to-r from-gray-600/80 to-gray-500/80'
                        }`}>
                          <div className="flex items-center gap-1.5 px-2 py-1">
                            <span className="text-[10px] text-white/90 font-medium truncate">{clip.name || 'Clip'}</span>
                            <span className="text-[8px] text-white/50 ml-auto">{formatTime(clip.duration)}</span>
                          </div>
                        </div>
                        {!track.locked && (
                          <>
                            <div
                              onMouseDown={() => handleTrimStart(clip.id, 'left')}
                              className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-white/20 rounded-l transition-colors opacity-0 group-hover:opacity-100"
                            />
                            <div
                              onMouseDown={() => handleTrimStart(clip.id, 'right')}
                              className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-white/20 rounded-r transition-colors opacity-0 group-hover:opacity-100"
                            />
                          </>
                        )}
                      </div>
                    )
                  })}
              </div>
            ))}
            {state.clips.filter(c => !state.tracks.some(t => t.id === c.trackId)).length > 0 && (
              <div className="px-3 py-2 text-[10px] text-amber-400">
                {state.clips.filter(c => !state.tracks.some(t => t.id === c.trackId)).length} clip(s) without a track
              </div>
            )}

            {/* Playhead */}
            <div
              className="absolute top-0 w-px bg-amber-500 z-20 shadow-lg shadow-amber-500/50"
              style={{ left: state.currentTime * PIXELS_PER_SECOND * state.zoom, height: state.tracks.length * TRACK_HEIGHT }}
            >
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full -ml-[4.5px] -mt-[1px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500">{state.clips.length} clips</span>
          <span className="text-[10px] text-gray-500">&bull;</span>
          <span className="text-[10px] text-gray-500">{state.tracks.length} tracks</span>
          <span className="text-[10px] text-gray-500">&bull;</span>
          <span className="text-[10px] text-gray-500">{totalDuration}s duration</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500">Undo stack: {state.undoStack.length}</span>
        </div>
      </div>
    </div>
  )
}
