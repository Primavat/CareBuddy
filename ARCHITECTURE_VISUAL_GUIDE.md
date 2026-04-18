# CareBuddy Architecture - Quick Visual Reference

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                                   │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    REACT SPA (Vite Bundle)                        │ │
│  │                                                                   │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │ │
│  │  │   Router     │  │  Components  │  │   Services Layer    │  │ │
│  │  │              │  │              │  │                     │  │ │
│  │  │ /            │  │ • Dashboard  │  │ • MedicationSystem  │  │ │
│  │  │ /login       │  │ • Navbar     │  │ • RefillMonitor     │  │ │
│  │  │ /dashboard   │  │ • Sidebar    │  │ • Interactions      │  │ │
│  │  │              │  │ • Meds       │  │ • Phone Notif       │  │ │
│  │  │              │  │ • CareBot    │  │ • Gemini Client     │  │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬──────────────┘  │ │
│  │         │                 │                  │                  │ │
│  │         └────────────┬────┴──────────────────┘                  │ │
│  │                      │                                           │ │
│  │                      ▼                                           │ │
│  │         ┌────────────────────────────┐                         │ │
│  │         │   React Context +          │                         │ │
│  │         │   Component State          │                         │ │
│  │         │   (Props drilling)         │                         │ │
│  │         └──────────┬─────────────────┘                         │ │
│  │                    │                                            │ │
│  │                    ▼                                            │ │
│  │         ┌────────────────────────────┐                         │ │
│  │         │   Browser localStorage     │                         │ │
│  │         │   (All app data persists)  │                         │ │
│  │         └────────────────────────────┘                         │ │
│  │                                                                │ │
│  │  ┌────────────────────────────────────────────────────────┐  │ │
│  │  │            Styling & Rendering                        │  │ │
│  │  │  • Tailwind CSS (dark mode via CSS)                   │  │ │
│  │  │  • Framer Motion (animations)                         │  │ │
│  │  │  • Browser Notifications API                          │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                  Network Requests (Fetch API)                 │  │
│  │                                                               │  │
│  │  POST /api/chat (CareBot)                                    │  │
│  │  POST {SMS_ENDPOINT} (Reminders)                             │  │
│  │  POST auth.supabase.co (Login)                               │  │
│  └────────────────────┬───────────────────────────────────────┬──┘  │
└───────────────────────┼───────────────────────────────────────┼──────┘
                        │                                       │
        ┌───────────────┘                                       │
        │                                                       │
        ▼                                                       ▼
   ┌─────────────────┐                            ┌──────────────────────┐
   │   Vercel Edge   │                            │  External Services   │
   │                 │                            │                      │
   │ • Rewrite SPAs  │                            │ • Google Gemini API  │
   │ • Route requests│                            │ • Supabase Auth      │
   └────────┬────────┘                            │ • SMS Provider       │
            │                                     │   (Twilio/AWS)       │
            ▼                                     └──────────────────────┘
   ┌─────────────────┐
   │  /api/chat      │
   │  (Serverless)   │
   │                 │
   │ • Gets Gemini   │
   │   API key from  │
   │   environment   │
   │ • Calls Gemini  │
   │ • Returns resp  │
   └─────────────────┘
```

---

## 2. User Journey Flow

```
START
  │
  ▼
[User Opens carebuddy.vercel.app]
  │
  ├─→ Vercel Edge Server
  │   ├─→ SPA Rewrite: /(.*) → /index.html
  │   └─→ Download React bundle (~150-200KB gzipped)
  │
  ▼
[React App Initializes]
  │
  ├─→ ThemeProvider loads carebuddy_theme from localStorage
  ├─→ React Router evaluates current route
  └─→ Render appropriate page (Showcase/Login/Dashboard)
  │
  ▼
