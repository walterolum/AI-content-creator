import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Wand2, FileText, CreditCard, TrendingUp, Clock,
  ArrowRight, Sparkles, Calendar, BarChart3, Users,
  Target, Eye, Heart, Share2, MessageCircle,
  Zap, Download, Plus, Activity, ChevronRight,
  Camera, Briefcase, MessageSquare, Hash, Play,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Card, { CardHeader, CardTitle } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CardSkeleton } from '../components/ui/Skeleton'
import { formatDate } from '../lib/utils'

const stats = [
  { label: 'Total Generated', value: '142', change: '+12%', icon: FileText, color: 'text-primary-600', bg: 'bg-primary-100 dark:bg-primary-900/30' },
  { label: 'This Month', value: '38', change: '+8%', icon: TrendingUp, color: 'text-success-600', bg: 'bg-success-500/10' },
  { label: 'Credits Left', value: '62', change: '', icon: CreditCard, color: 'text-warning-600', bg: 'bg-warning-500/10' },
  { label: 'Saved Drafts', value: '12', change: '', icon: Clock, color: 'text-secondary-600', bg: 'bg-secondary-100 dark:bg-secondary-800' },
]

const weeklyData = [12, 19, 8, 15, 22, 18, 24]
const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const recentGenerations = [
  { id: 1, type: 'Instagram', title: 'Summer Sale Campaign', time: '2 hours ago', status: 'published', platform: 'instagram', likes: 142, comments: 23 },
  { id: 2, type: 'LinkedIn', title: 'Company Update Post', time: '5 hours ago', status: 'draft', platform: 'linkedin', likes: 0, comments: 0 },
  { id: 3, type: 'Facebook', title: 'Product Launch Announcement', time: '1 day ago', status: 'scheduled', platform: 'facebook', likes: 0, comments: 0 },
  { id: 4, type: 'X', title: 'Thread: Industry Insights', time: '2 days ago', status: 'published', platform: 'x', likes: 89, comments: 12 },
]

const platformIcons = {
  instagram: Camera, linkedin: Briefcase, facebook: MessageSquare, x: Hash, tiktok: Play,
}

const platformColors = {
  instagram: 'from-purple-500 to-pink-500', linkedin: 'bg-blue-700', facebook: 'bg-blue-600', x: 'bg-black', tiktok: 'bg-black',
}

