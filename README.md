# CareBuddy

**Your Personal Healthcare Companion**

[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0.1-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2.2-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.101.1-3ECF8E?logo=supabase)](https://supabase.com/)

CareBuddy is a comprehensive, AI-powered healthcare management platform designed for families to track medications, monitor health vitals, manage vaccination schedules, and maintain health journals—all in one unified dashboard.

## Overview

CareBuddy solves the challenge of fragmented health management by providing a centralized platform where users can:

- Track medications with intelligent reminders and SMS notifications
- Monitor vital signs (BP, heart rate, SpO2, glucose) with visual analytics
- Manage family member profiles and their health records
- Track vaccination schedules for children and adults
- Log daily water intake with gamified hydration tracking
- Record workouts and fitness activities
- Maintain a private health journal with download capabilities
- Get AI-powered health insights via CareBot (Gemini AI integration)
- Receive real-time medication reminders via browser, in-app, and SMS notifications

**Target Users:**
- Family caregivers managing multiple members' health
- Individuals with chronic conditions requiring medication tracking
- Senior citizens needing medication reminders
- Health-conscious users tracking fitness and vitals
- Parents managing children's vaccination schedules

---

## Features

### 🔐 Authentication & User Management
- **Supabase Authentication** - Secure login with session management
- **Auto-redirect** - Authenticated users skip login, unauthenticated users redirected from dashboard
- **Session Persistence** - User sessions maintained across page refreshes
- **Username Customization** - Editable display name stored in localStorage

### 📊 Dashboard & Navigation
- **Dual Mode System** - Toggle between "Personal" (self-tracking) and "Family" (caregiver) modes
- **Dynamic Sidebar** - Context-aware navigation that changes based on selected mode
- **Responsive Layout** - Fixed navbar with collapsible sidebar and fluid main content area
- **Dark/Light Theme** - System preference detection with manual toggle and localStorage persistence

### 💊 Medication Management (Core Feature)
- **Medication Tracker** - Add, edit, delete medications with dosage, timing, and patient assignment
- **Visual Status Cards** - Color-coded indicators (Taken/Green, Urgent/Red, Upcoming/Blue)
- **Progress Dashboard** - Real-time percentage calculation of doses completed
- **Smart Reminders** - 60-second interval polling for medication due times
- **Multi-Channel Notifications:**
  - Browser push notifications (via Notification API)
  - SMS alerts (via configurable SMS provider API)
  - In-app toast notifications via CustomEvent system
- **Compliance Tracking** - Historical adherence statistics with trend visualization
- **Drug Interaction Checker** - Database of common medication contraindications with severity levels
- **Refill Monitoring** - Automatic low-stock alerts based on supply count vs. daily dosage
- **Mark as Taken** - One-click status toggle with timestamp logging

### 🏥 Health Vitals
- **4 Core Metrics** - Blood Pressure, Heart Rate, SpO2, Glucose Level
- **Editable Values** - Prompt-based updates for manual vital entry
- **Visual Cards** - Color-coded metric displays with trend icons
- **Vitals Summary** - Health insights with contextual recommendations

### 👪 Family Profiles
- **Member Management** - Add/remove family members with avatar generation
- **Profile Cards** - Display age, blood group, relation, and generated avatars (DiceBear API)
- **Health Cards** - Quick-access health summary per member (placeholder for future EMR integration)

### 💉 Vaccination Tracking
- **Complete Schedule** - Pre-loaded vaccination calendar from birth to adulthood
- **Status Filtering** - View All/Upcoming/Completed vaccines
- **Progress Tracking** - Percentage completion with visual progress bar
- **Mark as Done** - One-click completion with instant status update
- **Age-Based Scheduling** - Automatic age calculation (months/years) per vaccine

### 💧 Hydration Tracker
- **Daily Water Logging** - Incremental glass counter with 12-glass daily target
- **Circular Progress** - SVG-based animated progress ring
- **Gamification** - Health Points (HP) earned per glass
- **Milestone Tracking** - Encouragement messages at 8-glass milestones

### 🏃 Fitness Tracker
- **Activity Logging** - Manual workout entry (type + duration)
- **3 Key Metrics** - Steps, Calories Burned, Active Minutes
- **Weekly Score** - Aggregated fitness score with percentile ranking
- **Gamified Feedback** - Motivational health improvement estimates

### 📖 Health Journal
- **Rich Text Entries** - Unlimited entries with 1,000 word limit per entry
- **Entry Management** - Create, edit, delete, and star important entries
- **Timestamp Logging** - Automatic date/time tracking
- **Download Feature** - Export individual entries as .txt files
- **Starred Entries** - Highlighted visual distinction for important logs

### 🤖 CareBot AI Assistant
- **Gemini API Integration** - AI-powered health Q&A via Google Generative AI
- **Floating Chat Widget** - Fixed-position chatbot accessible from any dashboard page
- **Typing Indicators** - Animated dots during response generation
- **Message History** - Persistent conversation within session
- **Error Handling** - Graceful fallback for API failures

### 🔔 Notification System
- **Browser Notifications** - Native OS-level alert support
- **SMS Integration** - Live SMS delivery via external provider APIs
- **In-App Toasts** - CustomEvent-based notification system
- **Production/Test Modes** - Configurable environment for testing vs. live delivery
- **Phone Notification Service** - Modular utility class supporting multiple SMS providers

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.4 | UI component library with hooks |
| **React Router DOM** | 7.14.0 | Client-side routing |
| **Vite** | 8.0.1 | Build tool and dev server |
| **Tailwind CSS** | 4.2.2 | Utility-first CSS framework |
| **Framer Motion** | 12.38.0 | Animations and transitions |
| **Lucide React** | 1.7.0 | Icon library |

### Backend & Services
| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | 2.101.1 | Authentication and session management |
| **Gemini API** | (via REST) | AI chat responses |
| **DiceBear API** | (via CDN) | Avatar generation for family members |

### Build Tools
| Technology | Purpose |
|------------|---------|
| **ESLint** | Code linting with React Hooks and Refresh plugins |
| **PostCSS** | CSS processing with Autoprefixer |
| **Vite React Plugin** | Fast Refresh and JSX transformation |

### Deployment
| Platform | Configuration |
|----------|---------------|
| **Vercel** | SPA routing via `vercel.json` rewrite rules |

---

## Project Structure

```
CareBuddy/
├── public/                     # Static assets
│   └── favicon.svg
├── src/
│   ├── assets/                # Images and static resources
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginBox.jsx     # Login form component
│   │   ├── layout/
│   │   │   ├── Navbar.jsx       # Top navigation bar
│   │   │   └── Sidebar.jsx      # Side navigation menu
│   │   ├── sections/            # Dashboard feature modules
│   │   │   ├── Caretakers.jsx
│   │   │   ├── DietaryPlans.jsx
│   │   │   ├── FamilyProfiles.jsx
│   │   │   ├── Fitness.jsx
│   │   │   ├── Hospitals.jsx
│   │   │   ├── Hydration.jsx
│   │   │   ├── Journal.jsx
│   │   │   ├── Medications.jsx
│   │   │   ├── MentalHealth.jsx
│   │   │   ├── Moodometer.jsx
│   │   │   ├── Vaccinations.jsx
│   │   │   ├── Vitals.jsx
│   │   │   └── WomenHealth.jsx
│   │   ├── visuals/
│   │   │   └── FloatingEmojis.jsx # Animated background component
│   │   ├── CareBot.jsx          # AI chat widget
│   │   ├── MainContent.jsx      # Dashboard content router
│   │   ├── MedicationCompliance.jsx
│   │   ├── MedicationInteractions.jsx
│   │   ├── MedicationModal.jsx
│   │   └── MedicationNotification.jsx
│   ├── config/                  # Configuration files
│   │   └── notifications.js
│   ├── constants/               # Static data constants
│   │   └── healthData.js        # Vaccination schedules, etc.
│   ├── context/                 # React context providers
│   │   ├── ThemeContext.jsx
│   │   ├── ThemeProvider.jsx    # Dark/light mode provider
│   │   └── ThemeToggle.jsx
│   ├── hooks/                   # Custom React hooks
│   │   └── useDarkMode.js
│   ├── pages/                   # Route-level page components
│   │   ├── Dashboard.jsx        # Main dashboard layout
│   │   ├── Login.jsx           # Authentication page
│   │   └── Showcase.jsx        # Landing/splash screen
│   ├── services/               # API service modules (empty)
│   └── utils/                  # Utility classes and functions
│       ├── auth.js             # Authentication helpers
│       ├── gemini.js           # Gemini AI API integration
│       ├── medicationHistory.js # Medication logging
│       ├── medicationInteractions.js # Drug interaction database
│       ├── medicationReminders.js # Reminder scheduling system
│       ├── phoneNotifications.js # SMS service integration
│       └── refillMonitor.js    # Refill alert system
│   ├── App.jsx                 # Root application component
│   ├── index.css               # Global styles with Tailwind
│   └── main.jsx                # Application entry point
├── diagrams/                   # System analysis diagrams (draw.io)
├── .env                       # Environment variables
├── .env.example               # Environment template
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── vercel.json                # Vercel deployment config
└── vite.config.js             # Vite configuration
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root routing configuration with ThemeProvider wrapper |
| `src/pages/Dashboard.jsx` | Main dashboard container managing all state |
| `src/components/MainContent.jsx` | Section router based on active navigation |
| `src/utils/medicationReminders.js` | Core reminder scheduling with 60s polling |
| `src/utils/phoneNotifications.js` | SMS API integration with production/test modes |
| `src/components/CareBot.jsx` | AI chat interface with Gemini integration |
| `src/context/ThemeProvider.jsx` | Dark/light mode with localStorage persistence |

---

## Installation & Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn package manager

### 1. Clone Repository
```bash
git clone https://github.com/your-username/carebuddy.git
cd carebuddy
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# SMS Service Configuration (Required for phone notifications)
VITE_SMS_API_KEY=your_live_sms_api_key_here
VITE_SMS_API_ENDPOINT=https://api.sms-provider.com/v1/send
VITE_SMS_SENDER=CareBuddy

# Optional: Default phone number for testing
VITE_DEFAULT_PHONE_NUMBER=9913390910

# Production Mode Toggle
VITE_PRODUCTION_MODE=false
```

**Note:** The Supabase credentials are currently hardcoded in `src/pages/Login.jsx` and `src/pages/Showcase.jsx` for demo purposes. For production, move these to environment variables.

### 4. Run Locally
```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```

Output will be generated in the `dist/` directory.

---

## Usage Guide

### First-Time User Flow

1. **Landing Page** - View the animated CareBuddy showcase
2. **Auto-Redirect** - Automatically redirected to `/login` after 2.4 seconds
3. **Authentication** - Sign in with Supabase (magic link or OAuth providers)
4. **Dashboard Access** - Redirected to dashboard upon successful authentication

### Dashboard Navigation

**Mode Toggle (Navbar):**
- Click "Personal" to track your own health
- Click "Family" to manage family members' health

**Sidebar Sections:**
| Section | Mode | Description |
|---------|------|-------------|
| Vitals | Personal | Track BP, heart rate, SpO2, glucose |
| Medications | Both | Full medication management system |
| Journal | Personal | Private health diary |
| Family Profiles | Family | Manage family members |
| Vaccinations | Both | Immunization tracking |
| Hydration | Personal | Water intake logger |
| Fitness | Personal | Activity tracker |
| Caretakers | Family | Caregiver management |
| Dietary Plans | Both | Nutrition tracking |
| Moodometer | Personal | Mood tracking |
| Mental Health | Personal | Mental wellness tools |
| Women Health | Personal | Female-specific health |
| Hospitals | Both | Hospital locator/planner |

### Medication Management Workflow

1. Click "Add Medication" button
2. Fill in medication name, dosage, time, patient, and initial stock
3. Medication appears in list with "Upcoming" status
4. When reminder time arrives:
   - Browser notification appears
   - SMS sent (if configured)
   - In-app toast displayed
   - Card status changes to "Urgent"
5. Click "Mark Taken" to log dose and update history
6. System automatically schedules next day's reminder

### CareBot AI Usage

1. Click the floating chat button (bottom-right corner)
2. Type health-related questions
3. Receive AI-generated responses from Gemini
4. Close chat by clicking the X or the toggle button

---

## Screenshots / UI Description

**Note:** The following screenshots should be captured from the running application:

### Landing Page (Showcase)
- Animated gradient background
- Floating emoji particles
- "CareBuddy" logo with animated reveal
- Auto-redirect to login after 2.4 seconds

### Login Page
- Dark gradient theme with glass-morphism
- Floating emoji animations
- Theme toggle (sun/moon) in top-right
- Supabase-powered authentication form

### Dashboard Layout
- **Navbar:** Logo, mode toggle (Personal/Family), user greeting, settings
- **Sidebar:** Icon-based navigation with section labels
- **Main Content:** Fluid width feature modules
- **CareBot:** Fixed-position floating chat widget

### Medication Section
- Progress summary card (sticky, left sidebar)
- Medication cards in 2-column grid
- Color-coded status badges (Taken/Urgent/Upcoming)
- Action buttons: Mark Taken, Delete
- Toggle buttons for Compliance & Interactions panels
- "Send LIVE SMS" test button

### Family Profiles
- 3-column grid of member cards
- Avatar, name, relation, age, blood group
- "View Health Card" and delete actions
- "Add Member" button with prompt-based form

---

## Key Functional Modules

### 1. Medication Reminder System
**File:** `src/utils/medicationReminders.js`

```javascript
// Core class managing all medication reminders
class MedicationReminderSystem {
  - reminders: Map<medicationId, reminderData>
  - checkInterval: 60000ms (1 minute polling)
  - notificationPermission: Browser Notification API status
  - phoneNotificationsEnabled: boolean
  
  Methods:
  - initialize() - Request permissions, start polling
  - addReminder(medication) - Schedule new reminder
  - checkReminders() - Iterate and trigger due reminders
  - sendNotification(medication) - Multi-channel dispatch
  - testNotifications(phoneNumber) - Live SMS testing
}
```

### 2. Phone Notification Service
**File:** `src/utils/phoneNotifications.js`

Handles SMS delivery with configurable providers:
- Production mode with live API calls
- Test mode with console logging
- Environment-based configuration
- Support for custom SMS provider endpoints

### 3. Refill Monitor
**File:** `src/utils/refillMonitor.js`

- 6-hour interval stock checking
- Low stock threshold alerts
- Automatic refill reminders
- Customizable alert thresholds per medication

### 4. Drug Interaction Checker
**File:** `src/utils/medicationInteractions.js`

- Hardcoded database of common interactions
- Severity levels: High, Moderate, Low
- Contraindication descriptions
- Cross-medication analysis

### 5. Medication History
**File:** `src/utils/medicationHistory.js`

- localStorage-based dose logging
- Compliance statistics calculation
- Filter by medication, patient, date range
- Adherence percentage tracking

### 6. Theme Provider
**Files:** `src/context/ThemeProvider.jsx`, `src/context/ThemeContext.jsx`

- System preference detection
- Manual toggle with persistence
- Class-based dark mode switching
- Prevents flash on load (script in index.html)

### 7. Dashboard State Container
**File:** `src/pages/Dashboard.jsx`

Central state management for:
- Mode (personal/family)
- Active section
- User profile (name)
- Family members array
- Journal entries
- Medications array
- Vaccine count

All state persisted to localStorage via useEffect hooks.

---

## Deployment

### Vercel (Recommended)

**Pre-configured:** `vercel.json` contains SPA rewrite rules.

**Steps:**
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SMS_API_KEY`
   - `VITE_SMS_API_ENDPOINT`
   - `VITE_SMS_SENDER`
   - `VITE_DEFAULT_PHONE_NUMBER`
   - `VITE_PRODUCTION_MODE`
4. Deploy

**Configuration:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Other Platforms

For Netlify, Firebase, or AWS:
1. Run `npm run build` to generate `dist/` folder
2. Configure SPA fallback (all routes → index.html)
3. Set environment variables in platform dashboard
4. Deploy `dist/` folder contents

---

## Future Improvements

Based on current implementation analysis:

### High Priority
1. **Backend Integration** - Move from localStorage to Supabase PostgreSQL for data persistence across devices
2. **Mobile App** - Convert to React Native or PWA for native mobile experience
3. **Push Notifications** - Firebase Cloud Messaging for reliable mobile notifications
4. **EMR Integration** - Connect with hospital Electronic Medical Record systems
5. **PDF Export** - Generate medication reports and compliance summaries for doctors

### Medium Priority
6. **Voice Input** - Speech-to-text for medication entry and journal logging
7. **Barcode Scanning** - Scan medication packaging for auto-fill
8. **Vitals Wearable Sync** - Integrate with Fitbit, Apple Watch, glucose monitors
9. **Family Sharing** - Real-time sync between family members with permissions
10. **Multilingual Support** - Hindi, Tamil, Telugu for Indian market expansion

### Nice to Have
11. **Medication Image Recognition** - AI-based pill identification
12. **Telemedicine Integration** - Video consultation booking within app
13. **Insurance Integration** - Direct claims processing and coverage checking
14. **Health Trends ML** - Predictive analytics for health deterioration warnings
15. **Community Features** - Support groups and health challenges

---

## Contributors

| Name | Role | Contributions |
|------|------|---------------|
| **Priyanshu Nimavat** | Lead Developer | Architecture, core features, medication system |

*This project was developed as a healthcare technology solution for the Indian market.*

---

## License

[MIT License](LICENSE) - Open source, free for personal and commercial use.

---

## Support

For issues, feature requests, or contributions:
- Create an issue on GitHub
- Contact: [priyanshu.nimavat45@gmail.com]

---

**Built with ❤️ for healthier families**
