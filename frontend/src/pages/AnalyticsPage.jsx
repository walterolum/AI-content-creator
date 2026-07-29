import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, Download, Calendar, ArrowUp, ArrowDown,
  Eye, Heart, MessageCircle, Share2, Clock, Target,
  Users, Zap, Activity, ChevronDown, FileText, RefreshCw,
} from 'lucide-react'
import Card, { CardHeader, CardTitle } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { useToast } from '../contexts/ToastContext'

const stats = [
  { label: 'Total Content', value: '142', change: '+12%', trend: 'up', icon: FileText, color: 'text-primary-600', bg: 'bg-primary-100 dark:bg-primary-900/30' },
  { label: 'This Month', value: '38', change: '+8%', trend: 'up', icon: TrendingUp, color: 'text-success-600', bg: 'bg-success-500/10' },
  { label: 'Avg. Engagement', value: '4.2%', change: '+0.5%', trend: 'up', icon: Activity, color: 'text-secondary-600', bg: 'bg-secondary-100 dark:bg-secondary-800' },
  { label: 'AI Tokens Used', value: '12.4K', change: '-2%', trend: 'down', icon: Zap, color: 'text-warning-600', bg: 'bg-warning-500/10' },
]

const monthlyData = [
  { month: 'Jan', content: 25, tokens: 8000, engagement: 3.2 },
  { month: 'Feb', content: 32, tokens: 10000, engagement: 3.5 },
  { month: 'Mar', content: 28, tokens: 9000, engagement: 3.1 },
  { month: 'Apr', content: 45, tokens: 14000, engagement: 3.8 },
  { month: 'May', content: 38, tokens: 12000, engagement: 4.0 },
  { month: 'Jun', content: 52, tokens: 16000, engagement: 4.5 },
  { month: 'Jul', content: 38, tokens: 12400, engagement: 4.2 },
]

const topContent = [
  { type: 'Instagram Carousel', count: 42, percentage: 30, trend: '+5%' },
  { type: 'LinkedIn Article', count: 28, percentage: 20, trend: '+2%' },
  { type: 'Facebook Post', count: 25, percentage: 18, trend: '-1%' },
  { type: 'TikTok Script', count: 22, percentage: 15, trend: '+8%' },
  { type: 'X Thread', count: 15, percentage: 10, trend: '+3%' },
]

const recentActivity = [
  { action: 'Generated Instagram post', time: '2 hours ago', type: 'generate', icon: Eye },
  { action: 'Rewrote LinkedIn article', time: '5 hours ago', type: 'rewrite', icon: RefreshCw },
  { action: 'Created content calendar', time: '1 day ago', type: 'calendar', icon: Calendar },
  { action: 'Generated TikTok script', time: '2 days ago', type: 'generate', icon: FileText },
  { action: 'Exported PDF report', time: '3 days ago', type: 'export', icon: Download },
]

function BarChartCanvas({ data, height = 200, barColor = 'var(--primary-500)' }) {
  const max = Math.max(...data.map(d => Math.max(d.content, d.engagement * 10)))
  const w = 40

  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((d, i) => {
        const h1 = (d.content / max) * height * 0.85
        const h2 = ((d.engagement * 10) / max) * height * 0.85
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
            <div className="flex gap-1 items-end" style={{ height: height * 0.85 }}>
              <div
                className="w-3 rounded-t transition-all duration-500 hover:opacity-80"
                style={{ height: h1, background: 'hsl(var(--primary-500))' }}
                title={`Content: ${d.content}`}
              />
              <div
                className="w-3 rounded-t transition-all duration-500 hover:opacity-80"
                style={{ height: h2, background: 'hsl(var(--success-500))' }}
                title={`Engagement: ${d.engagement}%`}
              />
            </div>
            <span className="text-[10px] text-secondary-400">{d.month}</span>
          </div>
        )
      })}
    </div>
  )
}

