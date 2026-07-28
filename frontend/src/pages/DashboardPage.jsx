import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Wand2,
  FileText,
  CreditCard,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Calendar,
  BarChart3,
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

const recentGenerations = [
  { id: 1, type: 'Instagram', title: 'Summer Sale Campaign', time: '2 hours ago', status: 'published' },
  { id: 2, type: 'LinkedIn', title: 'Company Update Post', time: '5 hours ago', status: 'draft' },
  { id: 3, type: 'Facebook', title: 'Product Launch Announcement', time: '1 day ago', status: 'scheduled' },
  { id: 4, type: 'X', title: 'Thread: Industry Insights', time: '2 days ago', status: 'published' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-secondary-500 mt-1">Here&apos;s what&apos;s happening with your content.</p>
        </div>
        <Link to="/generator">
          <Button>
            <Wand2 className="w-4 h-4 mr-2" />
            New Content
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">{stat.value}</p>
                    {stat.change && (
                      <p className="text-xs text-success-600 mt-1">{stat.change} from last month</p>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Generations */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Generations</CardTitle>
                <Link to="/library" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </CardHeader>
            <div className="space-y-3">
              {recentGenerations.map((gen) => (
                <div
                  key={gen.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-white text-sm">{gen.title}</p>
                      <p className="text-xs text-secondary-500">{gen.type} • {gen.time}</p>
                    </div>
                  </div>
                  <Badge variant={
                    gen.status === 'published' ? 'success' :
                    gen.status === 'scheduled' ? 'warning' : 'secondary'
                  }>
                    {gen.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <Link to="/generator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-secondary-900 dark:text-white">Generate Content</p>
                  <p className="text-xs text-secondary-500">Create AI-powered posts</p>
                </div>
              </Link>
              <Link to="/calendar" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-success-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-secondary-900 dark:text-white">Content Calendar</p>
                  <p className="text-xs text-secondary-500">Plan your posts</p>
                </div>
              </Link>
              <Link to="/analytics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-warning-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-warning-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-secondary-900 dark:text-white">View Analytics</p>
                  <p className="text-xs text-secondary-500">Track your performance</p>
                </div>
              </Link>
            </div>
          </Card>

          {/* Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Usage This Month</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary-600 dark:text-secondary-400">Generations</span>
                  <span className="font-medium text-secondary-900 dark:text-white">38 / 100</span>
                </div>
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '38%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary-600 dark:text-secondary-400">AI Tokens</span>
                  <span className="font-medium text-secondary-900 dark:text-white">12.4K / 50K</span>
                </div>
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                  <div className="bg-success-500 h-2 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