[Check Authentication]
  │
  ├─→ Already logged in?
  │   └─→ Go to /dashboard
  │
  └─→ Not logged in?
      └─→ Go to /login
          │
          ▼
          [Login Page]
          │
          ├─→ User enters credentials
          ├─→ LoginBox calls supabase.auth.signInWithPassword()
          │
          ▼
          [Supabase Auth Server]
          │
          ├─→ Validate against PostgreSQL users table
          ├─→ Issue JWT token
          └─→ Return session object
          │
          ▼
          [Browser - Store Session]
          │
          ├─→ supabase-js stores JWT in memory
          ├─→ React Router navigates to /dashboard
          └─→ User now authenticated
  │
  ▼
[Dashboard Loads]
  │
  ├─→ Dashboard.jsx mounts
  ├─→ Load state from localStorage:
  │   ├─ userName (from carebuddy_username)
  │   ├─ members (from carebuddy_members)
  │   ├─ medications (from carebuddy_medications)
  │   └─ journalEntries (from carebuddy_journal)
  │
  ├─→ Render layout:
  │   ├─ Navbar (top bar)
  │   ├─ Sidebar (navigation)
  │   ├─ MainContent (dynamic section)
  │   ├─ CareBot (chat widget)
  │   └─ MedicationNotification (toast)
  │
  ▼
[User Interacts]
  │
  ├─→ Click "Add Medication"
  │   ├─→ MedicationModal opens
  │   ├─→ User fills form
  │   ├─→ Calls Dashboard.setMedications()
  │   ├─→ State updates → props flow down
  │   ├─→ useEffect persists to localStorage
  │   ├─→ MedicationReminderSystem.addReminder()
  │   └─→ UI re-renders with new med
  │
  ├─→ Click "Ask CareBot"
  │   ├─→ User types message
  │   ├─→ Clicks Send
  │   ├─→ Calls fetch('/api/chat', {...})
  │   │
  │   ├─→ [Dev] Hits Vite middleware
  │   │   └─→ carebuddyChatApiPlugin intercepts
  │   │
  │   ├─→ [Prod] Hits Vercel serverless /api/chat
  │   │   └─→ api/chat.js handler
  │   │
  │   ├─→ Server calls Gemini API (with API key)
  │   ├─→ Returns response JSON
  │   ├─→ Browser displays bot message
  │   └─→ Conversation history stored in component state
  │
  └─→ [Background] Every 60 seconds:
      └─→ medicationReminderSystem.checkReminders()
          ├─→ If reminder time reached:
          │   ├─→ Send browser notification (Notifications API)
          │   ├─→ Send SMS (phoneNotificationService.sendSMS)
          │   │   └─→ fetch(SMS_ENDPOINT) with API key
          │   └─→ SMS Provider delivers message
          └─→ Continue checking...

ONGOING
  │
  ├─→ Every user action:
  │   └─→ localStorage updated automatically
  │
  └─→ Every page reload:
      └─→ All data restored from localStorage
          (offline-first architecture)

