import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, Download, Upload, RefreshCw, AlertTriangle } from 'lucide-react'

interface BackupModalProps {
  isOpen: boolean
  onClose: () => void
  onBackup: () => void
  onRestore: (file: File) => void
  onReset: () => void
}

export default function BackupModal({ isOpen, onClose, onBackup, onRestore, onReset }: BackupModalProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onRestore(file)
      e.target.value = ''
    }
  }

  const handleReset = () => {
    onReset()
    setShowResetConfirm(false)
    onClose()
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
            className="glass rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-bold">Data Management</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!showResetConfirm ? (
              <div className="space-y-4">
                <div className="glass rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Download className="w-4 h-4 mr-2 text-blue-400" />
                    Backup Data
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Export all your incidents, messages, and settings to a backup file.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onBackup()
                      onClose()
                    }}
                    className="w-full py-2 bg-blue-600 rounded-lg text-sm font-medium"
                  >
                    Create Backup
                  </motion.button>
                </div>

                <div className="glass rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Upload className="w-4 h-4 mr-2 text-green-400" />
                    Restore Data
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Import data from a previously created backup file.
                  </p>
                  <label className="block w-full py-2 bg-green-600 rounded-lg text-sm font-medium text-center cursor-pointer hover:bg-green-700 transition-colors">
                    Select Backup File
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileRestore}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="glass rounded-lg p-4 border border-red-500/30">
                  <h3 className="font-medium mb-2 flex items-center text-red-400">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Reset System
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Clear all data and reset the system to default state. This action cannot be undone.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full py-2 bg-red-600 rounded-lg text-sm font-medium"
                  >
                    Reset System
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                  <h3 className="text-lg font-bold text-red-400 mb-2">Confirm System Reset</h3>
                  <p className="text-sm text-gray-400">
                    This will permanently delete all incidents, messages, and settings. 
                    This action cannot be undone.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-3 glass rounded-lg font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="flex-1 py-3 bg-red-600 rounded-lg font-medium"
                  >
                    Reset System
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}