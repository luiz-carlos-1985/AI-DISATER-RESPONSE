import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Shield, MapPin, Users, Clock, Zap, Radio, Satellite, Phone, Truck, Heart, Home, LogIn, Crown, Plus, Settings, Send, Download } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import AuthModal from '../components/AuthModal'
import PremiumModal from '../components/PremiumModal'
import UserMenu from '../components/UserMenu'
import PremiumFeatures from '../components/PremiumFeatures'
import IncidentModal from '../components/IncidentModal'
import NotificationSystem, { useNotifications } from '../components/NotificationSystem'
import SettingsModal from '../components/SettingsModal'
import MessageModal from '../components/MessageModal'
import ReportsModal from '../components/ReportsModal'
import BackupModal from '../components/BackupModal'
import { storage, Incident, Message } from '../lib/storage'
import { initializeDefaultData } from '../lib/initialData'

const emergencyData = [
  { time: '00:00', incidents: 2, resolved: 1, active: 1 },
  { time: '06:00', incidents: 5, resolved: 3, active: 2 },
  { time: '12:00', incidents: 12, resolved: 8, active: 4 },
  { time: '18:00', incidents: 8, resolved: 6, active: 2 },
  { time: '24:00', incidents: 3, resolved: 2, active: 1 }
]

const resourceData = [
  { name: 'Medical Teams', available: 15, deployed: 8, color: '#ef4444' },
  { name: 'Fire Dept', available: 12, deployed: 5, color: '#f97316' },
  { name: 'Police Units', available: 25, deployed: 12, color: '#3b82f6' },
  { name: 'Rescue Teams', available: 8, deployed: 3, color: '#10b981' }
]

