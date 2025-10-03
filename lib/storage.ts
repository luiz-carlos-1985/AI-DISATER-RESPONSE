export interface Incident {
  id: string
  type: string
  location: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  time: string
  responders: number
  status: 'Active' | 'Resolved' | 'In Progress'
  description?: string
  coordinates?: { lat: number; lng: number }
  createdAt: string
  updatedAt: string
}

export interface User {
  name: string
  email: string
  plan: string
  avatar?: string
  settings?: UserSettings
}

export interface UserSettings {
  notifications: boolean
  autoRefresh: boolean
  theme: 'dark' | 'light'
  language: string
}

export interface Message {
  id: string
  from: string
  message: string
  time: string
  priority: 'low' | 'medium' | 'high'
  channel: string
}

class StorageManager {
  private getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  getIncidents(): Incident[] {
    return this.getItem('incidents', [])
  }

  saveIncidents(incidents: Incident[]): void {
    this.setItem('incidents', incidents)
  }

  addIncident(incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>): Incident {
    const incidents = this.getIncidents()
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    const newIncident: Incident = {
      ...incident,
      id: `INC-${timestamp}-${random}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    incidents.push(newIncident)
    this.saveIncidents(incidents)
    return newIncident
  }

  updateIncident(id: string, updates: Partial<Incident>): Incident | null {
    const incidents = this.getIncidents()
    const index = incidents.findIndex(inc => inc.id === id)
    if (index === -1) return null
    
    incidents[index] = {
      ...incidents[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    this.saveIncidents(incidents)
    return incidents[index]
  }

  deleteIncident(id: string): boolean {
    const incidents = this.getIncidents()
    const filtered = incidents.filter(inc => inc.id !== id)
    if (filtered.length === incidents.length) return false
    this.saveIncidents(filtered)
    return true
  }

  getUser(): User | null {
    return this.getItem('user', null)
  }

  saveUser(user: User): void {
    this.setItem('user', user)
  }

  clearUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
  }

  getMessages(): Message[] {
    return this.getItem('messages', [])
  }

  saveMessages(messages: Message[]): void {
    this.setItem('messages', messages)
  }

  addMessage(message: Omit<Message, 'id'>): Message {
    const messages = this.getMessages()
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    const newMessage: Message = {
      ...message,
      id: `MSG-${timestamp}-${random}`
    }
    messages.unshift(newMessage)
    if (messages.length > 100) {
      messages.splice(100)
    }
    this.saveMessages(messages)
    return newMessage
  }

  getUserSettings(): UserSettings {
    return this.getItem('userSettings', {
      notifications: true,
      autoRefresh: true,
      theme: 'dark' as const,
      language: 'en'
    })
  }

  saveUserSettings(settings: UserSettings): void {
    this.setItem('userSettings', settings)
  }

  exportData(): string {
    const data = {
      incidents: this.getIncidents(),
      messages: this.getMessages(),
      settings: this.getUserSettings(),
      exportDate: new Date().toISOString()
    }
    return JSON.stringify(data, null, 2)
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      if (data.incidents) this.saveIncidents(data.incidents)
      if (data.messages) this.saveMessages(data.messages)
      if (data.settings) this.saveUserSettings(data.settings)
      return true
    } catch {
      return false
    }
  }
}

export const storage = new StorageManager()