END
```

---

## 3. Component Data Flow Tree

```
<App>
  └── <ThemeProvider> [Manages dark/light mode]
      │
      ├── Context: isDark, toggleTheme()
      └── Provides to all children via useTheme()
  
  └── <BrowserRouter>
      │
      └── <Routes>
          │
          ├── <Showcase/>      [Landing page]
          │   └── Shows features, CTA buttons
          │
          ├── <Login/>         [Auth page]
          │   ├── State: email, password
          │   ├── LoginBox component
          │   ├── Calls supabase.auth.signInWithPassword()
          │   └── On success: Navigate to /dashboard
          │
          └── <Dashboard/>     [Main app - ROOT STATE]
              │
              ├── State:
              │   ├── userName (localStorage)
              │   ├── members (localStorage)
              │   ├── medications (localStorage)
              │   ├── journalEntries (localStorage)
              │   ├── mode ('personal' | 'family')
              │   ├── activeSection (current nav)
              │   └── vaccineCount (tracking)
              │
              ├── useEffect Hooks:
              │   ├── Sync userName to localStorage
              │   ├── Sync members to localStorage
              │   ├── Sync journalEntries to localStorage
              │   ├── Sync medications to localStorage
              │   └── Update activeSection when mode changes
              │
              ├── <Navbar> [Receives: mode, setMode, userName, setUserName]
              │   ├── Mode toggle button
              │   ├── Theme toggle (uses ThemeProvider context)
              │   └── Username display (editable)
              │
              ├── <Sidebar> [Receives: mode, activeSection, setActiveSection]
              │   ├── Navigation links
              │   ├── Updates activeSection on click
              │   └── Shows vaccine count badge
              │
              ├── <MainContent> [Receives: mode, activeSection, members, medications, etc.]
              │   │
              │   └── Renders based on activeSection:
              │       ├── activeSection === 'medications'
              │       │   └── <Medications> [Receives: members, medications, setMedications]
              │       │       ├── State:
              │       │       │   ├── meds (local copy of medications prop)
              │       │       │   ├── isModalOpen
              │       │       │   ├── showCompliance
              │       │       │   └── showInteractions
              │       │       │
              │       │       ├── useEffect (on mount):
              │       │       │   ├── medicationReminderSystem.initialize()
              │       │       │   ├── refillMonitor.initialize()
              │       │       │   └── Set up cleanup on unmount
              │       │       │
              │       │       ├── <MedicationModal>
              │       │       │   ├── Form inputs
              │       │       │   ├── onSave → calls addMedication()
              │       │       │   └── Updates parent state
              │       │       │
              │       │       ├── <MedicationCompliance>
              │       │       │   └── Shows compliance stats & charts
              │       │       │
              │       │       └── <MedicationInteractions>
              │       │           └── Shows drug interaction warnings
              │       │
              │       ├── activeSection === 'vitalsSection'
              │       │   └── <Vitals>
              │       │       └── BP, heart rate, SpO2, glucose tracking
              │       │
              │       ├── activeSection === 'journalSection'
              │       │   └── <Journal>
              │       │       └── Health journal entries
              │       │
              │       └── ... [11 more sections]
              │
              ├── <CareBot> [Standalone, not receiving props]
              │   ├── State:
              │   │   ├── isOpen (bool)
              │   │   ├── input (message text)
              │   │   ├── messages (array of { role, text })
              │   │   └── isTyping (bool)
              │   │
              │   ├── On message send:
              │   │   ├── Add user message to messages
              │   │   ├── Call requestGeminiReply(input)
              │   │   │   └── fetch('/api/chat', { POST, body: { message } })
              │   │   ├── Receive response
              │   │   ├── Add bot message to messages
              │   │   └── Display in chat
              │   │
              │   └── UI:
              │       ├── Chat bubble (animated with Framer Motion)
              │       ├── Message history
              │       ├── Typing indicator
              │       └── Send button
              │
              └── <MedicationNotification> [Standalone]
                  ├── Listens to browser notification events
                  ├── Displays toast for medication alerts
                  └── Also shows SMS delivery status
```

---

## 4. Data Persistence Layer

```
┌───────────────────────────────────────────────────────────┐
│           BROWSER localStorage (LOCAL STORAGE)            │
│                                                           │
│  Keys used by CareBuddy:                                 │
│                                                           │
│  carebuddy_username                                       │
│  └─ String: Current user's display name                  │
│     Example: "Priyanshu Nimavat"                         │
│                                                           │
│  carebuddy_members                                        │
│  └─ JSON Array: Family member profiles                    │
│     Example: [{ name, age, relationship }, ...]         │
│                                                           │
│  carebuddy_medications                                    │
│  └─ JSON Array: Medication list                          │
│     Example: [{                                           │
│       id, name, dosage, time, status,                    │
│       patient, currentStock, lowThreshold                │
│     }, ...]                                               │
│                                                           │
│  carebuddy_journal                                        │
│  └─ JSON Array: Journal entries                          │
│     Example: [{                                           │
│       id, date, mood, entry, tags                        │
│     }, ...]                                               │
│                                                           │
│  carebuddy_medication_history                             │
│  └─ JSON Array: Compliance tracking                       │
│     Example: [{                                           │
│       medicationId, date, status, notes                  │
│     }, ...]                                               │
│                                                           │
│  carebuddy_theme                                          │
│  └─ String: Theme preference                             │
│     Example: "dark" | "light"                            │
│                                                           │
│  [Future keys for other health data]                      │
│  └─ carebuddy_vitals                                      │
│  └─ carebuddy_vaccinations                               │
│  └─ carebuddy_hospital_records                           │
│                                                           │
└───────────────────────────────────────────────────────────┘

