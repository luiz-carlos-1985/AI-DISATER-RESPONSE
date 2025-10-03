import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown, Check, Zap, Shield, BarChart3, Satellite } from 'lucide-react'

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
  onStartTrial: () => void
  onUpgrade: (plan: string) => void
}

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    period: '14 days',
    features: [
      'Basic incident tracking',
      'Up to 5 active incidents',
      'Standard response times',
      'Email notifications'
    ],
    color: 'from-blue-500 to-cyan-500',
    action: 'Start Free Trial'
  },
  {
    name: 'Professional',
    price: '$99',
    period: 'per month',
    features: [
      'Unlimited incidents',
      'Real-time AI predictions',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'Multi-location support'
    ],
    color: 'from-purple-500 to-indigo-500',
    action: 'Upgrade Now',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$299',
    period: 'per month',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom AI training',
      'White-label solution',
      'SLA guarantees',
      'On-premise deployment'
    ],
    color: 'from-orange-500 to-red-500',
    action: 'Contact Sales'
  }
]

export default function PremiumModal({ isOpen, onClose, onStartTrial, onUpgrade }: PremiumModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-8 text-center">
              <h3 className="text-lg text-gray-300 mb-4">
                Unlock advanced AI-powered disaster response capabilities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { icon: Zap, title: 'AI Predictions', desc: 'Predict incidents before they happen' },
                  { icon: Shield, title: 'Advanced Security', desc: 'Enterprise-grade protection' },
                  { icon: BarChart3, title: 'Deep Analytics', desc: 'Comprehensive reporting' },
                  { icon: Satellite, title: 'Real-time Data', desc: 'Live satellite integration' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-lg p-4 text-center"
                  >
                    <feature.icon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <h4 className="font-medium mb-1">{feature.title}</h4>
                    <p className="text-xs text-gray-400">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass rounded-xl p-6 relative ${
                    plan.popular ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-400 ml-1">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (plan.name === 'Free Trial') {
                        onStartTrial()
                      } else {
                        onUpgrade(plan.name)
                      }
                    }}
                    className={`w-full py-3 rounded-lg font-medium bg-gradient-to-r ${plan.color}`}
                  >
                    {plan.action}
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center text-sm text-gray-400">
              <p>All plans include 24/7 support • Cancel anytime • 30-day money-back guarantee</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}