export default function AIDisasterResponse() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [alertLevel, setAlertLevel] = useState('Normal')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showIncidentModal, setShowIncidentModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showReportsModal, setShowReportsModal] = useState(false)
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [editingIncident, setEditingIncident] = useState<Incident | undefined>()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [userSettings, setUserSettings] = useState(storage.getUserSettings())
  const notifications = useNotifications()

  useEffect(() => {
    setIsClient(true)
    const savedUser = storage.getUser()
    if (savedUser) setUser(savedUser)
    
    const existingIncidents = storage.getIncidents()
    const existingMessages = storage.getMessages()
    
    if (existingIncidents.length === 0 && existingMessages.length === 0) {
      initializeDefaultData()
    }
    
    setIncidents(storage.getIncidents())
    setMessages(storage.getMessages())
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      if (userSettings.autoRefresh) {
        setIncidents(storage.getIncidents())
        setMessages(storage.getMessages())
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [userSettings.autoRefresh])

  const handleLogin = (email: string, password: string) => {
    const newUser = {
      name: email.split('@')[0],
      email,
      plan: 'Free',
      avatar: null
    }
    setUser(newUser)
    storage.saveUser(newUser)
    setShowAuthModal(false)
    notifications.showSuccess('Welcome!', 'Successfully logged in')
  }

  const handleRegister = (name: string, email: string, password: string) => {
    const newUser = {
      name,
      email,
      plan: 'Free',
      avatar: null
    }
    setUser(newUser)
    storage.saveUser(newUser)
    setShowAuthModal(false)
    notifications.showSuccess('Account Created!', 'Welcome to EmergencyAI')
  }

  const handleStartTrial = () => {
    if (user) {
      setUser({ ...user, plan: 'Professional (Trial)' })
    }
    setShowPremiumModal(false)
  }

  const handleUpgrade = (plan: string) => {
    if (user) {
      setUser({ ...user, plan })
    }
    setShowPremiumModal(false)
  }

  const handleLogout = () => {
    setUser(null)
    storage.clearUser()
    notifications.showInfo('Logged Out', 'See you next time!')
  }

  const handleSaveIncident = (incidentData: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingIncident) {
      const updated = storage.updateIncident(editingIncident.id, incidentData)
      if (updated) {
        setIncidents(storage.getIncidents())
        notifications.showSuccess('Updated!', 'Incident updated successfully')
      }
    } else {
      storage.addIncident(incidentData)
      setIncidents(storage.getIncidents())
      notifications.showSuccess('Created!', 'New incident added')
    }
    setEditingIncident(undefined)
  }

  const handleDeleteIncident = (id: string) => {
    if (storage.deleteIncident(id)) {
      setIncidents(storage.getIncidents())
      notifications.showSuccess('Deleted!', 'Incident removed')
    }
  }

  const handleSendMessage = (messageData: { from: string; message: string; priority: 'low' | 'medium' | 'high'; channel: string }) => {
    const message = storage.addMessage({
      ...messageData,
      time: new Date().toLocaleTimeString()
    })
    setMessages(storage.getMessages())
    notifications.showSuccess('Message Sent!', `Broadcast to ${messageData.channel} channel`)
  }

  const handleSaveSettings = (settings: typeof userSettings) => {
    setUserSettings(settings)
    storage.saveUserSettings(settings)
    notifications.showSuccess('Settings Saved!', 'Your preferences have been updated')
  }

  const handleExportData = () => {
    const data = storage.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `emergency-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    notifications.showSuccess('Exported!', 'Data exported successfully')
  }

  const handleImportData = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string
        if (storage.importData(data)) {
          setIncidents(storage.getIncidents())
          setMessages(storage.getMessages())
          setUserSettings(storage.getUserSettings())
          notifications.showSuccess('Imported!', 'Data imported successfully')
        } else {
          notifications.showError('Import Failed', 'Invalid file format')
        }
      } catch {
        notifications.showError('Import Failed', 'Error reading file')
      }
    }
    reader.readAsText(file)
  }

  const handleResetSystem = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      setIncidents([])
      setMessages([])
      setUser(null)
      setUserSettings(storage.getUserSettings())
      setTimeout(() => {
        initializeDefaultData()
        setIncidents(storage.getIncidents())
        setMessages(storage.getMessages())
      }, 100)
      notifications.showSuccess('System Reset!', 'All data has been cleared and reset to defaults')
    }
  }

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'text-red-400 bg-red-500/20'
      case 'High': return 'text-orange-400 bg-orange-500/20'
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-green-400 bg-green-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass border-b border-white/10 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg"
            >
              <Shield className="w-8 h-8" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">EmergencyAI</h1>
              <p className="text-sm text-gray-300">Disaster Response Coordination System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${getAlertColor(alertLevel)}`}>
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">{alertLevel} Alert</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-300">Current Time</div>
              <div className="font-mono text-lg">
                {isClient ? currentTime.toLocaleTimeString() : '--:--:--'}
              </div>
            </div>
            {user && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReportsModal(true)}
                  className="p-2 glass rounded-lg hover:bg-white/20 transition-all"
                >
                  <Download className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettingsModal(true)}
                  className="p-2 glass rounded-lg hover:bg-white/20 transition-all"
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
              </>
            )}
            {user ? (
              <UserMenu 
                user={user} 
                onUpgrade={() => setShowPremiumModal(true)}
                onLogout={handleLogout}
                onSettings={() => setShowSettingsModal(true)}
              />
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Alert Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-600/20 border-b border-red-500/30 p-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-red-400 rounded-full"
            />
            <span className="font-medium">{incidents.filter(i => i.status === 'Active').length} Active Incidents • {incidents.reduce((sum, i) => sum + i.responders, 0)} Responders Deployed • All Systems Operational</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMessageModal(true)}
            className="px-4 py-2 bg-red-600 rounded-lg font-medium flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Emergency Broadcast</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto p-6"
      >
        <div className="flex space-x-2 glass rounded-xl p-2">
          {[
            { id: 'dashboard', label: 'Command Center', icon: Shield },
            { id: 'incidents', label: 'Active Incidents', icon: AlertTriangle },
            { id: 'resources', label: 'Resources', icon: Truck },
            { id: 'communications', label: 'Communications', icon: Radio },
            { id: 'premium', label: 'Premium Features', icon: Crown, premium: true }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (tab.premium && !user) {
                  setShowAuthModal(true)
                } else {
                  setActiveTab(tab.id)
                }
              }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all flex-1 justify-center ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 shadow-lg' 
                  : 'hover:bg-white/10'
              } ${tab.premium ? 'relative' : ''}`}
            >
              <tab.icon className={`w-5 h-5 ${tab.premium ? 'text-yellow-500' : ''}`} />
              <span className="font-medium">{tab.label}</span>
              {tab.premium && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full" />
              )}
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              {/* Stats Cards */}
              <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {[
                  { icon: AlertTriangle, label: 'Active Incidents', value: incidents.filter(i => i.status === 'Active').length.toString(), color: 'from-red-500 to-pink-500', change: '+2' },
                  { icon: Users, label: 'Responders', value: incidents.reduce((sum, i) => sum + i.responders, 0).toString(), color: 'from-blue-500 to-cyan-500', change: '+5' },
                  { icon: Clock, label: 'Avg Response', value: '4.2m', color: 'from-green-500 to-emerald-500', change: '-0.8m' },
                  { icon: Heart, label: 'Lives Saved', value: '127', color: 'from-purple-500 to-indigo-500', change: '+12' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="glass rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map Area */}
              <div className="lg:col-span-3">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-xl p-3 sm:p-6 h-64 sm:h-80 lg:h-96"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-4 gap-2">
                    <h2 className="text-lg sm:text-xl font-bold">Live Incident Map</h2>
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                      />
                      <span className="text-xs sm:text-sm text-gray-300">Live Updates</span>
                    </div>
                  </div>
                  
                  {/* Simulated Map */}
                  <div className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden min-h-[200px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-green-900/30" />
                    
                    {/* Incident Markers */}
                    {useMemo(() => incidents.filter(i => i.status === 'Active').slice(0, 5), [incidents]).map((incident, index) => {
                      const positions = [
                        { left: '20%', top: '25%' },
                        { left: '60%', top: '40%' },
                        { left: '35%', top: '65%' },
                        { left: '75%', top: '20%' },
                        { left: '15%', top: '70%' }
                      ]
                      return (
                        <motion.div
                          key={`map-${incident.id}-${index}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.2 }}
                          className="absolute cursor-pointer group"
                          style={positions[index] || positions[0]}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                              incident.severity === 'High' || incident.severity === 'Critical' ? 'bg-red-500' :
                              incident.severity === 'Medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                          />
                          <motion.div
                            animate={{ scale: [0, 2], opacity: [0.8, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`absolute inset-0 rounded-full ${
                              incident.severity === 'High' || incident.severity === 'Critical' ? 'bg-red-500' :
                              incident.severity === 'Medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                          />
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {incident.type} - {incident.severity}
                          </div>
                        </motion.div>
                      )
                    })}

                    {/* Radar Sweep */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/2 left-1/2 w-20 h-20 sm:w-32 sm:h-32 -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="w-full h-full border border-green-400/30 rounded-full" />
                      <div className="absolute top-0 left-1/2 w-0.5 h-10 sm:h-16 bg-gradient-to-b from-green-400 to-transparent -translate-x-1/2" />
                    </motion.div>
                    
                    {/* Grid Lines */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-1/4 left-0 w-full h-px bg-green-400/30" />
                      <div className="absolute top-1/2 left-0 w-full h-px bg-green-400/30" />
                      <div className="absolute top-3/4 left-0 w-full h-px bg-green-400/30" />
                      <div className="absolute left-1/4 top-0 w-px h-full bg-green-400/30" />
                      <div className="absolute left-1/2 top-0 w-px h-full bg-green-400/30" />
                      <div className="absolute left-3/4 top-0 w-px h-full bg-green-400/30" />
                    </div>
                  </div>
                </motion.div>

                {/* Incident Timeline */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass rounded-xl p-3 sm:p-6 mt-4 sm:mt-6"
                >
                  <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">24-Hour Incident Timeline</h2>
                  <div className="h-40 sm:h-48 lg:h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={emergencyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }} 
                        />
                        <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Active Incidents */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Active Incidents</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingIncident(undefined)
                        setShowIncidentModal(true)
                      }}
                      className="p-2 bg-red-600 rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="space-y-3">
                    {useMemo(() => incidents.filter(i => i.status === 'Active').slice(0, 5), [incidents]).map((incident, index) => (
                      <motion.div
                        key={`sidebar-${incident.id}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-3 glass rounded-lg hover:bg-white/20 transition-all cursor-pointer"
                        onClick={() => {
                          setEditingIncident(incident)
                          setShowIncidentModal(true)
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{incident.id}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            incident.severity === 'High' || incident.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            incident.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {incident.severity}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>{incident.type} • {incident.location}</p>
                          <p>{incident.time} • {incident.responders} responders</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Resource Status */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-xl p-6"
                >
                  <h3 className="text-lg font-bold mb-4">Resource Status</h3>
                  <div className="space-y-3">
                    {resourceData.map((resource, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-3 glass rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{resource.name}</span>
                          <span className="text-xs text-gray-400">
                            {resource.deployed}/{resource.available}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(resource.deployed / resource.available) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: resource.color }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Emergency Contacts */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass rounded-xl p-6"
                >
                  <h3 className="text-lg font-bold mb-4">Emergency Contacts</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Fire Chief', status: 'Available', phone: '+1 (555) 0101' },
                      { name: 'Police Captain', status: 'On Scene', phone: '+1 (555) 0102' },
                      { name: 'Medical Director', status: 'Available', phone: '+1 (555) 0103' }
                    ].map((contact, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="w-full flex items-center justify-between p-3 glass rounded-lg hover:bg-white/20 transition-all"
                      >
                        <div className="text-left">
                          <p className="font-medium text-sm">{contact.name}</p>
                          <p className="text-xs text-gray-400">{contact.phone}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            contact.status === 'Available' ? 'bg-green-400' : 'bg-yellow-400'
                          }`} />
                          <Phone className="w-4 h-4" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'incidents' && (
            <motion.div
              key="incidents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Incident Management</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">All Incidents</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingIncident(undefined)
                          setShowIncidentModal(true)
                        }}
                        className="px-4 py-2 bg-blue-600 rounded-lg text-sm flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New Incident</span>
                      </motion.button>
                    </div>
                    {useMemo(() => incidents, [incidents]).map((incident, index) => (
                      <motion.div
                        key={`incidents-${incident.id}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 glass rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold">{incident.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            incident.severity === 'High' || incident.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            incident.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {incident.severity}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p><strong>Type:</strong> {incident.type}</p>
                          <p><strong>Location:</strong> {incident.location}</p>
                          <p><strong>Time:</strong> {incident.time}</p>
                          <p><strong>Responders:</strong> {incident.responders}</p>
                          <p><strong>Status:</strong> {incident.status}</p>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setEditingIncident(incident)
                              setShowIncidentModal(true)
                            }}
                            className="px-4 py-2 bg-blue-600 rounded-lg text-sm"
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteIncident(incident.id)}
                            className="px-4 py-2 bg-red-600 rounded-lg text-sm"
                          >
                            Delete
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="glass rounded-lg p-4">
                    <h3 className="font-bold mb-4">Resource Allocation</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={resourceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip />
                        <Bar dataKey="available" fill="#10b981" />
                        <Bar dataKey="deployed" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6">Resource Deployment</h2>
                  <div className="space-y-4">
                    {resourceData.map((resource, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 glass rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold">{resource.name}</h3>
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1 bg-blue-600 rounded text-sm"
                            >
                              Deploy
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1 bg-green-600 rounded text-sm"
                            >
                              Recall
                            </motion.button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Available</p>
                            <p className="text-2xl font-bold text-green-400">{resource.available}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Deployed</p>
                            <p className="text-2xl font-bold text-red-400">{resource.deployed}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Utilization</span>
                            <span>{Math.round((resource.deployed / resource.available) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(resource.deployed / resource.available) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: resource.color }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6">Equipment Status</h2>
                  <div className="space-y-4">
                    {[
                      { name: 'Ambulances', total: 15, operational: 12, maintenance: 2, deployed: 8 },
                      { name: 'Fire Trucks', total: 8, operational: 7, maintenance: 1, deployed: 4 },
                      { name: 'Rescue Vehicles', total: 6, operational: 6, maintenance: 0, deployed: 2 },
                      { name: 'Command Units', total: 3, operational: 3, maintenance: 0, deployed: 1 }
                    ].map((equipment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 glass rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold">{equipment.name}</h3>
                          <span className="text-sm text-gray-400">{equipment.total} Total</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-green-500/20 rounded">
                            <p className="text-green-400 font-bold">{equipment.operational}</p>
                            <p className="text-gray-400">Operational</p>
                          </div>
                          <div className="text-center p-2 bg-yellow-500/20 rounded">
                            <p className="text-yellow-400 font-bold">{equipment.maintenance}</p>
                            <p className="text-gray-400">Maintenance</p>
                          </div>
                          <div className="text-center p-2 bg-blue-500/20 rounded">
                            <p className="text-blue-400 font-bold">{equipment.deployed}</p>
                            <p className="text-gray-400">Deployed</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'communications' && (
            <motion.div
              key="communications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Command Communications</h2>
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-3 h-3 bg-green-400 rounded-full"
                      />
                      <span className="text-sm text-green-400">All Systems Online</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">Recent Messages</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowMessageModal(true)}
                        className="px-4 py-2 bg-blue-600 rounded-lg text-sm flex items-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </motion.button>
                    </div>
                    {useMemo(() => messages.slice(0, 10), [messages]).map((comm, index) => (
                      <motion.div
                        key={`comm-${comm.id}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 glass rounded-lg border-l-4 ${
                          comm.priority === 'high' ? 'border-red-500' :
                          comm.priority === 'medium' ? 'border-yellow-500' :
                          'border-green-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm">{comm.from}</span>
                          <span className="text-xs text-gray-400">{comm.time}</span>
                        </div>
                        <p className="text-sm text-gray-300">{comm.message}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowMessageModal(true)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-medium flex items-center justify-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>Send Emergency Broadcast</span>
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4">Radio Channels</h3>
                    <div className="space-y-3">
                      {[
                        { channel: 'Command', frequency: '154.265', status: 'active', users: 12 },
                        { channel: 'Fire Ops', frequency: '154.280', status: 'active', users: 8 },
                        { channel: 'Medical', frequency: '155.340', status: 'active', users: 6 },
                        { channel: 'Police', frequency: '460.250', status: 'standby', users: 3 }
                      ].map((radio, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 glass rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{radio.channel}</span>
                            <div className={`w-2 h-2 rounded-full ${
                              radio.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                            }`} />
                          </div>
                          <div className="text-xs text-gray-400">
                            <p>{radio.frequency} MHz • {radio.users} users</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4">Alert Systems</h3>
                    <div className="space-y-3">
                      {[
                        { system: 'Emergency Alert System', status: 'Ready', icon: Radio },
                        { system: 'Wireless Emergency Alerts', status: 'Active', icon: Satellite },
                        { system: 'Public Address', status: 'Ready', icon: Zap },
                        { system: 'Social Media Alerts', status: 'Active', icon: Phone }
                      ].map((alert, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 glass rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <alert.icon className="w-5 h-5 text-blue-400" />
                            <span className="font-medium text-sm">{alert.system}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            alert.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {alert.status}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'premium' && (
            <motion.div
              key="premium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PremiumFeatures 
                userPlan={user?.plan || 'Free'} 
                onUpgrade={() => setShowPremiumModal(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onStartTrial={handleStartTrial}
        onUpgrade={handleUpgrade}
      />

      <IncidentModal
        isOpen={showIncidentModal}
        onClose={() => {
          setShowIncidentModal(false)
          setEditingIncident(undefined)
        }}
        onSave={handleSaveIncident}
        incident={editingIncident}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={userSettings}
        onSave={handleSaveSettings}
        onExport={handleExportData}
        onImport={handleImportData}
        onOpenBackup={() => setShowBackupModal(true)}
      />

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSend={handleSendMessage}
      />

      <ReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
        incidents={incidents}
      />

      <BackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onBackup={handleExportData}
        onRestore={handleImportData}
        onReset={handleResetSystem}
      />

      <NotificationSystem
        notifications={notifications.notifications}
        onRemove={notifications.removeNotification}
      />
    </div>
  )
}