function LineChartSVG({ data, width = 200, height = 80, color = '#22c55e' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height * 0.8 - height * 0.1}`).join(' ')
  const areaPoints = `0,${height} ${points} ${width},${height}`
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={height - ((data[data.length - 1] - min) / range) * height * 0.8 - height * 0.1} r="3" fill={color} />
    </svg>
  )
}

function DonutChart({ value, max, label, size = 100, color = '#a855f7' }) {
  const r = size / 2 - 8
  const circ = 2 * Math.PI * r
  const offset = circ - (value / max) * circ
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--secondary-200))" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-lg font-bold text-secondary-900 dark:text-white">{value}</span>
        <span className="text-[8px] text-secondary-500">{label}</span>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d')
  const [showExportModal, setShowExportModal] = useState(false)
  const { addToast } = useToast()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Analytics</h1>
          <p className="text-secondary-500 mt-1">Track your content performance and AI usage</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 rounded-lg border border-secondary-300 bg-white text-sm dark:border-secondary-700 dark:bg-secondary-900 dark:text-white focus:border-primary-500 outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline" onClick={() => setShowExportModal(true)}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" /> {period}
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === 'up' ? (
                      <ArrowUp className="w-3 h-3 text-success-500" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-danger-500" />
                    )}
                    <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="absolute right-2 bottom-2 opacity-20">
                <LineChartSVG
                  data={stat.trend === 'up' ? [12, 15, 11, 18, 14, 20, 17] : [20, 18, 15, 16, 14, 12, 10]}
                  width={80}
                  height={30}
                  color={stat.trend === 'up' ? '#22c55e' : '#ef4444'}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Activity Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Activity</CardTitle>
              <div className="flex items-center gap-3 text-xs text-secondary-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary-500" /> Content</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success-500" /> Engagement %</span>
              </div>
            </div>
          </CardHeader>
          <div className="pt-4">
            <BarChartCanvas data={monthlyData} height={200} />
          </div>
          <div className="mt-4 pt-3 border-t border-secondary-100 dark:border-secondary-800 flex items-center justify-between text-xs text-secondary-500">
            <span>Total: {monthlyData.reduce((s, d) => s + d.content, 0)} pieces</span>
            <span>Avg engagement: {(monthlyData.reduce((s, d) => s + d.engagement, 0) / monthlyData.length).toFixed(1)}%</span>
          </div>
        </Card>

        {/* Top Content Types */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Content Types</CardTitle>
              <TrendingUp className="w-5 h-5 text-secondary-400" />
            </div>
          </CardHeader>
          <div className="space-y-4">
            {topContent.map((item) => (
              <div key={item.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">{item.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-secondary-900 dark:text-white">{item.count}</span>
                    <span className={`text-xs ${item.trend.startsWith('+') ? 'text-success-600' : 'text-danger-600'}`}>{item.trend}</span>
                  </div>
                </div>
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
                  />
                </div>
                <span className="text-[10px] text-secondary-400 mt-0.5 block">{item.percentage}% of total</span>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Credit Usage */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>AI Credit Usage</CardTitle>
              <Zap className="w-5 h-5 text-warning-500" />
            </div>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-6">
              <DonutChart value={12400} max={50000} label="Used" size={120} color="#f59e0b" />
              <div className="text-left">
                <p className="text-3xl font-bold text-secondary-900 dark:text-white">12.4K</p>
                <p className="text-sm text-secondary-500">of 50K tokens used</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-0.5 bg-success-500/10 text-success-600 text-[10px] rounded-full">24.8% used</span>
                  <span className="px-2 py-0.5 bg-warning-500/10 text-warning-600 text-[10px] rounded-full">75.2% remaining</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '24.8%' }}
                transition={{ duration: 1 }}
                className="h-full rounded-full bg-gradient-to-r from-warning-500 to-warning-600"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { label: 'Generations', value: '38', sub: 'this month' },
                { label: 'Avg. per Gen', value: '326', sub: 'tokens' },
                { label: 'Peak Day', value: 'Tue', sub: 'this week' },
              ].map(stat => (
                <div key={stat.label} className="text-center p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800">
                  <p className="text-lg font-bold text-secondary-900 dark:text-white">{stat.value}</p>
                  <p className="text-[10px] text-secondary-500">{stat.label}</p>
                  <p className="text-[9px] text-secondary-400">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Clock className="w-5 h-5 text-secondary-400" />
            </div>
          </CardHeader>
          <div className="space-y-2">
            {recentActivity.map((activity, i) => {
              const Icon = activity.icon
              const typeColors = {
                generate: 'bg-primary-500',
                rewrite: 'bg-success-500',
                calendar: 'bg-warning-500',
                export: 'bg-secondary-400',
              }
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors group cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-lg ${typeColors[activity.type] || 'bg-secondary-400'} bg-opacity-20 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${activity.type === 'generate' ? 'text-primary-600' : activity.type === 'rewrite' ? 'text-success-600' : activity.type === 'calendar' ? 'text-warning-600' : 'text-secondary-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{activity.action}</p>
                    <p className="text-xs text-secondary-400">{activity.time}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-secondary-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Export Modal */}
      <Modal isOpen={showExportModal} onClose={() => setShowExportModal(false)} title="Export Report">
        <div className="space-y-4">
          <p className="text-sm text-secondary-500">Choose what to include in your export</p>
          <div className="space-y-2">
            {[
              { id: 'summary', label: 'Summary Statistics', default: true },
              { id: 'charts', label: 'Charts & Graphs', default: true },
              { id: 'activity', label: 'Activity Log', default: true },
              { id: 'content', label: 'Top Content Breakdown', default: false },
              { id: 'usage', label: 'AI Credit Usage', default: false },
            ].map(opt => (
              <label key={opt.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer">
                <input type="checkbox" defaultChecked={opt.default} className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">{opt.label}</span>
              </label>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full" onClick={() => setShowExportModal(false)}>Cancel</Button>
            <Button className="w-full" onClick={() => { setShowExportModal(false); addToast('Report exported!', 'success') }}>
              <Download className="w-4 h-4 mr-2" /> Export PDF
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


