import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Globe, ArrowRight, Check, Star } from 'lucide-react'
import Button from '../components/ui/Button'

const features = [
  { icon: Sparkles, title: 'AI-Powered Content', description: 'Generate professional social media posts in seconds using advanced AI.' },
  { icon: Zap, title: 'Lightning Fast', description: 'Create weeks of content in minutes with our streamlined workflow.' },
  { icon: Globe, title: 'Multi-Platform', description: 'Optimized content for Instagram, Facebook, LinkedIn, X, TikTok, and more.' },
]

const plans = [
  { name: 'Free', price: '$0', period: '/month', features: ['10 generations/month', 'Basic templates', '2 platforms'], cta: 'Get Started' },
  { name: 'Starter', price: '$19', period: '/month', features: ['200 generations/month', 'All templates', 'All platforms', 'Content calendar'], cta: 'Start Free Trial', popular: true },
  { name: 'Professional', price: '$49', period: '/month', features: ['Unlimited generations', 'Priority support', 'Analytics', 'Custom branding'], cta: 'Start Free Trial' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-secondary-200 dark:border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary-900 dark:text-white">ContentAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              AI-Powered Content Generation
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 dark:text-white mb-6 leading-tight">
              Create Stunning Social Media Content{' '}
              <span className="text-primary-600">in Seconds</span>
            </h1>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8 max-w-2xl mx-auto">
              Generate professional captions, hashtags, scripts, and content calendars
              for any business using the power of AI.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">Everything You Need</h2>
            <p className="text-secondary-600 dark:text-secondary-400">Powerful features to transform your content strategy</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl border border-secondary-200 dark:border-secondary-800 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-secondary-600 dark:text-secondary-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">Simple Pricing</h2>
            <p className="text-secondary-600 dark:text-secondary-400">Choose the plan that fits your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border-2 p-6 ${
                  plan.popular
                    ? 'border-primary-600 shadow-lg relative'
                    : 'border-secondary-200 dark:border-secondary-800'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">{plan.name}</h3>
                <div className="mt-2 mb-6">
                  <span className="text-4xl font-bold text-secondary-900 dark:text-white">{plan.price}</span>
                  <span className="text-secondary-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <Check className="w-4 h-4 text-success-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-secondary-200 dark:border-secondary-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-secondary-500">
          <p>&copy; 2026 ContentAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
