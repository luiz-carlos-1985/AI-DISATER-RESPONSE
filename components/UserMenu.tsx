import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Crown, Settings, LogOut, ChevronDown } from 'lucide-react'

interface UserMenuProps {
  user: {
    name: string
    email: string
    plan: string
    avatar?: string
  }
  onUpgrade: () => void
  onLogout: () => void
  onSettings?: () => void
}

export default function UserMenu({ user, onUpgrade, onLogout, onSettings }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const isPremium = user.plan !== 'Free'

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-3 glass rounded-lg hover:bg-white/20 transition-all"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>
        <div className="text-left hidden md:block">
          <p className="font-medium text-sm">{user.name}</p>
          <p className="text-xs text-gray-400 flex items-center">
            {isPremium && <Crown className="w-3 h-3 mr-1 text-yellow-500" />}
            {user.plan}
          </p>
        </div>
        <ChevronDown className="w-4 h-4" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-64 glass rounded-xl p-2 z-50"
          >
            <div className="p-3 border-b border-white/10">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              <div className="flex items-center mt-2">
                {isPremium && <Crown className="w-4 h-4 mr-1 text-yellow-500" />}
                <span className="text-sm font-medium">{user.plan} Plan</span>
              </div>
            </div>

            <div className="py-2">
              {!isPremium && (
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    onUpgrade()
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-white/10 rounded-lg transition-all"
                >
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span>Upgrade to Premium</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => {
                  if (onSettings) onSettings()
                  setIsOpen(false)
                }}
                className="w-full flex items-center space-x-3 p-3 hover:bg-white/10 rounded-lg transition-all"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </motion.button>

              <motion.button
                whileHover={{ x: 5 }}
                onClick={() => {
                  onLogout()
                  setIsOpen(false)
                }}
                className="w-full flex items-center space-x-3 p-3 hover:bg-white/10 rounded-lg transition-all text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}