FLOW:
User Action → Component State Update → useEffect → localStorage.setItem()
    ↓                                                    ↓
Component re-renders                      Data persisted to disk
    ↓                                          ↓
Page reload/refresh                   localStorage.getItem() reads data
    ↓                                          ↓
useState initializes from localStorage    State restored
    ↓
UI shows previous session's data

CAPACITY: ~5-10MB per domain (browser dependent)
PERSISTENCE: Until user clears browser data
SCOPE: Single browser, single device
OFFLINE: Works with all stored data
```

---

## 5. API Integration Points

```
┌──────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL API INTEGRATIONS                         │
└──────────────────────────────────────────────────────────────────────┘

1. GEMINI API (AI Chat)
   ├── Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
   ├── Method: POST
   ├── Auth: API key in URL query param (?key=...)
   ├── Flow:
   │   Browser
   │     ↓ fetch('/api/chat', { POST, body: { message } })
   │   Vercel Function (api/chat.js) OR Vite Middleware
   │     ↓ Has GEMINI_API_KEY or VITE_GEMINI_API_KEY from environment
   │   Google API Server
   │     ↓ Returns generated text
   │   Back to Browser
   │
   ├── Request Body:
   │   {
   │     "contents": [{ "parts": [{ "text": "message here" }] }],
   │     "systemInstruction": {
   │       "parts": [{ "text": "You are CareBot..." }]
   │     }
   │   }
   │
   └── Response:
       {
         "candidates": [{
           "content": {
             "parts": [{ "text": "AI generated response..." }]
           }
         }]
       }

2. SMS API (Notifications)
   ├── Endpoint: {VITE_SMS_API_ENDPOINT} (configured in env)
   ├── Method: POST
   ├── Auth: Bearer token in Authorization header
   ├── Flow:
   │   medicationReminderSystem
   │     ↓ sends notification at scheduled time
   │   phoneNotificationService.sendSMS()
   │     ↓ fetch(SMS_ENDPOINT, { POST, headers, body })
   │   SMS Provider (Twilio/AWS/etc)
   │     ↓ routes SMS to phone
   │   Phone receives SMS
   │
   ├── Request Body:
   │   {
   │     "to": "9913390910",
   │     "message": "CareBuddy Reminder: Time to take Paracetamol",
   │     "sender": "CareBuddy"
   │   }
   │
   └── Response:
       {
         "messageId": "sms_12345",
         "status": "sent"
       }

3. SUPABASE AUTH (Authentication)
   ├── Service: https://idbratjfnpkzmbfzcehr.supabase.co
   ├── Method: REST API (handled by supabase-js SDK)
   ├── Flow:
   │   LoginBox
   │     ↓ supabase.auth.signInWithPassword(email, password)
   │   Supabase Auth Server
   │     ↓ Query PostgreSQL users table
   │     ↓ Validate credentials
   │     ↓ Issue JWT token
   │   Browser receives JWT
   │     ↓ supabase-js stores in memory
   │     ↓ React Router navigates to /dashboard
   │
   └── On Every Request:
       JWT automatically included in Authorization header
       (handled by supabase-js middleware)

4. DEVICE APIS (No external server)
   ├── Browser Notifications API
   │   └── Shows in-app and system notifications
   │
   ├── localStorage API
   │   └── All app data persisted locally
   │
   ├── Web Notification Permission
   │   └── User grants permission on first use
   │
   └── System Time
       └── Used for reminder scheduling
