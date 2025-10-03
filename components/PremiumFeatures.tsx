import { motion } from 'framer-motion'
import { Lock, Crown, Zap, BarChart3, Satellite, Brain } from 'lucide-react'

interface PremiumFeaturesProps {
  userPlan: string
  onUpgrade: () => void
}

const premiumFeatures = [
  {
    id: 'ai-predictions',
    title: 'AI Incident Predictions',
    description: 'Predict potential disasters 24-48 hours in advance using machine learning',
    icon: Brain,
    requiredPlan: 'Professional'
  },
  {
    id: 'advanced-analytics',
    title: 'Advanced Analytics Dashboard',
    description: 'Deep insights with custom reports and performance metrics',
    icon: BarChart3,
    requiredPlan: 'Professional'
  },
  {
    id: 'satellite-integration',
    title: 'Real-time Satellite Data',
    description: 'Live satellite imagery and weather data integration',
    icon: Satellite,
    requiredPlan: 'Professional'
  },
  {
    id: 'unlimited-incidents',
    title: 'Unlimited Incident Tracking',
    description: 'Track unlimited active incidents simultaneously',
    icon: Zap,
    requiredPlan: 'Professional'
  }
]

export default function PremiumFeatures({ userPlan, onUpgrade }: PremiumFeaturesProps) {
  const hasAccess = (requiredPlan: string) => {
    if (userPlan === 'Enterprise') return true
    if (userPlan === 'Professional' && requiredPlan === 'Professional') return true
    return false
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Premium Features</h2>
        <p className="text-gray-400">Unlock advanced capabilities for enhanced disaster response</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {premiumFeatures.map((feature, index) => {
          const hasFeatureAccess = hasAccess(feature.requiredPlan)
          
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass rounded-xl p-6 relative ${
                !hasFeatureAccess ? 'opacity-60' : ''
              }`}
            >
              {!hasFeatureAccess && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 text-yellow-500" />
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  hasFeatureAccess 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                    : 'bg-gray-600'
                }`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold mb-2 flex items-center">
                    {feature.title}
                    {feature.requiredPlan === 'Professional' && (
                      <Crown className="w-4 h-4 ml-2 text-yellow-500" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    {feature.description}
                  </p>
                  
                  {!hasFeatureAccess && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onUpgrade}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-sm font-medium"
                    >
                      Upgrade to {feature.requiredPlan}
                    </motion.button>
                  )}
                </div>
              </div>

              {hasFeatureAccess && (
                <div className="mt-4 p-4 bg-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-sm text-green-400 font-medium">Active</span>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {userPlan === 'Free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 text-center bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30"
        >
          <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-xl font-bold mb-2">Unlock All Premium Features</h3>
          <p className="text-gray-300 mb-6">
            Get access to AI predictions, advanced analytics, and unlimited incident tracking
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUpgrade}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-medium"
          >
            Start Free Trial
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}