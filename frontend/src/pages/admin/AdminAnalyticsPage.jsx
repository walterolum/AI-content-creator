import Card, { CardHeader, CardTitle } from '../../components/ui/Card'

const platformStats = [
  { platform: 'Instagram', users: 450, content: 1200, percentage: 38 },
  { platform: 'Facebook', users: 320, content: 890, percentage: 26 },
  { platform: 'LinkedIn', users: 280, content: 750, percentage: 22 },
  { platform: 'TikTok', users: 180, content: 520, percentage: 14 },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Admin Analytics</h1>
        <p className="text-secondary-500 mt-1">Platform-wide analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$12,450', change: '+15%' },
          { label: 'MRR', value: '$4,200', change: '+8%' },
          { label: 'Churn Rate', value: '2.4%', change: '-0.3%' },
          { label: 'LTV', value: '$186', change: '+12%' },
        ].map(stat => (
          <Card key={stat.label}>
            <p className="text-sm text-secondary-500">{stat.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stat.value}</p>
              <span className="text-xs text-success-600 mb-1">{stat.change}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Usage</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {platformStats.map(stat => (
              <div key={stat.platform}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary-700 dark:text-secondary-300">{stat.platform}</span>
                  <span className="font-medium">{stat.users} users</span>
                </div>
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${stat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { plan: 'Free', count: 778, percentage: 63 },
              { plan: 'Starter', count: 312, percentage: 25 },
              { plan: 'Professional', count: 108, percentage: 9 },
              { plan: 'Agency', count: 36, percentage: 3 },
            ].map(item => (
              <div key={item.plan} className="flex items-center gap-3">
                <span className="text-sm text-secondary-700 dark:text-secondary-300 w-24">{item.plan}</span>
                <div className="flex-1">
                  <div className="h-6 bg-secondary-100 dark:bg-secondary-800 rounded overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