```

---

## 6. Deployment Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT ENVIRONMENT                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  npm run dev                                                   │
│     ↓                                                          │
│  Vite Dev Server (localhost:5173)                             │
│     ├─→ Hot Module Replacement (HMR)                          │
│     ├─→ carebuddyChatApiPlugin Middleware                     │
│     │   └─→ Intercepts /api/chat requests                     │
│     │   └─→ Reads VITE_GEMINI_API_KEY from .env              │
│     │   └─→ Calls Gemini API directly                         │
│     ├─→ Serves React components                               │
│     └─→ Compiles Tailwind CSS on-the-fly                      │
│                                                                │
│  Browser: http://localhost:5173                               │
│     ├─→ JavaScript updated instantly (HMR)                    │
│     ├─→ CSS recompiled instantly                              │
│     └─→ No need to refresh page manually                      │
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                  BUILD PROCESS (npm run build)                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Source Code (src/)                                            │
│     ↓                                                          │
│  Vite Bundler                                                  │
│     ├─→ Code splitting by route                               │
│     ├─→ Tree-shaking (remove unused code)                     │
│     ├─→ Minification (reduce file size)                       │
│     ├─→ Tailwind CSS purging (only used styles)               │
│     └─→ Asset optimization (images, icons)                    │
│     ↓                                                          │
│  dist/ folder                                                  │
│     ├─→ index.html                                            │
│     ├─→ assets/main-[hash].js (~150-200KB gzipped)           │
│     ├─→ assets/index-[hash].css (~20-30KB gzipped)           │
│     └─→ assets/[icons, images, etc]                           │
│                                                                │
│  npm run build is called by Vercel on deploy                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│            PRODUCTION DEPLOYMENT (Vercel)                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Push to GitHub                                             │
│     ↓                                                          │
│  2. Vercel Webhook Triggered                                   │
│     ↓                                                          │
│  3. Vercel Build Process                                       │
│     ├─→ npm install (dependencies)                            │
│     ├─→ npm run build (bundle app)                            │
│     └─→ dist/ contents → Vercel Edge Network (CDN)            │
│     ↓                                                          │
│  4. Serverless Functions (api/ folder)                        │
│     ├─→ api/chat.js → Deployed as /api/chat endpoint         │
│     ├─→ Reads GEMINI_API_KEY from environment                 │
│     └─→ Executes on request (cold start ~100-500ms)          │
│     ↓                                                          │
│  5. vercel.json Configuration                                  │
│     └─→ SPA Rewrite: /(.*) → /index.html                      │
│        (allows React Router to handle all routes)            │
│     ↓                                                          │
│  6. Live at https://carebuddy.vercel.app                      │
│     ├─→ Static files served from CDN (instant)                │
│     ├─→ /api/chat serverless function (on-demand)             │
│     └─→ All routes rewrite to index.html for routing         │
│                                                                │
│  ENVIRONMENT VARIABLES (Set in Vercel Dashboard)              │
│     ├─→ GEMINI_API_KEY                                        │
│     ├─→ VITE_GEMINI_API_KEY                                   │
│     ├─→ VITE_SMS_API_KEY                                      │
│     ├─→ VITE_SMS_API_ENDPOINT                                 │
│     ├─→ VITE_SMS_SENDER                                       │
│     ├─→ VITE_PRODUCTION_MODE=true                             │
│     └─→ VITE_DEFAULT_PHONE_NUMBER                             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 7. Service Classes Overview

```
┌──────────────────────────────────────────────────────────────────┐
│              SERVICE LAYER (utils/ & services/)                  │
└──────────────────────────────────────────────────────────────────┘

