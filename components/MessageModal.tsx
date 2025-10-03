import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Radio, AlertTriangle } from 'lucide-react'

interface MessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (message: { from: string; message: string; priority: 'low' | 'medium' | 'high'; channel: string }) => void
}

export default function MessageModal({ isOpen, onClose, onSend }: MessageModalProps) {
  const [formData, setFormData] = useState({
    from: 'Command Center',
    message: '',
    priority: 'medium' as const,
    channel: 'Command'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.message.trim()) {
      onSend(formData)
      setFormData({ ...formData, message: '' })
      onClose()
    }
  }

  const channels = ['Command', 'Fire Ops', 'Medical', 'Police', 'Rescue']
  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
    { value: 'high', label: 'High', color: 'text-red-400' }
  ]

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
            className="glass rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Radio className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-bold">Send Message</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <input
                  type="text"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name/unit"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Channel</label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {channels.map(channel => (
                    <option key={channel} value={channel}>{channel}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {priorities.map(priority => (
                    <label
                      key={priority.value}
                      className={`flex items-center justify-center p-3 glass rounded-lg cursor-pointer transition-all ${
                        formData.priority === priority.value ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={priority.value}
                        checked={formData.priority === priority.value}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`w-4 h-4 ${priority.color}`} />
                        <span className={`text-sm ${priority.color}`}>{priority.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  placeholder="Type your message..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 glass rounded-lg font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}