import { storage, Incident, Message } from './storage'

export function initializeDefaultData() {
  // Check if data already exists
  const existingIncidents = storage.getIncidents()
  const existingMessages = storage.getMessages()

  // Only add default data if none exists and not already initialized
  const isInitialized = localStorage.getItem('emergency-system-initialized')
  
  if (existingIncidents.length === 0 && !isInitialized) {
    const defaultIncidents: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        type: 'Fire',
        location: 'Downtown District - Main Street 123',
        severity: 'High',
        time: '14:32',
        responders: 8,
        status: 'Active',
        description: 'Large building fire with potential for spread to adjacent structures. Multiple units responding.'
      },
      {
        type: 'Medical',
        location: 'Residential Area - Oak Avenue 456',
        severity: 'Medium',
        time: '15:45',
        responders: 3,
        status: 'In Progress',
        description: 'Cardiac emergency, patient stabilized and being transported to hospital.'
      },
      {
        type: 'Accident',
        location: 'Highway 101 - Mile Marker 15',
        severity: 'Low',
        time: '16:12',
        responders: 4,
        status: 'Active',
        description: 'Multi-vehicle accident, minor injuries reported. Traffic being diverted.'
      },
      {
        type: 'Natural Disaster',
        location: 'Riverside Park Area',
        severity: 'Critical',
        time: '13:20',
        responders: 15,
        status: 'Resolved',
        description: 'Flash flood warning issued. Area evacuated successfully, no casualties reported.'
      },
      {
        type: 'Security',
        location: 'City Hall - Government District',
        severity: 'Medium',
        time: '11:30',
        responders: 6,
        status: 'Resolved',
        description: 'Suspicious package reported. Bomb squad cleared the area, false alarm confirmed.'
      }
    ]

    defaultIncidents.forEach(incident => {
      storage.addIncident(incident)
    })
    localStorage.setItem('emergency-system-initialized', 'true')
  }

  if (existingMessages.length === 0 && !isInitialized) {
    const defaultMessages: Omit<Message, 'id'>[] = [
      {
        from: 'Fire Chief',
        message: 'Unit 7 requesting backup at downtown incident. Fire spreading to adjacent building.',
        time: '16:45',
        priority: 'high',
        channel: 'Fire Ops'
      },
      {
        from: 'Medical Team 3',
        message: 'Patient stabilized, en route to General Hospital. ETA 10 minutes.',
        time: '16:42',
        priority: 'medium',
        channel: 'Medical'
      },
      {
        from: 'Police Captain',
        message: 'Traffic diverted from Highway 101, all clear. Tow trucks en route.',
        time: '16:38',
        priority: 'low',
        channel: 'Police'
      },
      {
        from: 'Rescue Team 1',
        message: 'Search area secured, no additional casualties found. Standing by for further orders.',
        time: '16:35',
        priority: 'medium',
        channel: 'Command'
      },
      {
        from: 'Command Center',
        message: 'All units, weather alert issued. Thunderstorms expected in 2 hours.',
        time: '16:30',
        priority: 'medium',
        channel: 'Command'
      }
    ]

    defaultMessages.forEach(message => {
      storage.addMessage(message)
    })
  }
}