MedicationReminderSystem (medicationReminders.js)
├── Purpose: Schedule & send medication reminders
├── Public Methods:
│   ├── initialize()           - Start system, request permissions
│   ├── addReminder(med)       - Schedule medication reminder
│   ├── removeReminder(id)     - Cancel reminder
│   ├── updateReminder(med)    - Update scheduled reminder
│   ├── checkReminders()       - Check if any meds are due (runs every 60s)
│   ├── sendNotification(med)  - Send browser + SMS notification
│   └── destroy()              - Cleanup on unmount
├── Integrations:
│   ├── Uses: phoneNotificationService.sendSMS()
│   ├── Uses: Browser Notifications API
│   └── Reads: medications from localStorage
└── Triggered by: Medications.jsx component lifecycle

PhoneNotificationService (phoneNotifications.js)
├── Purpose: Send SMS notifications
├── Public Methods:
│   ├── initialize(config)     - Setup API credentials
│   ├── sendSMS(phone, msg)    - Send SMS message
│   ├── enableTestMode()       - Switch to test mode
│   ├── enableProductionMode() - Switch to production mode
│   └── getStatus()            - Get current configuration
├── Modes:
│   ├── Test Mode: Logs to console, simulates delay
│   └── Production Mode: Actual HTTP requests to SMS API
├── Configuration:
│   ├── apiKey (Bearer token)
│   ├── apiEndpoint (REST URL)
│   ├── testPhoneNumber (for testing)
│   └── productionMode (boolean)
└── External API: POST {SMS_ENDPOINT}

MedicationInteractionChecker (medicationInteractions.js)
├── Purpose: Check for drug interactions
├── Public Methods:
│   ├── checkInteractions(meds) - Find all pairwise interactions
│   └── getContraindications(drug) - Get contraindications
├── Data:
│   ├── interactionDatabase (hardcoded ~50 drugs)
│   └── contraindications (medical conditions)
├── Limitations:
│   └── Static data (not real-time)
└── Used by: MedicationInteractions.jsx component

RefillMonitor (refillMonitor.js)
├── Purpose: Monitor medication stock levels
├── Public Methods:
│   ├── initialize()           - Start monitoring
│   ├── checkRefillAlerts()    - Check if any meds need refill
│   ├── addMonitoredMed(med)   - Add med to monitor
│   └── destroy()              - Cleanup
├── Trigger Frequency: Every 6 hours
├── Condition: currentStock ≤ lowStockThreshold
├── Action: Send browser + SMS notification
└── Reads: medications from localStorage

Gemini Integration (gemini.js + lib/geminiServer.js)
├── Client-Side Function: requestGeminiReply(message)
│   ├── Validates message not empty
│   ├── Calls fetch('/api/chat', POST)
│   └── Returns bot response text
├── Server-Side Function: callGeminiGenerateContent()
│   ├── Constructs Gemini API request
│   ├── Includes system instruction
│   ├── Sends with API key (server-side secure)
│   └── Parses response
├── Model: gemini-2.0-flash (latest, fastest)
├── System Instruction: "You are CareBot, a medical assistant..."
└── Usage: Triggered by CareBot.jsx on message send

Auth Utilities (auth.js)
├── supabase client initialization
├── JWT token management
├── Session handling
└── Relies on: @supabase/supabase-js SDK

Medication History (medicationHistory.js)
├── Purpose: Track medication compliance
├── Methods:
│   ├── logDose(medId, name, patient, dosage, status)
│   └── getHistory(medId)
└── Data stored in: localStorage (carebuddy_medication_history)
```

---

## 8. Key Technologies Quick Reference

```
FRONTEND FRAMEWORK
├─ React 19.2.4       - UI components & hooks
├─ Vite 8             - Build tool & dev server (30x faster than Webpack)
├─ React Router 7.14  - Client-side routing
├─ Tailwind CSS 4.2   - Utility-first styling
├─ Framer Motion 12   - Smooth animations
├─ Lucide Icons 1.7   - SVG icons library
├─ clsx + tailwind-merge - CSS class composition

STATE MANAGEMENT
├─ React Context      - Global theme state (dark/light)
├─ useState           - Component-scoped state
├─ useEffect          - Side effects & persistence to localStorage
├─ Props drilling     - Pass state through component tree
└─ localStorage API   - Client-side data persistence

