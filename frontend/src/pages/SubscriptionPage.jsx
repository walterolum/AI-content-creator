import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, CreditCard, Sparkles, Shield, Zap, Users,
  ArrowRight, ChevronDown, ChevronUp, Star, Clock,
  Download, Cloud, Headphones, Layers, Globe,
  BarChart3, RefreshCw, Lock, Palette, Video,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { useAuth } from '../contexts/AuthContext'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      '10 generations/month',
      'Basic templates',
      '2 platforms',
      'Content library',
      'Email support',
      '720p video export',
    ],
    limits: { generations: 10, tokens: 5000, videoExport: '720p' },
    color: 'from-gray-500 to-gray-400',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    period: '/month',
    description: 'For individual creators',
    popular: true,
    features: [
      '200 generations/month',
      'All templates',
      'All platforms',
      'Content calendar',
      'Rewrite tools',
      'Priority support',
      '1080p video export',
      'Background music',
      'Voice-over AI',
    ],
    limits: { generations: 200, tokens: 50000, videoExport: '1080p' },
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 49,
    period: '/month',
    description: 'For growing businesses',
    features: [
      'Unlimited generations',
      'All templates',
      'All platforms',
      'Content calendar',
      'Rewrite tools',
      'Analytics dashboard',
      'Custom branding',
      'API access',
      'Dedicated support',
      '4K video export',
      'Team collaboration',
    ],
    limits: { generations: -1, tokens: 200000, videoExport: '4K' },
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 149,
    period: '/month',
    description: 'For teams and agencies',
    features: [
      'Everything in Professional',
      'Team accounts (up to 10)',
      'Multiple workspaces',
      'White-label support',
      'Custom integrations',
      'Account manager',
      'SLA guarantee',
      'Custom AI training',
      'Bulk operations',
      'Advanced analytics',
    ],
    limits: { generations: -1, tokens: 1000000, videoExport: '4K' },
    color: 'from-amber-500 to-orange-500',
  },
]

