import { useRef, useState, useEffect, useCallback } from 'react'
import {
  Play, Pause, Square, Maximize2, Minimize2,
  Volume2, Volume1, VolumeX, Download,
  SkipBack, SkipForward
} from 'lucide-react'

export default function VideoPlayer({ src, onStop, onNew }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const progressRef = useRef(null)

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [maximized, setMaximized] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [buffered, setBuffered] = useState(0)

  const hideTimerRef = useRef(null)
  const [prevVolume, setPrevVolume] = useState(1)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTime = () => { setCurrentTime(video.currentTime) }
    const onMeta = () => { setDuration(video.duration || 30) }
    const onEnd = () => { setPlaying(false) }
    const onProg = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1))
      }
    }

    video.addEventListener('timeupdate', onTime)
    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('ended', onEnd)
    video.addEventListener('progress', onProg)

    return () => {
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('ended', onEnd)
      video.removeEventListener('progress', onProg)
    }
  }, [src])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) { video.play(); setPlaying(true) }
    else { video.pause(); setPlaying(false) }
  }, [])

  const handleStop = useCallback(() => {
    const video = videoRef.current
    if (video) { video.pause(); video.currentTime = 0 }
    setPlaying(false)
    onStop?.()
  }, [onStop])

  const handleSeek = useCallback((e) => {
    const video = videoRef.current
    const bar = progressRef.current
    if (!video || !bar) return
    const rect = bar.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    video.currentTime = pct * (duration || 30)
  }, [duration])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (muted) {
      video.muted = false
      video.volume = prevVolume
      setMuted(false)
      setVolume(prevVolume)
    } else {
      setPrevVolume(volume)
      video.muted = true
      setMuted(true)
    }
  }, [muted, volume, prevVolume])

  const handleVolume = useCallback((e) => {
    const v = parseFloat(e.target.value)
    const video = videoRef.current
    if (!video) return
    video.volume = v
    setVolume(v)
    setMuted(v === 0)
    if (v === 0) video.muted = true
    else video.muted = false
  }, [])

  const changeRate = useCallback((rate) => {
    const video = videoRef.current
    if (!video) return
    video.playbackRate = rate
    setPlaybackRate(rate)
    setShowSpeedMenu(false)
  }, [])

  const toggleMaximize = useCallback(() => {
    setMaximized(m => !m)
  }, [])

  const handleFullscreen = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen?.()
    }
  }, [])

  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      if (playing) setShowControls(false)
    }, 3000)
  }, [playing])

  const formatTime = (s) => {
    if (isNaN(s) || !isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? currentTime / duration : 0

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden bg-black select-none ${maximized ? 'fixed inset-0 z-50 rounded-none' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
        style={{ maxHeight: maximized ? '100vh' : '460px' }}
      />

      {/* Center play button overlay */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-all">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 pb-3 px-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Progress bar */}
        <div ref={progressRef} className="relative h-6 group cursor-pointer mb-2" onClick={handleSeek}>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-white/20 rounded-full">
            <div className="absolute h-full bg-white/15 rounded-full" style={{ width: `${duration > 0 ? (buffered / duration) * 100 : 0}%` }} />
            <div className="absolute h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" style={{ width: `${progress * 100}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `${progress * 100}%`, marginLeft: '-7px' }} />
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button onClick={togglePlay} className="text-white hover:text-amber-400 transition-colors">
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          {/* Stop */}
          <button onClick={handleStop} className="text-white/70 hover:text-white transition-colors">
            <Square className="w-4 h-4" />
          </button>

          {/* Time */}
          <span className="text-xs text-white/70 font-mono min-w-[80px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-1.5 group/vol">
            <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
              {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : volume < 0.5 ? <Volume1 className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="w-0 group-hover/vol:w-20 overflow-hidden transition-all duration-200">
              <input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume}
                onChange={handleVolume} className="w-full accent-amber-500 h-1 cursor-pointer" />
            </div>
          </div>

          {/* Speed */}
          <div className="relative">
            <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="text-xs font-mono text-white/70 hover:text-white transition-colors px-1.5 py-0.5 rounded bg-white/10">
              {playbackRate}x
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full mb-2 right-0 bg-black/90 backdrop-blur rounded-lg border border-white/10 py-1 min-w-[72px] shadow-xl">
                {speeds.map(s => (
                  <button key={s} onClick={() => changeRate(s)}
                    className={`w-full px-3 py-1.5 text-xs text-left transition-colors ${playbackRate === s ? 'text-amber-400 bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Maximize/Minimize */}
          <button onClick={toggleMaximize} className="text-white/70 hover:text-white transition-colors">
            {maximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen */}
          <button onClick={handleFullscreen} className="text-white/70 hover:text-white transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Download */}
          <a href={src} download="advertisement.webm" className="text-white/70 hover:text-white transition-colors">
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Maximized close bar */}
      {maximized && (
        <div className="absolute top-3 right-3 z-10">
          <button onClick={toggleMaximize} className="bg-black/50 backdrop-blur rounded-lg p-2 text-white/70 hover:text-white transition-colors">
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
