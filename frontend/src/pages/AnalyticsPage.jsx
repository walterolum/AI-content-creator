import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react'
import Card, { CardHeader, CardTitle } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const stats = [
  { label: 'Total Content', value: '142', change: '+12%', trend: 'up' },
  { label: 'This Month', value: '38', change: '+8%', trend: 'up' },
  { label: 'Avg. Engagement', value: '4.2%', change: '+0.5%', trend: 'up' },
  { label: 'AI Tokens Used', value: '12.4K', change: '-2%', trend: 'down' },
]

const monthlyData = [
  { month: 'Jan', content: 25, tokens: 8000 },
  { month: 'Feb', content: 32, tokens: 10000 },
  { month: 'Mar', content: 28, tokens: 9000 },
  { month: 'Apr', content: 45, tokens: 14000 },
  { month: 'May', content: 38, tokens: 12000 },
  { month: 'Jun', content: 52, tokens: 16000 },
  { month: 'Jul', content: 38, tokens: 12400 },
]

const topContent = [
  { type: 'Instagram Carousel', count: 42, percentage: 30 },
  { type: 'LinkedIn Article', count: 28, percentage: 20 },
  { type: 'Facebook Post', count: 25, percentage: 18 },
  { type: 'TikTok Script', count: 22, percentage: 15 },
  { type: 'X Thread', count: 15, percentage: 10 },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7d')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Analytics</h1>
          <p className="text-secondary-500 mt-1">Track your content performance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 rounded-lg border border-secondary-300 bg-white text-sm dark:border-secondary-700 dark:bg-secondary-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <p className="text-sm text-secondary-500">{stat.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stat.value}</p>
                <span className={`text-xs font-medium mb-1 ${stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                  {stat.change}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Activity</CardTitle>
              <BarChart3 className="w-5 h-5 text-secondary-400" />
            </div>
          </CardHeader>
          <div className="space-y-3">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex items-center gap-3">
                <span className="text-sm text-secondary-500 w-8">{data.month}</span>
                <div className="flex-1">
                  <div className="h-6 bg-primary-100 dark:bg-primary-900/30 rounded-md overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-md transition-all duration-500"
                      style={{ width: `${(data.content / 60) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-secondary-900 dark:text-white w-8 text-right">
                  {data.content}
                </span>
              </div>
            ))}
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
                  <span className="text-sm text-secondary-700 dark:text-secondary-300">{item.type}</span>
                  <span className="text-sm font-medium text-secondary-900 dark:text-white">{item.count}</span>
                </div>
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Credit Usage */}
        <Card>
          <CardHeader>
            <CardTitle>AI Credit Usage</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-secondary-900 dark:text-white">12.4K</p>
              <p className="text-sm text-secondary-500">tokens used this month</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-secondary-500">Usage</span>
                <span className="font-medium">12.4K / 50K</span>
              </div>
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-3">
                <div className="bg-primary-500 h-3 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800">
                <p className="text-lg font-bold text-secondary-900 dark:text-white">38</p>
                <p className="text-xs text-secondary-500">Generations</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800">
                <p className="text-lg font-bold text-secondary-900 dark:text-white">326</p>
                <p className="text-xs text-secondary-500">Avg tokens/gen</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { action: 'Generated Instagram post', time: '2 hours ago', type: 'generate' },
              { action: 'Rewrote LinkedIn article', time: '5 hours ago', type: 'rewrite' },
              { action: 'Created content calendar', time: '1 day ago', type: 'calendar' },
              { action: 'Generated TikTok script', time: '2 days ago', type: 'generate' },
              { action: 'Exported PDF report', time: '3 days ago', type: 'export' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'generate' ? 'bg-primary-500' :
                  activity.type === 'rewrite' ? 'bg-success-500' :
                  activity.type === 'calendar' ? 'bg-warning-500' : 'bg-secondary-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-secondary-900 dark:text-white">{activity.action}</p>
                </div>
                <span className="text-xs text-secondary-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
