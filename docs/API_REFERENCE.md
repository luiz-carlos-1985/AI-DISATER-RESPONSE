# API Reference

## Storage Manager API

The Storage Manager provides client-side data persistence using localStorage. All data is stored locally in the browser.

### Incident Management

#### `getIncidents(): Incident[]`
Retrieves all stored incidents.

**Returns:** Array of Incident objects

**Example:**
```typescript
const incidents = storage.getIncidents()
console.log(incidents) // [{ id: 'INC-001', type: 'Fire', ... }]
```

#### `addIncident(incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>): Incident`
Creates a new incident with auto-generated ID and timestamps.

**Parameters:**
- `incident`: Incident data without ID and timestamps

**Returns:** Complete Incident object with generated fields

**Example:**
```typescript
const newIncident = storage.addIncident({
  type: 'Fire',
  location: 'Downtown District',
  severity: 'High',
  time: '14:32',
  responders: 8,
  status: 'Active'
})
```

#### `updateIncident(id: string, updates: Partial<Incident>): Incident | null`
Updates an existing incident.

**Parameters:**
- `id`: Incident ID
- `updates`: Partial incident data to update

**Returns:** Updated Incident object or null if not found

**Example:**
```typescript
const updated = storage.updateIncident('INC-001', {
  status: 'Resolved',
  responders: 12
})
```

#### `deleteIncident(id: string): boolean`
Deletes an incident by ID.

**Parameters:**
- `id`: Incident ID to delete

**Returns:** Boolean indicating success

**Example:**
```typescript
const deleted = storage.deleteIncident('INC-001')
```

### User Management

#### `getUser(): User | null`
Retrieves the current user data.

**Returns:** User object or null if not logged in

#### `saveUser(user: User): void`
Saves user data to storage.

**Parameters:**
- `user`: User object to save

#### `clearUser(): void`
Removes user data from storage (logout).

### Message Management

#### `getMessages(): Message[]`
Retrieves all communication messages.

**Returns:** Array of Message objects (max 100, newest first)

#### `addMessage(message: Omit<Message, 'id'>): Message`
Adds a new communication message.

**Parameters:**
- `message`: Message data without ID

**Returns:** Complete Message object with generated ID

**Example:**
```typescript
const message = storage.addMessage({
  from: 'Fire Chief',
  message: 'Unit 7 requesting backup',
  time: '16:45',
  priority: 'high',
  channel: 'Command'
})
```

### Settings Management

#### `getUserSettings(): UserSettings`
Retrieves user settings with defaults.

**Returns:** UserSettings object

#### `saveUserSettings(settings: UserSettings): void`
Saves user settings.

**Parameters:**
- `settings`: UserSettings object

### Data Export/Import

#### `exportData(): string`
Exports all data as JSON string.

**Returns:** JSON string containing all stored data

#### `importData(jsonData: string): boolean`
Imports data from JSON string.

**Parameters:**
- `jsonData`: JSON string with data to import

**Returns:** Boolean indicating success

## Component APIs

### AuthModal

**Props:**
```typescript
interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string, password: string) => void
  onRegister: (name: string, email: string, password: string) => void
}
```

### PremiumFeatures

**Props:**
```typescript
interface PremiumFeaturesProps {
  userPlan: string
  onUpgrade: () => void
}
```

### UserMenu

**Props:**
```typescript
interface UserMenuProps {
  user: User
  onUpgrade: () => void
  onLogout: () => void
}
```

## Data Types

### Incident
```typescript
interface Incident {
  id: string                    // Auto-generated unique ID
  type: string                  // Incident type (Fire, Medical, etc.)
  location: string              // Incident location
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  time: string                  // Incident time
  responders: number            // Number of responders
  status: 'Active' | 'Resolved' | 'In Progress'
  description?: string          // Optional description
  coordinates?: { lat: number; lng: number }  // Optional GPS coordinates
  createdAt: string            // ISO timestamp
  updatedAt: string            // ISO timestamp
}
```

### User
```typescript
interface User {
  name: string                 // User display name
  email: string                // User email
  plan: string                 // Subscription plan
  avatar?: string              // Optional avatar URL
  settings?: UserSettings      // Optional user settings
}
```

### UserSettings
```typescript
interface UserSettings {
  notifications: boolean       // Enable notifications
  autoRefresh: boolean        // Auto-refresh data
  theme: 'dark' | 'light'     // UI theme
  language: string            // Language code
}
```

### Message
```typescript
interface Message {
  id: string                   // Auto-generated unique ID
  from: string                 // Sender name
  message: string              // Message content
  time: string                 // Message timestamp
  priority: 'low' | 'medium' | 'high'  // Message priority
  channel: string              // Communication channel
}
```

## Error Handling

All storage operations include error handling:

- **localStorage unavailable**: Functions return default values
- **JSON parsing errors**: Functions return default values
- **Storage quota exceeded**: Errors logged to console
- **Invalid data**: Functions validate input and return appropriate responses

## Browser Compatibility

The Storage Manager works in all modern browsers that support:
- localStorage API
- JSON.parse/stringify
- ES6+ features

## Security Considerations

- All data is stored locally in the browser
- No sensitive data should be stored in plain text
- Clear storage on logout for security
- Validate all input data before storage
- Consider encryption for sensitive information

## Performance Notes

- localStorage is synchronous and can block UI
- Limit stored data size (typically 5-10MB per domain)
- Messages are automatically limited to 100 entries
- Use batch operations when possible
- Consider IndexedDB for larger datasets