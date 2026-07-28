import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, CreditCard, Sparkles } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useAuth } from '../contexts/AuthContext'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '/month',
    features: [
      '10 generations/month',
      'Basic templates',
      '2 platforms',
      'Content library',
      'Email support',
    ],
    limits: { generations: 10, tokens: 5000 },
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    period: '/month',
    features: [
      '200 generations/month',
      'All templates',
      'All platforms',
      'Content calendar',
      'Rewrite tools',
      'Priority support',
    ],
    limits: { generations: 200, tokens: 50000 },
    popular: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 49,
    period: '/month',
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
    ],
    limits: { generations: -1, tokens: 200000 },
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 149,
    period: '/month',
    features: [
      'Everything in Professional',
      'Team accounts (up to 10)',
      'Multiple workspaces',
      'White-label support',
      'Custom integrations',
      'Account manager',
      'SLA guarantee',
    ],
    limits: { generations: -1, tokens: 1000000 },
  },
]

export default function SubscriptionPage() {
  const { user } = useAuth()
  const currentPlan = 'free'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Subscription</h1>
        <p className="text-secondary-500 mt-1">Choose the plan that fits your needs</p>
      </div>

      {/* Current Plan */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-secondary-900 dark:text-white">Current Plan</h3>
            <p className="text-sm text-secondary-500 mt-1">
              You are on the <span className="font-medium text-primary-600 capitalize">{currentPlan}</span> plan
            </p>
          </div>
          <Badge variant="primary" className="capitalize">{currentPlan}</Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-secondary-500">Generations Used</p>
            <p className="text-lg font-bold text-secondary-900 dark:text-white">38 / 100</p>
          </div>
          <div>
            <p className="text-sm text-secondary-500">Reset Date</p>
            <p className="text-lg font-bold text-secondary-900 dark:text-white">Aug 1, 2026</p>
          </div>
        </div>
      </Card>

      {/* Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`relative h-full flex flex-col ${plan.popular ? 'border-primary-600 border-2' : ''}`}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                  Most Popular
                </span>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-secondary-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-secondary-500">{plan.period}</span>
                </div>
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
                variant={currentPlan === plan.id ? 'secondary' : plan.popular ? 'primary' : 'outline'}
                className="w-full"
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Payment Method */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-secondary-500" />
          <h3 className="font-semibold text-secondary-900 dark:text-white">Payment Method</h3>
        </div>
        <p className="text-sm text-secondary-500 mb-4">
          No payment method on file. Upgrade to a paid plan to add one.
        </p>
        <Button variant="outline">
          <CreditCard className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </Card>
    </div>
  )
}