function SparklineChart({ data, color = 'primary' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80; const h = 28
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline points={points} fill="none" stroke={`hsl(var(--${color}-500))`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BarChart({ data, labels, height = 160, color = 'hsl(var(--primary-500))' }) {
  const max = Math.max(...data)
  const w = 28
  return (
    <div className="flex items-end justify-between gap-1" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-medium text-secondary-500">{v}</span>
          <div
            className="w-full rounded-t-md transition-all duration-500 hover:opacity-80"
            style={{ height: `${(v / max) * 100}%`, background: color, minHeight: 4 }}
          />
          <span className="text-[10px] text-secondary-400">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ value, max, label, size = 80 }) {
  const r = size / 2 - 6
  const circ = 2 * Math.PI * r
  const offset = circ - (value / max) * circ
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--secondary-200))" strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--primary-500))" strokeWidth="5" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-secondary-900 dark:text-white">{value}</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><CardSkeleton className="w-64 h-8" /><CardSkeleton className="w-48 h-4 mt-2" /></div>
          <CardSkeleton className="w-32 h-10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><CardSkeleton className="h-80" /></div>
          <CardSkeleton className="h-80" />
        </div>
      </div>
    )
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white flex items-center gap-3">
            Welcome back, {firstName}!
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-success-500/10 text-success-600">
              <Zap className="w-3 h-3" /> Pro
            </span>
          </h1>
          <p className="text-secondary-500 mt-1">Here&apos;s your content performance overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/generator">
            <Button>
              <Wand2 className="w-4 h-4 mr-2" />
              New Content
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
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
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Card hover className="relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="z-10">
                  <p className="text-sm text-secondary-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">{stat.value}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {stat.change && (
                      <span className="text-xs font-medium text-success-600 bg-success-500/10 px-1.5 py-0.5 rounded">
                        {stat.change}
                      </span>
                    )}
                    <span className="text-xs text-secondary-400">vs last month</span>
                  </div>
                </div>
                <div className="z-10">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
              <div className="absolute right-2 bottom-2 opacity-10 dark:opacity-5">
                <SparklineChart data={[8, 12, 7, 15, 10, 18, 14]} color={stat.color.includes('primary') ? 'primary' : stat.color.includes('success') ? 'success' : 'warning'} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart + Recent */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Activity Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Activity</CardTitle>
                <div className="flex items-center gap-2 text-sm text-secondary-500">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary-500" /> Content</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-success-500" /> Engagement</span>
                </div>
              </div>
            </CardHeader>
            <div className="pt-4">
              <BarChart
                data={weeklyData}
                labels={weeklyLabels}
                height={180}
                color="linear-gradient(180deg, hsl(var(--primary-500)) 0%, hsl(var(--primary-500) / 0.7) 100%)"
              />
            </div>
          </Card>

          {/* Recent Generations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Generations</CardTitle>
                <Link to="/library" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </CardHeader>
            <div className="space-y-1">
              {recentGenerations.map((gen) => {
                const PlatformIcon = platformIcons[gen.platform] || Sparkles
                return (
                  <div
                    key={gen.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platformColors[gen.platform] || 'from-primary-500 to-primary-600'} flex items-center justify-center`}>
                        <PlatformIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {gen.title}
                        </p>
                        <p className="text-xs text-secondary-500">{gen.type} &bull; {gen.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {gen.likes > 0 && (
                        <div className="hidden sm:flex items-center gap-1 text-xs text-secondary-400">
                          <Heart className="w-3 h-3" /> {gen.likes}
                        </div>
                      )}
                      {gen.comments > 0 && (
                        <div className="hidden sm:flex items-center gap-1 text-xs text-secondary-400">
                          <MessageCircle className="w-3 h-3" /> {gen.comments}
                        </div>
                      )}
                      <Badge variant={
                        gen.status === 'published' ? 'success' :
                        gen.status === 'scheduled' ? 'warning' : 'secondary'
                      }>
                        {gen.status}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-secondary-300 group-hover:text-secondary-500 transition-colors hidden sm:block" />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <div className="space-y-1">
              {[
                { to: '/generator', icon: Wand2, label: 'Generate Content', desc: 'Create AI-powered posts', color: 'bg-primary-100 dark:bg-primary-900/30', iconColor: 'text-primary-600' },
                { to: '/calendar', icon: Calendar, label: 'Content Calendar', desc: 'Plan your posts', color: 'bg-success-500/10', iconColor: 'text-success-600' },
                { to: '/analytics', icon: BarChart3, label: 'View Analytics', desc: 'Track performance', color: 'bg-warning-500/10', iconColor: 'text-warning-600' },
                { to: '/rewrite', icon: FileText, label: 'Rewrite Tools', desc: 'Transform content', color: 'bg-secondary-100 dark:bg-secondary-800', iconColor: 'text-secondary-600' },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                    <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-secondary-500">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-secondary-300 group-hover:text-primary-500 transition-colors" />
                </Link>
              ))}
            </div>
          </Card>

          {/* Usage Overview */}
          <Card>
            <CardHeader><CardTitle>Usage This Month</CardTitle></CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <DonutChart value={38} max={100} label="Used" size={120} />
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary-600 dark:text-secondary-400">Generations</span>
                    <span className="font-medium text-secondary-900 dark:text-white">38 / 100</span>
                  </div>
                  <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full transition-all duration-500" style={{ width: '38%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary-600 dark:text-secondary-400">AI Tokens</span>
                    <span className="font-medium text-secondary-900 dark:text-white">12.4K / 50K</span>
                  </div>
                  <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                    <div className="bg-success-500 h-2 rounded-full transition-all duration-500" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  { label: 'Avg. Quality', value: '94%', color: 'text-success-600' },
                  { label: 'Best Day', value: 'Tue', color: 'text-primary-600' },
                ].map((item) => (
                  <div key={item.label} className="text-center p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800/50">
                    <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-secondary-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
            <div className="space-y-3">
              {[
                { action: 'Generated Instagram post', time: '2h ago', type: 'generate' },
                { action: 'Rewrote LinkedIn article', time: '5h ago', type: 'rewrite' },
                { action: 'Created content calendar', time: '1d ago', type: 'calendar' },
                { action: 'Generated TikTok script', time: '2d ago', type: 'generate' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    activity.type === 'generate' ? 'bg-primary-500' :
                    activity.type === 'rewrite' ? 'bg-success-500' :
                    activity.type === 'calendar' ? 'bg-warning-500' : 'bg-secondary-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-secondary-900 dark:text-white truncate">{activity.action}</p>
                  </div>
                  <span className="text-xs text-secondary-400 shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
