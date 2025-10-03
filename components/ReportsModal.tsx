import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Download, Calendar, BarChart3, PieChart, TrendingUp } from 'lucide-react'
import { Incident } from '../lib/storage'

interface ReportsModalProps {
  isOpen: boolean
  onClose: () => void
  incidents: Incident[]
}

export default function ReportsModal({ isOpen, onClose, incidents }: ReportsModalProps) {
  const [reportType, setReportType] = useState('summary')
  const [dateRange, setDateRange] = useState('week')

  const generateReport = () => {
    const reportData = {
      type: reportType,
      dateRange,
      generatedAt: new Date().toISOString(),
      data: {
        totalIncidents: incidents.length,
        activeIncidents: incidents.filter(i => i.status === 'Active').length,
        resolvedIncidents: incidents.filter(i => i.status === 'Resolved').length,
        byType: incidents.reduce((acc, incident) => {
          acc[incident.type] = (acc[incident.type] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        bySeverity: incidents.reduce((acc, incident) => {
          acc[incident.severity] = (acc[incident.severity] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        totalResponders: incidents.reduce((sum, i) => sum + i.responders, 0),
        incidents: incidents
      }
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `emergency-report-${reportType}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stats = {
    total: incidents.length,
    active: incidents.filter(i => i.status === 'Active').length,
    resolved: incidents.filter(i => i.status === 'Resolved').length,
    inProgress: incidents.filter(i => i.status === 'In Progress').length,
    totalResponders: incidents.reduce((sum, i) => sum + i.responders, 0),
    avgResponders: incidents.length > 0 ? Math.round(incidents.reduce((sum, i) => sum + i.responders, 0) / incidents.length) : 0
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
            className="glass rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-bold">Emergency Reports</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <h3 className="font-bold mb-4">Report Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Type</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="summary">Summary Report</option>
                      <option value="detailed">Detailed Analysis</option>
                      <option value="performance">Performance Metrics</option>
                      <option value="trends">Trend Analysis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date Range</label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateReport}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Generate & Download Report</span>
                  </motion.button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-lg p-3 text-center">
                    <BarChart3 className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-gray-400">Total Incidents</p>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-red-400" />
                    <p className="text-2xl font-bold">{stats.active}</p>
                    <p className="text-xs text-gray-400">Active</p>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <PieChart className="w-6 h-6 mx-auto mb-2 text-green-400" />
                    <p className="text-2xl font-bold">{stats.resolved}</p>
                    <p className="text-xs text-gray-400">Resolved</p>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                    <p className="text-2xl font-bold">{stats.totalResponders}</p>
                    <p className="text-xs text-gray-400">Responders</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-4">Incident Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass rounded-lg p-4">
                    <h4 className="font-medium mb-3">By Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Active</span>
                        <span className="text-sm font-bold text-red-400">{stats.active}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">In Progress</span>
                        <span className="text-sm font-bold text-yellow-400">{stats.inProgress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Resolved</span>
                        <span className="text-sm font-bold text-green-400">{stats.resolved}</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-lg p-4">
                    <h4 className="font-medium mb-3">By Type</h4>
                    <div className="space-y-2">
                      {Object.entries(
                        incidents.reduce((acc, incident) => {
                          acc[incident.type] = (acc[incident.type] || 0) + 1
                          return acc
                        }, {} as Record<string, number>)
                      ).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span className="text-sm">{type}</span>
                          <span className="text-sm font-bold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4">Recent Incidents</h3>
                <div className="glass rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {incidents.slice(0, 10).map((incident) => (
                      <div key={incident.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded">
                        <div>
                          <span className="font-medium text-sm">{incident.id}</span>
                          <span className="text-xs text-gray-400 ml-2">{incident.type}</span>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs ${
                            incident.severity === 'High' || incident.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            incident.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {incident.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}