BACKEND & APIS
├─ Node.js runtime    - For serverless functions
├─ Vercel Functions   - Serverless deployment
├─ Fetch API          - HTTP requests from browser
├─ Supabase Auth      - JWT-based authentication
├─ Google Gemini API  - AI/ML for chatbot
└─ SMS Provider API   - SMS notifications (Twilio/AWS compatible)

STYLING & THEMING
├─ Tailwind CSS       - Utility classes (dark: prefix for dark mode)
├─ PostCSS            - CSS preprocessing
├─ Autoprefixer       - Browser vendor prefixes
├─ CSS Grid/Flex      - Layout system
└─ CSS custom props   - Color variables in dark mode

DEPLOYMENT
├─ Vercel             - Hosting & edge network
├─ GitHub             - Source control & CI/CD trigger
├─ npm                - Package manager
├─ Environment Vars   - Secure API key management
└─ CDN                - Fast global content delivery

DEVELOPMENT TOOLS
├─ ESLint             - Code linting
├─ npm scripts        - Build automation
├─ Vite dev server    - HMR for fast iterations
└─ Browser DevTools   - Debugging (localStorage, network)
```

---

## 9. Critical Dependencies (from package.json)

```
Production Dependencies:
├─ @supabase/supabase-js (2.101.1)  - Auth & DB client
├─ @tailwindcss/vite (4.2.2)        - Tailwind integration
├─ clsx (2.1.1)                     - Dynamic CSS classes
├─ framer-motion (12.38.0)          - Animations
├─ lucide-react (1.7.0)             - Icons
├─ react (19.2.4)                   - Framework
├─ react-dom (19.2.4)               - DOM rendering
├─ react-router-dom (7.14.0)        - Routing
└─ tailwind-merge (3.5.0)           - CSS merging

Dev Dependencies:
├─ @vitejs/plugin-react (6.0.1)     - JSX transformation
├─ @eslint/js (9.39.4)              - Linting
├─ eslint-plugin-react-hooks        - React hook rules
├─ tailwindcss (4.2.2)              - CSS framework
├─ vite (8.0.1)                     - Build tool
└─ postcss (8.5.8)                  - CSS processing

Note: No database ORM (no Prisma, TypeORM)
      - All data in localStorage
      
No testing libraries (Jest, Vitest)
      - No tests in current codebase
      
No API client except Supabase SDK
      - Uses native fetch API for other requests
```

---

## 10. File Size & Performance Estimates

```
Development Build:
├─ node_modules/: ~800MB (node dependencies)
├─ dist/ (production): ~350-400KB total
│   ├─ main-[hash].js: ~150-200KB gzipped (~500KB uncompressed)
│   ├─ index-[hash].css: ~20-30KB gzipped (~80KB uncompressed)
│   └─ Other assets: ~10KB (icons, images)
└─ Source code (src/): ~50KB (well-organized)

Load Times (Estimates):
├─ Cold Load (first visit):
│   ├─ HTML: ~10ms (from CDN)
│   ├─ JavaScript: ~1-2s (download + parse)
│   ├─ CSS: ~200ms (download + parse)
│   ├─ React initialization: ~500ms
│   └─ Total: ~2-3 seconds
│
└─ Cached Load (repeat visitor):
    ├─ Browser cache: ~100-300ms
    ├─ HMR reconnect: instant
    └─ Total: <1 second

Network Requests per Page Load:
├─ Initial HTML: 1 request
├─ JavaScript bundle: 1 request
├─ CSS bundle: 1 request
├─ Icons/images: varies (lazy loaded)
├─ Fonts: 0 (using system fonts)
└─ Total: ~3-5 requests for main resources

Note: Vercel CDN caches static assets globally
      Subsequent visits even faster due to edge caching
```

---

This completes the comprehensive architecture reference guide for CareBuddy!

**Use ARCHITECTURE_AND_WORKFLOW.md for detailed explanations and ARCHITECTURE_VISUAL_GUIDE.md for quick lookups.**
