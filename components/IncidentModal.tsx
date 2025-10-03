import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Clock, Users, AlertTriangle } from 'lucide-react'
import { Incident } from '../lib/storage'

interface IncidentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) => void
  incident?: Incident
}

export default function IncidentModal({ isOpen, onClose, onSave, incident }: IncidentModalProps) {
  const [formData, setFormData] = useState({
    type: incident?.type || '',
    location: incident?.location || '',
    severity: incident?.severity || 'Medium' as const,
    responders: incident?.responders || 0,
    status: incident?.status || 'Active' as const,
    description: incident?.description || '',
    time: incident?.time || new Date().toLocaleTimeString()
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
    setFormData({
      type: '',
      location: '',
      severity: 'Medium',
      responders: 0,
      status: 'Active',
      description: '',
      time: new Date().toLocaleTimeString()
    })
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
              <h2 className="text-xl font-bold">
                {incident ? 'Edit Incident' : 'New Incident'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Fire">Fire</option>
                  <option value="Medical">Medical</option>
                  <option value="Accident">Accident</option>
                  <option value="Natural Disaster">Natural Disaster</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Incident location"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Severity</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Active">Active</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Responders</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.responders}
                    onChange={(e) => setFormData({ ...formData, responders: parseInt(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Number of responders"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-24 resize-none"
                  placeholder="Additional details..."
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
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-medium"
                >
                  {incident ? 'Update' : 'Create'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}