const faqs = [
  { q: 'Can I change plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
  { q: 'What happens when I exceed my generation limit?', a: 'You can purchase additional generations or wait for your monthly reset. Pro and Agency plans have unlimited generations.' },
  { q: 'Is there a free trial?', a: 'Yes, the Free plan is always available. Upgrade anytime to unlock premium features.' },
  { q: 'Do you offer team discounts?', a: 'The Agency plan includes up to 10 team members. Contact us for larger teams.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.' },
  { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime. Access continues until the end of your billing period.' },
]

const testimonials = [
  { name: 'Sarah K.', role: 'Marketing Manager', company: 'TechStart Inc.', text: 'This tool has transformed how we create content. The video studio is incredible — we saved 20+ hours per week.', rating: 5 },
  { name: 'James O.', role: 'Social Media Director', company: 'BrandFlow Agency', text: 'The AI script writer alone is worth the subscription. Our engagement rates have doubled since switching.', rating: 5 },
  { name: 'Grace M.', role: 'NGO Coordinator', company: 'Hope Foundation', text: 'As a non-profit, the Free plan is generous, and the Pro plan is affordable. We create professional campaigns on a budget.', rating: 5 },
  { name: 'David W.', role: 'E-commerce Owner', company: 'ShopDirect', text: 'Video ads used to cost us thousands. Now we generate them in minutes. ROI has been incredible.', rating: 5 },
]

const features = [
  { name: 'AI Generations', free: '10/mo', starter: '200/mo', pro: 'Unlimited', agency: 'Unlimited' },
  { name: 'Video Export', free: '720p', starter: '1080p', pro: '4K', agency: '4K' },
  { name: 'Templates', free: 'Basic', starter: 'All', pro: 'All + Custom', agency: 'All + Custom' },
  { name: 'Platforms', free: '2', starter: 'All', pro: 'All', agency: 'All' },
  { name: 'Content Calendar', free: '—', starter: '✓', pro: '✓', agency: '✓' },
  { name: 'Rewrite Tools', free: '—', starter: '✓', pro: '✓', agency: '✓' },
  { name: 'Analytics', free: '—', starter: 'Basic', pro: 'Advanced', agency: 'Advanced' },
  { name: 'Voice-over AI', free: '—', starter: '✓', pro: '✓', agency: '✓' },
  { name: 'Background Music', free: '—', starter: '✓', pro: '✓', agency: '✓' },
  { name: 'Brand Kit', free: '—', starter: '1', pro: '3', agency: 'Unlimited' },
  { name: 'API Access', free: '—', starter: '—', pro: '✓', agency: '✓' },
  { name: 'Team Members', free: '1', starter: '1', pro: '3', agency: '10' },
]

export default function SubscriptionPage() {
  const { user } = useAuth()
  const [currentPlan, setCurrentPlan] = useState('free')
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [showComparison, setShowComparison] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [showAddPayment, setShowAddPayment] = useState(false)

  const getPrice = (price) => {
    if (price === 0) return 'Free'
    if (billingPeriod === 'yearly') return `$${Math.round(price * 10)}`
    return `$${price}`
  }

  const getPeriod = (price) => {
    if (price === 0) return ''
    return billingPeriod === 'yearly' ? '/year' : '/month'
  }

  const annualSavings = (price) => {
    if (price === 0) return ''
    const yearly = price * 12
    const annual = price * 10
    const saved = yearly - annual
    return `Save $${saved}/year`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Choose Your Plan</h1>
        <p className="text-secondary-500 mt-2">Unlock the full power of AI content creation. Upgrade to access premium features.</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setBillingPeriod('monthly')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${billingPeriod === 'monthly' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25' : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingPeriod('yearly')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${billingPeriod === 'yearly' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25' : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400'}`}
        >
          Annual
          <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-success-500 text-white rounded-full">Save 17%</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, i) => {
          const isCurrent = currentPlan === plan.id
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`relative h-full flex flex-col transition-all ${plan.popular ? 'ring-2 ring-primary-600 shadow-xl shadow-primary-500/10' : 'hover:shadow-lg'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> Most Popular
                  </div>
                )}

                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3`}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-secondary-500 mt-0.5">{plan.description}</p>

                <div className="mt-3 mb-4">
                  <span className="text-3xl font-bold text-secondary-900 dark:text-white">{getPrice(plan.price)}</span>
                  <span className="text-secondary-500">{getPeriod(plan.price)}</span>
                  {billingPeriod === 'yearly' && plan.price > 0 && (
                    <div className="text-xs text-success-600 font-medium mt-0.5">{annualSavings(plan.price)}</div>
                  )}
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <Check className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isCurrent ? 'secondary' : plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                  disabled={isCurrent}
                  onClick={() => !isCurrent && setShowAddPayment(true)}
                >
                  {isCurrent ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : billingPeriod === 'yearly' ? `$${Math.round(plan.price * 10)}/yr` : 'Upgrade'}
                </Button>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Feature Comparison */}
      <Card>
        <button onClick={() => setShowComparison(!showComparison)} className="flex items-center justify-between w-full">
          <h3 className="font-semibold text-secondary-900 dark:text-white">Feature Comparison</h3>
          {showComparison ? <ChevronUp className="w-5 h-5 text-secondary-400" /> : <ChevronDown className="w-5 h-5 text-secondary-400" />}
        </button>
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-x-auto"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200 dark:border-secondary-800">
                    <th className="text-left py-2 pr-4 font-medium text-secondary-500">Feature</th>
                    {plans.map(p => (
                      <th key={p.id} className={`py-2 px-3 font-medium text-center ${p.popular ? 'text-primary-600' : 'text-secondary-500'}`}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((f, i) => (
                    <tr key={f.name} className={i < features.length - 1 ? 'border-b border-secondary-100 dark:border-secondary-800' : ''}>
                      <td className="py-2.5 pr-4 text-secondary-700 dark:text-secondary-300">{f.name}</td>
                      {['free', 'starter', 'professional', 'agency'].map(id => {
                        const val = f[id]
                        const isCheck = val === '✓'
                        const isDash = val === '—'
                        return (
                          <td key={id} className="py-2.5 px-3 text-center">
                            {isCheck ? (
                              <Check className="w-4 h-4 text-success-500 mx-auto" />
                            ) : isDash ? (
                              <span className="text-secondary-300 dark:text-secondary-600">&mdash;</span>
                            ) : (
                              <span className="text-secondary-900 dark:text-white font-medium text-xs">{val}</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Testimonials */}
      <div>
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white text-center mb-6">What Our Users Say</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-warning-500 text-warning-500" />
                  ))}
                </div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3 italic">"{t.text}"</p>
                <div className="mt-auto">
                  <p className="font-medium text-sm text-secondary-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-secondary-500">{t.role}, {t.company}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white text-center mb-6">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto space-y-2">
          {faqs.map((faq, i) => (
            <Card key={i}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex items-center justify-between w-full text-left">
                <span className="text-sm font-medium text-secondary-900 dark:text-white">{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-secondary-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-secondary-400 shrink-0" />}
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-secondary-500 overflow-hidden"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method Card */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-secondary-500" />
          <h3 className="font-semibold text-secondary-900 dark:text-white">Payment Method</h3>
        </div>
        <p className="text-sm text-secondary-500 mb-4">
          No payment method on file. Upgrade to a paid plan to add one.
        </p>
        <Button variant="outline" onClick={() => setShowAddPayment(true)}>
          <CreditCard className="w-4 h-4 mr-2" /> Add Payment Method
        </Button>
      </Card>

      {/* Add Payment Modal */}
      <Modal isOpen={showAddPayment} onClose={() => setShowAddPayment(false)} title="Add Payment Method">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-sm text-secondary-700 dark:text-secondary-300 mb-1">Card Number</label>
              <input type="text" placeholder="4242 4242 4242 4242" className="w-full px-3 py-2 rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-sm outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm text-secondary-700 dark:text-secondary-300 mb-1">Expiry</label>
              <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-sm outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm text-secondary-700 dark:text-secondary-300 mb-1">CVC</label>
              <input type="text" placeholder="123" className="w-full px-3 py-2 rounded-lg border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-sm outline-none focus:border-primary-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary-500">
            <Lock className="w-3 h-3" />
            Your payment info is encrypted and secure
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddPayment(false)}>Cancel</Button>
            <Button onClick={() => { setShowAddPayment(false); alert('Payment method added (demo)') }}>
              <CreditCard className="w-4 h-4 mr-2" /> Add Card
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
