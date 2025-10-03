# EmergencyAI - Disaster Response Coordination System

## Overview

EmergencyAI is a comprehensive disaster response coordination system designed to help emergency services manage incidents, coordinate resources, and communicate effectively during crisis situations. The system provides real-time monitoring, resource allocation, and communication tools for emergency responders.

## Features

### Core Features
- **Real-time Incident Tracking**: Monitor active incidents with severity levels and response status
- **Resource Management**: Track and deploy emergency resources (medical teams, fire departments, police units, rescue teams)
- **Live Communication System**: Command center communications with priority messaging
- **Interactive Dashboard**: Visual representation of incidents, resources, and system status
- **Equipment Status Monitoring**: Track operational status of emergency vehicles and equipment

### Premium Features
- **AI Incident Predictions**: Machine learning-based disaster prediction 24-48 hours in advance
- **Advanced Analytics Dashboard**: Deep insights with custom reports and performance metrics
- **Real-time Satellite Data**: Live satellite imagery and weather data integration
- **Unlimited Incident Tracking**: Handle unlimited simultaneous active incidents

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion for animations
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Storage**: Local Storage (client-side data persistence)

## System Architecture

### Components Structure
```
components/
├── AuthModal.tsx          # User authentication modal
├── IncidentModal.tsx      # Incident creation/editing modal
├── MessageModal.tsx       # Communication message modal
├── NotificationSystem.tsx # System notifications
├── PremiumFeatures.tsx    # Premium features showcase
├── PremiumModal.tsx       # Subscription upgrade modal
├── SettingsModal.tsx      # User settings configuration
└── UserMenu.tsx          # User profile menu
```

### Core Modules
```
lib/
└── storage.ts            # Data persistence and management
```

### Pages
```
pages/
├── _app.tsx             # Application wrapper
└── index.tsx            # Main dashboard
```

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-disaster-response
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open browser and navigate to `http://localhost:4004`

### Build for Production
```bash
npm run build
npm start
```

## User Guide

### Getting Started

1. **Authentication**
   - Click "Sign In" to access the system
   - Create a new account or login with existing credentials
   - Free tier provides basic functionality

2. **Dashboard Navigation**
   - **Command Center**: Main dashboard with incident overview
   - **Active Incidents**: Detailed incident management
   - **Resources**: Resource allocation and equipment status
   - **Communications**: Command center messaging system
   - **Premium Features**: Advanced capabilities (requires upgrade)

### Core Functionality

#### Incident Management
- View active incidents with real-time updates
- Monitor incident severity levels (Low, Medium, High, Critical)
- Track responder deployment and response times
- Update incident status and dispatch additional resources

#### Resource Allocation
- Monitor available vs. deployed resources
- Track utilization rates for different response teams
- Deploy and recall emergency units
- View equipment operational status

#### Communication System
- Send emergency broadcasts
- Monitor radio channel activity
- View priority messages from field teams
- Access emergency contact directory

#### Analytics & Reporting
- 24-hour incident timeline visualization
- Resource deployment charts
- Response time metrics
- System performance indicators

## Data Models

### Incident
```typescript
interface Incident {
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
```

### User
```typescript
interface User {
  name: string
  email: string
  plan: string
  avatar?: string
  settings?: UserSettings
}
```

### Message
```typescript
interface Message {
  id: string
  from: string
  message: string
  time: string
  priority: 'low' | 'medium' | 'high'
  channel: string
}
```

## Configuration

### Environment Variables
Create a `.env.local` file for environment-specific configuration:
```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_MAP_API_KEY=your_map_api_key
```

### Customization
- Modify `tailwind.config.js` for styling customization
- Update `next.config.js` for Next.js configuration
- Adjust port in `package.json` scripts (default: 4004)

## Security Features

- Client-side data encryption for sensitive information
- Secure authentication flow
- Role-based access control for premium features
- Data validation and sanitization

## Performance Optimization

- Server-side rendering with Next.js
- Optimized bundle splitting
- Lazy loading for components
- Efficient state management
- Responsive design for mobile devices

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Change port in package.json or kill existing process
   npx kill-port 4004
   ```

2. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

3. **Storage Issues**
   - Clear browser localStorage if data corruption occurs
   - Use browser developer tools to inspect stored data

### Performance Issues
- Check browser console for JavaScript errors
- Verify network connectivity for real-time features
- Clear browser cache and cookies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Screenshots: 

<img width="1256" height="1044" alt="image" src="https://github.com/user-attachments/assets/01b6e540-e52e-4d4c-ba98-944b9da2a961" />

<img width="1012" height="1040" alt="image" src="https://github.com/user-attachments/assets/a1c3552e-55a9-49f8-af04-8af2eba3b67a" />

<img width="1040" height="854" alt="image" src="https://github.com/user-attachments/assets/0ad3ef4c-1da1-4bbe-a040-cc39623e52e2" />

<img width="1188" height="1046" alt="image" src="https://github.com/user-attachments/assets/b5c9b830-afa9-49b5-8c8c-02835b72d770" />

<img width="1190" height="992" alt="image" src="https://github.com/user-attachments/assets/21402499-3ab0-4b10-a132-e3f8e7685db7" />

<img width="1205" height="983" alt="image" src="https://github.com/user-attachments/assets/a7ba7459-c578-4a83-bc8a-5afc5c614fb9" />

<img width="1201" height="997" alt="image" src="https://github.com/user-attachments/assets/327b3328-a1d7-4a62-ba45-848d4a86b9b7" />

<img width="1207" height="996" alt="image" src="https://github.com/user-attachments/assets/15d2c34a-53e5-47d7-9a3d-b2ec7feb6208" />

<img width="1231" height="1004" alt="image" src="https://github.com/user-attachments/assets/0045d6aa-2571-44fd-923e-c329797f271a" />

<img width="1545" height="986" alt="image" src="https://github.com/user-attachments/assets/e10838e4-4204-456e-9164-f98d3335b970" />

<img width="1328" height="973" alt="image" src="https://github.com/user-attachments/assets/03e869c9-1da6-453a-92bd-8fc3839880c2" />

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## Roadmap

### Upcoming Features
- Mobile application
- Advanced AI predictions
- Integration with external emergency services
- Multi-language support
- Enhanced reporting capabilities
- API for third-party integrations

### Version History
- v1.0.0: Initial release with core functionality
- Future versions will include enhanced AI capabilities and integrations
