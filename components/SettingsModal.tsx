import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings, Bell, RefreshCw, Download, Upload, Shield } from 'lucide-react'
import { UserSettings } from '../lib/storage'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: UserSettings
  onSave: (settings: UserSettings) => void
  onExport: () => void
  onImport: (file: File) => void
  onOpenBackup: () => void
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onSave, 
  onExport, 
  onImport,
  onOpenBackup 
}: SettingsModalProps) {
  const [formData, setFormData] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImport(file)
      e.target.value = ''
    }
  }

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
            className="glass rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Settings className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-bold">Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Notifications */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <label className="flex items-center justify-between p-3 glass rounded-lg cursor-pointer">
                  <span className="text-sm">Enable notifications</span>
                  <input
                    type="checkbox"
                    checked={formData.notifications}
                    onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                </label>
              </div>

              {/* Auto Refresh */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-green-500" />
                  <h3 className="font-medium">Auto Refresh</h3>
                </div>
                <label className="flex items-center justify-between p-3 glass rounded-lg cursor-pointer">
                  <span className="text-sm">Auto refresh data</span>
                  <input
                    type="checkbox"
                    checked={formData.autoRefresh}
                    onChange={(e) => setFormData({ ...formData, autoRefresh: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                </label>
              </div>



              {/* Data Management */}
              <div className="space-y-3">
                <h3 className="font-medium">Data Management</h3>
                <div className="grid grid-cols-3 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onExport}
                    className="flex items-center justify-center space-x-2 p-3 glass rounded-lg hover:bg-white/20 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export</span>
                  </motion.button>
                  
                  <label className="flex items-center justify-center space-x-2 p-3 glass rounded-lg hover:bg-white/20 transition-all cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Import</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onOpenBackup}
                    className="flex items-center justify-center space-x-2 p-3 glass rounded-lg hover:bg-white/20 transition-all"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Backup</span>
                  </motion.button>
                </div>
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
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium"
                >
                  Save Settings
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}