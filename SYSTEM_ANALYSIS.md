# CareBuddy System Analysis

## 1. Artifact Mapping

### Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                           CAREBUDDY ARTIFACT MAPPING                                        │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│   UI COMPONENTS     │         │   STATE/CONTEXT     │         │   DATA ENTITIES     │
├─────────────────────┤         ├─────────────────────┤         ├─────────────────────┤
│ • Navbar            │         │ • mode              │         │ • User              │
│ • Sidebar           │────────▶│ • activeSection     │         │ • Family Member     │
│ • MainContent       │         │ • userName          │         │ • Medication        │
│ • Medications       │         │ • members[]         │         │ • Vaccination       │
│ • MedicationModal   │         │ • medications[]     │         │ • Journal Entry     │
│ • CareBot           │         │ • journalEntries[]  │         │ • Health Metrics    │
│ • ThemeProvider     │         │ • CareBot messages  │         │ • Diet Plan         │
└─────────────────────┘         └─────────────────────┘         └─────────────────────┘
          │                                │                               │
          │                                │                               │
          ▼                                ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│   SERVICE CLASSES   │         │   LOCAL STORAGE     │         │   EXTERNAL APIs     │
├─────────────────────┤         ├─────────────────────┤         ├─────────────────────┤
│ MedicationReminder  │         │ • carebuddy_        │         │ • Gemini AI         │
│      System         │         │   username          │         │ • SMS Provider      │
│ • RefillMonitor     │         │ • carebuddy_        │         │ • (Twilio/AWS)      │
│ • MedicationHistory │         │   members           │         │                     │
│ • Medication        │         │ • carebuddy_        │         │                     │
│   InteractionChecker│         │   medications       │         │                     │
│ • PhoneNotification │         │ • carebuddy_        │         │                     │
│       Service       │         │   journal           │         │                     │
│                     │         │ • carebuddy_        │         │                     │
│                     │         │   medication_       │         │                     │
│                     │         │   history           │         │                     │
└─────────────────────┘         └─────────────────────┘         └─────────────────────┘
          │                                │                               │
          │                                │                               │
          ▼                                ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│   NOTIFICATIONS     │         │   EVENTS/CUSTOM     │         │   CONFIGURATION     │
├─────────────────────┤         ├─────────────────────┤         ├─────────────────────┤
│ • Browser Notif.    │         │ • medication        │         │ • Environment       │
│ • SMS Notif.        │         │   Reminder          │         │   Variables (.env)  │
│ • In-App Notif.     │         │ • medicationAlert   │         │ • VITE_SMS_API_KEY  │
│ • CareBot Chat      │         │ • Custom Events     │         │ • VITE_SMS_ENDPOINT │
└─────────────────────┘         └─────────────────────┘         └─────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    RELATIONSHIPS                                            │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│  User ──▶ Dashboard ──▶ Sidebar ──▶ Section (Vitals/Medications/etc.)                       │
│              │                          │                                                   │
│              │                          ▼                                                   │
│              │              ┌─────────────────────┐                                          │
│              │              │ Medications.jsx   │                                          │
│              │              │ - medicationState   │                                          │
│              │              │ - members[]         │                                          │
│              │              └─────────────────────┘                                          │
│              │                       │                                                      │
│              │                       ├─▶ MedicationModal (Add/Edit)                         │
│              │                       ├─▶ MedicationCompliance (Stats)                     │
│              │                       ├─▶ MedicationInteractions (Safety)                    │
│              │                       └─▶ medicationReminders.js (Alerts)                   │
│              │                                │                                             │
│              │                                ├─▶ phoneNotifications.js ──▶ SMS API         │
│              │                                └─▶ Browser Notifications                   │
│              │                                                                             │
│              └─▶ localStorage (Persistence Layer)                                            │
│                                                                                             │
│  Components ◄──── State (Props)                                                             │
│  Services  ◄──── localStorage (Data Source)                                                 │
│  APIs      ◄──── Async/Await (External Integration)                                         │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Brief Explanation

The Artifact Mapping reveals CareBuddy's layered architecture:

**UI Components Layer**: React-based frontend with modular sections (Vitals, Medications, etc.), shared layout components (Navbar, Sidebar), and interactive elements (CareBot chatbot, MedicationModal).

**State/Context Layer**: Centralized React state management for user data, family members, medications, and journal entries. The Dashboard component acts as the state container.

**Data Entities**: Core domain objects including User, Family Member, Medication with stock tracking, Vaccination schedules, Journal entries, and Health metrics.

**Service Classes**: Business logic encapsulated in utility classes - MedicationReminderSystem handles time-based alerts, RefillMonitor tracks inventory, MedicationHistory logs compliance, and PhoneNotificationService manages SMS delivery.

**Persistence**: localStorage-based client-side storage for all user data with specific keys (carebuddy_username, carebuddy_medications, etc.).

**External APIs**: Gemini AI for CareBot conversational features, SMS provider APIs for phone notifications.

**Event System**: Custom browser events (medicationReminder, medicationAlert) enable loose coupling between services and UI components.

### Significance

This artifact mapping is critical because it:

1. **Documents Architecture Decisions**: Shows the intentional separation between UI, state, services, and data layers, making it clear that CareBuddy follows React best practices with clear component boundaries.

2. **Identifies Integration Points**: Highlights exactly where external APIs (SMS, Gemini) connect to the system, essential for troubleshooting notification failures or AI chat issues.

3. **Maps Data Flow**: Reveals that all persistent data flows through localStorage, explaining why the system works offline but has no server-side backup - a key limitation for production deployment.

4. **Exposes Coupling**: Shows that medication-related services (reminders, refill monitoring, interaction checking) are tightly coupled, suggesting future refactoring opportunities.

5. **Guides Testing**: The service class structure makes it clear that unit tests should target the utility classes (MedicationReminderSystem, RefillMonitor) while integration tests should cover the component-service interactions.


## 2. Activity / Temporal Mapping

### Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                        ACTIVITY / TEMPORAL MAPPING                                          │
│                              (Medication Management Flow)                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      USER JOURNEY                                           │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐                │
│   │  LOGIN  │───▶│DASHBOARD│───▶│ NAVIGATE│───▶│INTERACT │───▶│ RECEIVE │                │
│   │  PAGE   │    │  LOAD   │    │  TO TAB │    │  WITH   │    │ NOTIFS  │                │
│   └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘                │
│       │              │              │              │              │                      │
│       │              │              │              │              │                      │
│       ▼              ▼              ▼              ▼              ▼                      │
│   ┌─────────────────────────────────────────────────────────────────────────┐           │
│   │                    MEDICATION MANAGEMENT WORKFLOW                        │           │
│   ├─────────────────────────────────────────────────────────────────────────┤           │
│   │                                                                          │           │
│   │   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐         │           │
│   │   │  USER CLICKS │      │  MODAL OPENS │      │ USER FILLS   │         │           │
│   │   │ "ADD MED"    │─────▶│  CENTERED    │─────▶│  FORM DATA   │         │           │
│   │   │  BUTTON      │      │  BELOW       │      │              │         │           │
│   │   └──────────────┘      │  HEADER      │      └──────────────┘         │           │
│   │                         └──────────────┘             │                 │           │
│   │                                                        │                 │           │
│   │                                                        ▼                 │           │
│   │   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐         │           │
│   │   │  MEDICATION  │      │  REMINDER    │      │  UI UPDATES  │         │           │
│   │   │  SAVED TO    │◄─────│  SYSTEM      │◄─────│  WITH NEW    │         │           │
│   │   │  localStorage│      │  INITIALIZED │      │  MEDICATION  │         │           │
│   │   └──────────────┘      └──────────────┘      └──────────────┘         │           │
│   │         │                                                             │           │
│   │         │                    TEMPORAL PROCESSES                        │           │
│   │         ▼                                                              │           │
│   │   ┌──────────────┐                                                    │           │
│   │   │ BACKGROUND   │                                                    │           │
│   │   │ SCHEDULING   │                                                    │           │
│   │   │ BEGINS       │                                                    │           │
│   │   └──────────────┘                                                    │           │
│   │                                                                          │           │
│   └─────────────────────────────────────────────────────────────────────────┘           │
│                                                                                           │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              TEMPORAL SEQUENCE DIAGRAM                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│   TIME → ─────────────────────────────────────────────────────────────────────────────▶  │
│                                                                                           │
│   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                  │
│   │  T+0   │  │  T+1   │  │  T+2   │  │ T+60s  │  │T+6hrs │  │ Daily  │                  │
│   │ (Init) │  │(Click) │  │(Submit)│  │(Check) │  │(Refill│  │(Repeat)│                  │
│   └────────┘  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘                  │
│                                                                                           │
│   ┌────────────────────────────────────────────────────────────────────────┐           │
│   │ MEDICATION REMINDER SYSTEM                                               │           │
│   ├────────────────────────────────────────────────────────────────────────┤           │
│   │                                                                          │           │
│   │  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐              │           │
│   │  │ setInterval │      │  check      │      │  time       │              │           │
│   │  │ (60000ms)   │─────▶│  reminders│─────▶│  matches?   │              │           │
│   │  └─────────────┘      └─────────────┘      └─────────────┘              │           │
│   │                                                      │                   │           │
│   │                             ┌────────────────────────┘                   │           │
│   │                             ▼ YES                                        │           │
│   │                   ┌─────────────┐      ┌─────────────┐                   │           │
│   │                   │  trigger    │      │  browser    │                   │           │
│   │                   │  browser    │─────▶│  notification│                  │           │
│   │                   │  notification│     └─────────────┘                   │           │
│   │                   └─────────────┘                                      │           │
│   │                           │                                            │           │
│   │                           ▼                                            │           │
│   │                   ┌─────────────┐      ┌─────────────┐                   │           │
│   │                   │  send SMS   │      │  show in-app│                   │           │
│   │                   │  via API    │      │  notification│                  │           │
│   │                   └─────────────┘      └─────────────┘                   │           │
│   │                                                                          │           │
│   └────────────────────────────────────────────────────────────────────────┘           │
│                                                                                           │
│   ┌────────────────────────────────────────────────────────────────────────┐           │
│   │ REFILL MONITOR SYSTEM                                                    │           │
│   ├────────────────────────────────────────────────────────────────────────┤           │
│   │                                                                          │           │
│   │  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐              │           │
│   │  │ setInterval │      │  check      │      │  stock      │              │           │
│   │  │ (6 hours)   │─────▶│  medications│─────▶│  ≤ threshold│              │           │
│   │  └─────────────┘      └─────────────┘      └─────────────┘              │           │
│   │                                                      │                   │           │
│   │                             ┌────────────────────────┘                   │           │
│   │                             ▼ YES                                        │           │
│   │                   ┌─────────────┐      ┌─────────────┐                   │           │
│   │                   │  send       │      │  dispatch   │                   │           │
│   │                   │  refill     │─────▶│  custom     │                   │           │
│   │                   │  alert      │      │  event      │                   │           │
│   │                   └─────────────┘      └─────────────┘                   │           │
│   │                                                                          │           │
│   └────────────────────────────────────────────────────────────────────────┘           │
│                                                                                           │
│   ┌────────────────────────────────────────────────────────────────────────┐           │
│   │ COMPLIANCE TRACKING                                                        │           │
│   ├────────────────────────────────────────────────────────────────────────┤           │
│   │                                                                          │           │
│   │  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐              │           │
│   │  │ user clicks │      │ logDose()   │      │ update      │              │           │
│   │  │ "taken"     │─────▶│  saves to   │─────▶│  compliance │              │           │
│   │  │ button      │      │  history    │      │  stats      │              │           │
│   │  └─────────────┘      └─────────────┘      └─────────────┘              │           │
│   │                                                                          │           │
│   └────────────────────────────────────────────────────────────────────────┘           │
│                                                                                           │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         DECISION POINTS & BRANCHING                                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│   ┌─────────────┐                                                                         │
│   │ Reminder    │                                                                         │
│   │ Due?        │                                                                         │
│   └──────┬──────┘                                                                         │
│          │                                                                               │
│      ┌───┴───┐                                                                           │
│      │       │                                                                           │
│   ┌──▼──┐ ┌─▼───┐                                                                        │
│   │ YES │ │ NO  │                                                                        │
│   └──┬──┘ └──┬──┘                                                                        │
│      │       │                                                                           │
│      ▼       ▼                                                                           │
│   ┌────────┐ ┌──────────┐                                                                │
│   │ Send   │ │ Schedule │                                                                │
│   │ Notif. │ │ Next Day │                                                                │
│   └────────┘ └──────────┘                                                                │
│                                                                                           │
│   ┌─────────────┐                                                                         │
│   │ Production  │                                                                         │
│   │ Mode?       │                                                                         │
│   └──────┬──────┘                                                                         │
│          │                                                                               │
│      ┌───┴───┐                                                                           │
│      │       │                                                                           │
│   ┌──▼──┐ ┌─▼───┐                                                                        │
│   │ YES │ │ NO  │                                                                        │
│   └──┬──┘ └──┬──┘                                                                        │
│      │       │                                                                           │
│      ▼       ▼                                                                           │
│   ┌────────┐ ┌──────────┐                                                                │
│   │ Call   │ │ Console  │                                                                │
│   │ SMS API│ │ Log Only │                                                                │
│   └────────┘ └──────────┘                                                                │
│                                                                                           │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Brief Explanation

The Activity/Temporal Mapping captures three key workflow dimensions:

**User Journey Flow**: Sequential user interactions from login through dashboard navigation, section interaction, and notification reception. Shows that the primary user path involves medication management as a core activity.

**Temporal Processes**: Two background systems operate on different time scales:
- MedicationReminderSystem checks every 60 seconds for due medications
- RefillMonitor checks every 6 hours for low stock conditions
- Both trigger multi-channel notifications (browser + SMS + in-app)

**State Transitions**: Critical decision points where system behavior branches:
- Reminder timing check (triggers notification or reschedules)
- Production mode check (sends real SMS vs logs to console)
- Stock threshold check (alerts or continues monitoring)

**Event-Driven Architecture**: Custom browser events (medicationReminder, medicationAlert) decouple the background services from UI components, allowing the notification system to work even when modals are closed.

### Significance

This temporal mapping is essential because it:

1. **Reveals Timing Constraints**: The 60-second reminder check and 6-hour refill check intervals are design decisions that balance responsiveness with performance - critical for understanding battery/CPU impact on user devices.

2. **Documents Async Behavior**: Shows that notifications happen independently of user actions through setInterval timers, explaining why users receive alerts even when not actively using the app.

3. **Exposes Race Conditions**: The diagram highlights potential issues where multiple notifications could fire simultaneously (medication due + low stock), explaining why the UI must handle notification queuing.

4. **Guides Testing Strategy**: Temporal flows make clear that testing requires time manipulation (jest fake timers) and that integration tests must account for the 60-second polling cycle.

5. **Maps Decision Logic**: The branching at "Production Mode" and "Reminder Due" decision points are critical business logic that must be tested thoroughly - any bug here affects real medication adherence.


## 3. Spatial / Environment Mapping

### Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                          SPATIAL / ENVIRONMENT MAPPING                                      │
│                           (System Architecture & Boundaries)                              │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CLIENT ENVIRONMENT                                       │
│                              (User's Device / Browser)                                      │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                              REACT APPLICATION                                        │  │
│  ├─────────────────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                                       │  │
│  │  ┌───────────────────────────────────────────────────────────────────────────────┐    │  │
│  │  │                           UI LAYER                                             │    │  │
│  │  ├───────────────────────────────────────────────────────────────────────────────┤    │  │
│  │  │                                                                                │    │  │
│  │  │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐    │    │  │
│  │  │   │   NAVBAR    │   │   SIDEBAR   │   │ MAIN CONTENT│   │  CAREBOT    │    │    │  │
│  │  │   │  (Fixed)    │   │  (Fixed)    │   │  (Dynamic)  │   │  (Floating) │    │    │  │
│  │  │   │             │   │             │   │             │   │             │    │    │  │
│  │  │   │ • Mode      │   │ • Navigation│   │ • Vitals    │   │ • Chat UI   │    │    │  │
│  │  │   │ • User Info │   │ • Section   │   │ • Medications│  │ • AI Reply  │    │    │  │
│  │  │   │ • Search    │   │ • Icons     │   │ • Journal   │   │             │    │    │  │
│  │  │   │             │   │             │   │ • etc.      │   │             │    │    │  │
│  │  │   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘    │    │  │
│  │  │                                                                                │    │  │
│  │  │   ┌─────────────────────────────────────────────────────────────────────┐   │    │  │
│  │  │   │                      MODAL OVERLAYS                                      │   │    │  │
│  │  │   │  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                   │   │    │  │
│  │  │   │  │Medication   │   │Notification │   │  CareBot    │  (z-index: 300)   │   │    │  │
│  │  │   │  │   Modal     │   │  Toast      │   │   Window    │                   │   │    │  │
│  │  │   │  │ (z: 300)    │   │  (z: 200)   │   │  (z: 100)   │                   │   │    │  │
│  │  │   │  └─────────────┘   └─────────────┘   └─────────────┘                   │   │    │  │
│  │  │   └─────────────────────────────────────────────────────────────────────┘   │    │  │
│  │  │                                                                                │    │  │
│  │  └───────────────────────────────────────────────────────────────────────────────┘    │  │
│  │                                                                                       │  │
│  │  ┌───────────────────────────────────────────────────────────────────────────────┐    │  │
│  │  │                         STATE MANAGEMENT                                       │    │  │
│  │  ├───────────────────────────────────────────────────────────────────────────────┤    │  │
│  │  │                                                                                │    │  │
│  │  │   Dashboard Component (State Container)                                        │    │  │
│  │  │   ├─▶ mode (personal/family)                                                   │    │  │
│  │  │   ├─▶ activeSection (current tab)                                              │    │  │
│  │  │   ├─▶ userName, members[], medications[], journalEntries[]                      │    │  │
│  │  │   └─▶ Props drilling to child components                                       │    │  │
│  │  │                                                                                │    │  │
│  │  │   ThemeProvider (Context)                                                      │    │  │
│  │  │   └─▶ Dark/Light mode across app                                               │    │  │
│  │  │                                                                                │    │  │
│  │  └───────────────────────────────────────────────────────────────────────────────┘    │  │
│  │                                                                                       │  │
│  │  ┌───────────────────────────────────────────────────────────────────────────────┐    │  │
│  │  │                       SERVICE LAYER (Business Logic)                             │    │  │
│  │  ├───────────────────────────────────────────────────────────────────────────────┤    │  │
│  │  │                                                                                │    │  │
│  │  │   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐                │    │  │
│  │  │   │ Medication      │   │ Medication      │   │ Medication      │                │    │  │
│  │  │   │ Reminder        │   │ History         │   │ Interaction     │                │    │  │
│  │  │   │ System          │   │ Logger          │   │ Checker         │                │    │  │
│  │  │   │                 │   │                 │   │                 │                │    │  │
│  │  │   │ • setInterval   │   │ • logDose()     │   │ • checkDrug     │                │    │  │
│  │  │   │ • checkReminders│   │ • getHistory()  │   │   Interactions  │                │    │  │
│  │  │   │ • sendNotif.    │   │ • compliance    │   │ • contraindica  │                │    │  │
│  │  │   └─────────────────┘   └─────────────────┘   └─────────────────┘                │    │  │
│  │  │                                                                                │    │  │
│  │  │   ┌─────────────────┐   ┌─────────────────┐                                    │    │  │
│  │  │   │ Refill          │   │ Phone           │                                    │    │  │
│  │  │   │ Monitor          │   │ Notification    │                                    │    │  │
│  │  │   │                 │   │ Service         │                                    │    │  │
│  │  │   │ • stock checks  │   │                 │                                    │    │  │
│  │  │   │ • low alerts    │   │ • sendSMS()     │                                    │    │  │
│  │  │   └─────────────────┘   └─────────────────┘                                    │    │  │
│  │  │                                                                                │    │  │
│  │  └───────────────────────────────────────────────────────────────────────────────┘    │  │
│  │                                                                                       │  │
│  │  ┌───────────────────────────────────────────────────────────────────────────────┐    │  │
│  │  │                         DATA PERSISTENCE                                       │    │  │
│  │  ├───────────────────────────────────────────────────────────────────────────────┤    │  │
│  │  │                                                                                │    │  │
│  │  │   Browser localStorage                                                         │    │  │
│  │  │   ├─▶ carebuddy_username                                                       │    │  │
│  │  │   ├─▶ carebuddy_members                                                        │    │  │
│  │  │   ├─▶ carebuddy_medications                                                    │    │  │
│  │  │   ├─▶ carebuddy_journal                                                        │    │  │
│  │  │   └─▶ carebuddy_medication_history                                             │    │  │
│  │  │                                                                                │    │  │
│  │  └───────────────────────────────────────────────────────────────────────────────┘    │  │
│  │                                                                                       │  │
│  └─────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐    │
│  │                         BROWSER APIs                                                │    │
│  ├─────────────────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                                       │    │
│  │   • Notification API (browser notifications)                                          │    │
│  │   • localStorage API (data persistence)                                               │    │
│  │   • fetch API (HTTP requests to external services)                                    │    │
│  │   • CustomEvent API (internal event system)                                           │    │
│  │                                                                                       │    │
│  └─────────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 EXTERNAL ENVIRONMENTS                                       │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│  ┌─────────────────────────────┐          ┌─────────────────────────────┐                    │
│  │     GEMINI AI SERVICE       │          │      SMS PROVIDER           │                    │
│  │     (Google Cloud)          │          │      (Twilio/AWS/etc)       │                    │
│  ├─────────────────────────────┤          ├─────────────────────────────┤                    │
│  │                             │          │                             │                    │
│  │  • Conversational AI        │          │  • SMS Gateway              │                    │
│  │  • requestGeminiReply()     │          │  • sendSMS()                │                    │
│  │  • Health advice Q&A        │          │  • Delivery tracking        │                    │
│  │                             │          │  • Rate limiting            │                    │
│  │  HTTPS/REST API             │          │  HTTPS/REST API             │                    │
│  │  ↑↓                         │          │  ↑↓                         │                    │
│  └─────────────────────────────┘          └─────────────────────────────┘                    │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              NETWORK BOUNDARIES                                             │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│   ┌───────────────────────────────────────────────────────────────────────────────┐         │
│   │                                                                               │         │
│   │   CLIENT SIDE                    │                    SERVER SIDE          │         │
│   │   (Browser)                        │                    (External APIs)       │         │
│   │                                    │                                           │         │
│   │   ┌─────────────────────────┐      │      ┌─────────────────────────────┐     │         │
│   │   │ CareBuddy React App     │      │      │    Gemini AI Endpoint       │     │         │
│   │   │                         │◄─────┼─────►│    api.gemini.google.com    │     │         │
│   │   │ • All UI components     │      │      │                             │     │         │
│   │   │ • All service classes   │      │      │    POST /v1/generate        │     │         │
│   │   │ • localStorage data     │      │      │    Authentication: API Key    │     │         │
│   │   └─────────────────────────┘      │      └─────────────────────────────┘     │         │
│   │                                    │                                           │         │
│   │   ┌─────────────────────────┐      │      ┌─────────────────────────────┐     │         │
│   │   │ PhoneNotificationService│      │      │    SMS Provider Endpoint    │     │         │
│   │   │                         │◄─────┼─────►│    api.twilio.com/...       │     │         │
│   │   │ • sendSMS()             │      │      │                             │     │         │
│   │   │ • test mode             │      │      │    POST /Messages.json      │     │         │
│   │   │ • production mode       │      │      │    Auth: Bearer Token       │     │         │
│   │   └─────────────────────────┘      │      └─────────────────────────────┘     │         │
│   │                                    │                                           │         │
│   │                                    │      SECURITY: API keys stored in .env      │         │
│   │                                    │      (Never exposed to client in prod)    │         │
│   │                                    │                                           │         │
│   └──────────────────────────────────┼───────────────────────────────────────────┘         │
│                                      │                                                     │
│                     FIREWALL / HTTPS │ ENCRYPTION                                           │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                           DEPLOYMENT ENVIRONMENT                                            │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│   ┌───────────────────────────────────────────────────────────────────────────────────┐     │
│   │                              VERCEL HOSTING                                         │     │
│   ├───────────────────────────────────────────────────────────────────────────────────┤     │
│   │                                                                                     │     │
│   │   Static Site (React + Vite)                                                        │     │
│   │   ├─▶ Built with Vite                                                               │     │
│   │   ├─▶ Deployed to Vercel Edge Network                                               │     │
│   │   └─▶ Environment variables injected at build time                                │     │
│   │                                                                                     │     │
│   │   Domain: care-buddy-pivercel.app                                                   │     │
│   │                                                                                     │     │
│   └───────────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Brief Explanation

The Spatial/Environment Mapping reveals CareBuddy's distributed architecture across multiple environments:

**Client Environment (Primary)**: The React application runs entirely in the user's browser with:
- UI Layer with z-index hierarchy (Modals at 300, Notifications at 200, CareBot at 100)
- State management via Dashboard component (props drilling pattern)
- Service layer with business logic classes
- localStorage for persistence

**External API Environments**: Two external services interact with the client:
- Gemini AI (Google Cloud) for conversational health advice
- SMS Provider (Twilio/AWS) for phone notifications

**Network Boundaries**: Clear separation between client and server:
- Client contains all UI logic and data
- Server only provides AI and SMS APIs
- HTTPS encryption for all external calls
- API keys secured in environment variables

**Deployment**: Vercel edge network hosts the static React build

### Significance

This environment mapping is crucial because it:

1. **Documents Security Boundaries**: Shows that API keys (Gemini, SMS) are the only secrets, and they should be protected. The diagram makes clear that in production, these must be server-side or properly secured.

2. **Reveals Architecture Choice**: The client-side-only architecture (localStorage, no backend) means the app works offline but has no multi-device sync or server-side backup - a critical limitation for healthcare data.

3. **Maps Z-Index Strategy**: The layering (z-300 for modals, z-200 for notifications) explains why certain UI elements appear above others, preventing layout bugs.

4. **Identifies Network Dependencies**: Shows exactly which external services must be available for full functionality (CareBot needs Gemini, SMS needs provider API), guiding uptime monitoring.

5. **Exposes Data Residency**: All health data stays in browser localStorage, which has GDPR/privacy implications and explains the app's single-device limitation.


## 4. Persona Analysis

### Personas

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              PERSONA 1: PRIYA THE CAREGIVER                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                                     │   │
│   │   👤 Demographics                                                                   │   │
│   │   • Age: 45 years old                                                               │   │
│   │   • Role: Working mother of 2 children, caregiver to elderly parents                │   │
│   │   • Location: Urban India                                                           │   │
│   │   • Tech Comfort: Moderate (uses WhatsApp, Google Maps, basic apps)               │   │
│   │                                                                                     │   │
│   │   🎯 Goals                                                                          │   │
│   │   • Track medications for her diabetic father (insulin, metformin)                │   │
│   │   • Monitor children's vaccination schedules                                        │   │
│   │   • Coordinate with family members about health updates                             │   │
│   │   • Get reminders so she doesn't forget doses during busy work days                 │   │
│   │   • Ensure drug interactions are checked before giving new medications            │   │
│   │                                                                                     │   │
│   │   😫 Pain Points                                                                    │   │
│   │   • Forgets medication times when juggling work and caregiving                      │   │
│   │   • Worried about giving wrong medication or dosage                                 │   │
│   │   • Difficulty tracking which family member took which medicine                     │   │
│   │   • Stress when medications run out unexpectedly                                    │   │
│   │   • Needs to coordinate with siblings who also help with care                       │   │
│   │                                                                                     │   │
│   │   📱 Behavior Patterns                                                              │   │
│   │   • Checks medication status in morning before leaving for work                     │   │
│   │   • Relies heavily on SMS reminders (not always checking app)                     │   │
│   │   • Uses "Mark as Taken" button to confirm doses                                    │   │
│   │   • Checks compliance stats weekly to see if father is adhering                     │   │
│   │   • Uses CareBot to ask "Can my father take paracetamol with his current meds?"     │   │
│   │   • Adds new medications immediately when doctor prescribes                       │   │
│   │                                                                                     │   │
│   │   🎪 Preferred Features                                                             │   │
│   │   • SMS notifications (most important)                                              │   │
│   │   • Drug interaction checker (safety critical)                                       │   │
│   │   • Compliance tracking (for peace of mind)                                       │   │
│   │   • Refill reminders (prevents stockouts)                                           │   │
│   │   • Family mode to see all members' medications                                     │   │
│   │                                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              PERSONA 2: RAHUL THE PATIENT                                   │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                                     │   │
│   │   👤 Demographics                                                                   │   │
│   │   • Age: 32 years old                                                               │   │
│   │   • Role: IT professional, manages own chronic condition (hypertension)           │   │
│   │   • Location: Bangalore, India                                                      │   │
│   │   • Tech Comfort: High (software developer, tech-savvy)                             │   │
│   │                                                                                     │   │
│   │   🎯 Goals                                                                          │   │
│   │   • Maintain consistent medication schedule for blood pressure control              │   │
│   │   • Track vital signs (BP, heart rate) alongside medications                        │   │
│   │   • Log health journal entries about symptoms and side effects                    │   │
│   │   • Share health reports with doctor during appointments                            │   │
│   │   • Monitor fitness and diet as part of holistic health management                 │   │
│   │                                                                                     │   │
│   │   😫 Pain Points                                                                    │   │
│   │   • Sometimes forgets morning medication when rushing to office                   │   │
│   │   • Difficulty correlating medication adherence with BP readings                     │   │
│   │   • Wants to see trends and patterns over time                                      │   │
│   │   • Needs to track multiple medications with different schedules                    │   │
│   │   • Wants data export for doctor consultations                                      │   │
│   │                                                                                     │   │
│   │   📱 Behavior Patterns                                                              │   │
│   │   • Opens app daily to log vitals and mark medications as taken                     │   │
│   │   • Uses browser notifications (keeps tab open at work)                             │   │
│   │   • Checks medication history and compliance stats monthly                          │   │
│   │   • Uses journal to note side effects or symptoms                                   │   │
│   │   • Asks CareBot technical questions about drug interactions                        │   │
│   │   • Explores all features (fitness, hydration, mental health sections)            │   │
│   │                                                                                     │   │
│   │   🎪 Preferred Features                                                             │   │
│   │   • Vitals tracking with charts and trends                                          │   │
│   │   • Journal logging with timestamps                                                 │   │
│   │   • Compliance statistics (data-driven insights)                                    │   │
│   │   • Medication interaction warnings (detailed info)                                 │   │
│   │   • Dark mode (uses app at night and early morning)                                 │   │
│   │   • CareBot for health research questions                                           │   │
│   │                                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                           PERSONA 3: ANJALI THE SENIOR CITIZEN                              │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                                     │   │
│   │   👤 Demographics                                                                   │   │
│   │   • Age: 68 years old                                                               │   │
│   │   • Role: Retired teacher, lives alone, manages multiple medications                │   │
│   │   • Location: Delhi, India                                                          │   │
│   │   • Tech Comfort: Low (basic smartphone user, needs large text, simple UI)          │   │
│   │                                                                                     │   │
│   │   🎯 Goals                                                                          │   │
│   │   • Remember to take 5+ daily medications on schedule                             │   │
│   │   • Know when to refill prescriptions (memory issues)                               │   │
│   │   • Get help understanding medication instructions                                  │   │
│   │   • Have emergency contact information accessible                                   │   │
│   │   • Feel safe and independent in managing health                                    │   │
│   │                                                                                     │   │
│   │   😫 Pain Points                                                                    │   │
│   │   • Forgets if she already took her medication (double-dosing risk)                 │   │
│   │   • Confused by complex medication schedules (morning, afternoon, night)            │   │
│   │   • Can't read small text on most health apps                                       │   │
│   │   • Worries about running out of medication unexpectedly                            │   │
│   │   • Doesn't understand medical terms or drug interactions                            │   │
│   │   • Feels overwhelmed by too many features or complex navigation                    │   │
│   │                                                                                     │   │
│   │   📱 Behavior Patterns                                                              │   │
│   │   • Opens app only when notification arrives                                        │   │
│   │   • Taps "Mark as Taken" immediately after consuming medication                   │   │
│   │   • Uses CareBot to ask "What is this medicine for?" in simple language           │   │
│   │   • Needs children to help set up medications initially                             │   │
│   │   • Relies on SMS notifications (doesn't check browser)                              │   │
│   │   • Views large compliance charts to show doctor that she's adherent                │   │
│   │                                                                                     │   │
│   │   🎪 Preferred Features                                                             │   │
│   │   • Large text and clear visual indicators (taken/urgent/upcoming)                  │   │
│   │   • Simple medication list (no complex features)                                    │   │
│   │   • SMS reminders (essential - doesn't use app proactively)                       │   │
│   │   • Refill alerts with clear "Buy now" action                                       │   │
│   │   • CareBot for simple health questions in plain language                           │   │
│   │   • One-tap "Mark as Taken" button (minimal steps)                                  │   │
│   │                                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              PERSONA 4: DR. SHARMA THE PHYSICIAN                            │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                                     │   │
│   │   👤 Demographics                                                                   │   │
│   │   • Age: 45 years old                                                               │   │
│   │   • Role: Family physician with 200+ patients                                      │   │
│   │   • Location: Mumbai, India                                                         │   │
│   │   • Tech Comfort: High (uses EMR systems, open to patient health apps)                │   │
│   │                                                                                     │   │
│   │   🎯 Goals                                                                          │   │
│   │   • Monitor patient medication adherence between visits                             │   │
│   │   • Identify patients at risk due to non-compliance                                 │   │
│   │   • Check for drug interactions when prescribing new medications                    │   │
│   │   • Educate patients about their health conditions                                  │   │
│   │   • Reduce medication errors and improve patient outcomes                           │   │
│   │                                                                                     │   │
│   │   😫 Pain Points                                                                    │   │
│   │   • Patients claim they take medications but don't (poor adherence)               │   │
│   │   • Difficulty tracking which patients need follow-up for refill issues           │   │
│   │   • Time constraints prevent detailed medication counseling                        │   │
│   │   • Patients don't understand contraindications and warnings                        │   │
│   │   • No visibility into patient health trends between appointments                  │   │
│   │                                                                                     │   │
│   │   📱 Behavior Patterns (Hypothetical - Future Feature)                             │   │
│   │   • Would review patient compliance reports before appointments                     │   │
│   │   • Uses interaction checker to verify prescriptions are safe                     │   │
│   │   • Recommends app to patients with chronic conditions                              │   │
│   │   • Suggests specific features based on patient needs                               │   │
│   │   • Reviews aggregated anonymized data for population health insights               │   │
│   │                                                                                     │   │
│   │   🎪 Preferred Features                                                             │   │
│   │   • Compliance reports exportable to PDF for medical records                      │   │
│   │   • Drug interaction database (comprehensive, evidence-based)                       │   │
│   │   • Patient-facing educational content about conditions                           │   │
│   │   • Adherence trend analysis (identify at-risk patients)                            │   │
│   │   • Integration with EMR systems (future consideration)                           │   │
│   │                                                                                     │   │
│   └─────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Significance

This persona analysis is essential because it:

1. **Validates Feature Priorities**: Priya (caregiver) and Anjali (senior) both rank SMS notifications as essential - confirming the development priority on phone notifications over purely in-app features.

2. **Explains UI Design Choices**: Anjali's need for large text and simple UI explains why CareBuddy uses high-contrast status indicators (taken/urgent/upcoming) and clear visual hierarchy.

3. **Guides Accessibility Requirements**: The senior persona reveals that the app must support accessibility features (large fonts, high contrast, simple navigation) to be inclusive.

4. **Maps Usage Patterns**: Rahul's data-driven approach vs. Anjali's notification-driven approach explains why the app needs both detailed analytics AND simple notification workflows.

5. **Identifies Stakeholder Ecosystem**: Dr. Sharma as a secondary persona suggests future features like PDF export, EMR integration, and clinical-grade interaction checking would add value beyond the patient/caregiver user base.

6. **Validates Multi-Modal Notifications**: The personas show that different users need different notification channels (SMS for seniors/caregivers, browser for working professionals), justifying the multi-channel notification architecture.


## 5. OIOR Table (Object–Interaction–Operation–Result)

### Table

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                    OIOR TABLE - CAREBUDDY MEDICATION MANAGEMENT                             │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│  ┌──────────────┬────────────────────┬────────────────────┬──────────────────────────────┐  │
│  │   OBJECT     │   INTERACTION      │   OPERATION        │         RESULT               │  │
│  ├──────────────┼────────────────────┼────────────────────┼──────────────────────────────┤  │
│  │              │                    │                    │                              │  │
│  │  User        │  Click "Add        │  medicationModal   │  Modal opens with empty      │  │
│  │  (Caregiver) │  Medication"       │  .open()           │  form fields                 │  │
│  │              │  button            │                    │                              │  │
│  ├──────────────┼────────────────────┼────────────────────┼──────────────────────────────┤  │
│  │              │                    │                    │                              │  │
│  │  Medication  │  Fill form fields  │  addMedication()   │  New medication object       │  │
│  │  Form        │  & click Submit    │  → setMeds()       │  added to meds array         │  │
│  │              │                    │  → localStorage.set  │  → localStorage updated      │  │
│  │              │                    │                    │  → Reminder scheduled        │  │
│  ├──────────────┼────────────────────┼────────────────────┼──────────────────────────────┤  │
│  │              │                    │                    │                              │  │
│  │  Medication  │  Click "Taken"     │  toggleStatus()    │  Status changes:             │  │
│  │  Card        │  checkbox          │  → medication      │  upcoming → taken            │  │
│  │              │                    │   History.logDose  │  History entry created       │  │
│  │              │                    │                    │  Compliance stats updated    │  │
│  ├──────────────┼────────────────────┼────────────────────┼──────────────────────────────┤  │
│  │              │                    │                    │                              │  │
│  │  Medication  │  Time matches      │  checkReminders()  │  Browser notification        │  │
│  │  Reminder    │  scheduled time    │  → sendNotif()     │  dispatched                  │  │
│  │  System      │  (T+0 due time)    │  → PhoneNotif.     │  SMS API called              │  │
│  │              │                    │   .sendSMS()       │  (if production mode)        │  │
│  ├──────────────┼────────────────────┼────────────────────┼──────────────────────────────┤  │
│  │              │                    │                    │                              │  │
│  │  Refill      │  Stock ≤           │  checkRefillAlerts │  Low stock alert dispatched  │  │
│  │  Monitor     │  threshold         │  () → sendAlert()  │  to notification system      │  │
│  │              │  (stock check)     │                    │  (browser + SMS)             │  │
│  ├──────────────┼────────────────────┼────────────────────┼──────────────────────────────┤  │
│  │              │                    │                    │                              │  │
│  │  Interaction │  Click "Show        │  checkInteractions │  Interaction analysis        │  │
│  │  Checker     │  Interactions"     │  (medications)     │  displayed:                  │  │
│  │              │  button            │                    │  • High/Moderate/Low risk    │  │
│  │              │                    │                    │  • Contraindications         │  │
│  ├──────────────┼────────────────────┼────────────────────┼──────────────────────────────┤  │
│  │              │                    │                    │                              │  │
│  │  Compliance  │  Click "Show       │  getCompliance     │  Statistics calculated:      │  │
│  │  Tracker     │  Compliance"       │  Stats()           │  • Adherence rate %          │  │
│  │              │  button            │                    │  • Days tracked              │  │
│  │              │                    │                    │  • Trend visualization       │  │
│  ├──────────────┼────────────────────┼────────────────────┼──────────────────────────────┤  │
│  │              │                    │                    │                              │  │
│  │  CareBot     │  Type question & │  requestGemini     │  AI-generated response       │  │
│  │  Chat        │  press Send        │  Reply()           │  displayed in chat window    │  │
│  │              │                    │  (Gemini API)      │  • Health advice             │  │
│  │              │                    │                    │  • Drug info                 │  │
│  ├──────────────┼────────────────────┼────────────────────┼──────────────────────────────┤  │
│  │              │                    │                    │                              │  │
│  │  Family      │  Click "Family"    │  setMode('family') │  Sidebar switches to         │  │
│  │  Mode        │  mode toggle       │  → setActive       │  family sections             │  │
│  │  Toggle      │                    │   Section()        │  • Family profiles           │  │
│  │              │                    │                    │  • Medications by member     │  │
│  ├──────────────┼────────────────────┼────────────────────┼──────────────────────────────┤  │
│  │              │                    │                    │                              │  │
│  │  Phone       │  Click "Send       │  testNotifs()      │  Test SMS dispatched         │  │
│  │  Notification│  LIVE SMS"         │  → sendSMS()       │  Console logs result:        │  │
│  │  Test        │  button            │  (API call)        │  success/failure             │  │
│  ├──────────────┼────────────────────┼────────────────────┼──────────────────────────────┤  │
│  │              │                    │                    │                              │  │
│  │  Medication  │  Click "Delete"    │  deleteMedication  │  Medication removed from     │  │
│  │              │  (trash icon)      │  () → filter()     │  array and localStorage      │  │
│  │              │                    │  → localStorage    │  Reminder cancelled          │  │
│  │              │                    │   update           │                              │  │
│  ├──────────────┼────────────────────┼────────────────────┼──────────────────────────────┤  │
│  │              │                    │                    │                              │  │
│  │  Theme       │  Click theme       │  ThemeProvider     │  Dark/light mode toggled     │  │
│  │  Toggle      │  toggle button     │  → setTheme()      │  across all components       │  │
│  │              │  (sun/moon icon)   │                    │  Preference saved            │  │
│  ├──────────────┼────────────────────┼────────────────────┼──────────────────────────────┤  │
│  │              │                    │                    │                              │  │
│  │  Journal     │  Type entry &      │  saveEntry()       │  Entry added to              │  │
│  │  Entry       │  click Save        │  → localStorage    │  journalEntries[]            │  │
│  │              │                    │                    │  Displayed in Journal view   │  │
│  │              │                    │                    │                              │  │
│  └──────────────┴────────────────────┴────────────────────┴──────────────────────────────┘  │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Detailed OIOR Analysis for Critical Path

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│              CRITICAL PATH: MEDICATION REMINDER NOTIFICATION FLOW                           │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│  SEQUENCE 1: SCHEDULING                                                                     │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                                       │  │
│  │  OBJECT: Medication Reminder System                                                    │  │
│  │  INTERACTION: User adds medication OR app initializes                                │  │
│  │  OPERATION: addReminder(medication)                                                    │  │
│  │                                                                                       │  │
│  │  STEPS:                                                                               │  │
│  │  1. Parse time string (e.g., "08:00 AM") → {hours: 8, minutes: 0}                    │  │
│  │  2. Create reminderDate with parsed time                                              │  │
│  │  3. If reminderDate <= now, add 1 day (schedule for tomorrow)                        │  │
│  │  4. Store in Map: reminders.set(id, {..., reminderTime, notified: false})            │  │
│  │                                                                                       │  │
│  │  RESULT: Reminder scheduled in memory, ready for time-based checks                   │  │
│  │                                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                             │
│  SEQUENCE 2: TEMPORAL CHECKING                                                              │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                                       │  │
│  │  OBJECT: Reminder System (Background)                                                │  │
│  │  INTERACTION: setInterval fires (every 60 seconds)                                   │  │
│  │  OPERATION: checkReminders()                                                         │  │
│  │                                                                                       │  │
│  │  STEPS:                                                                               │  │
│  │  1. Get current time: const now = new Date()                                         │  │
│  │  2. Iterate through reminders Map                                                    │  │
│  │  3. For each reminder: if (!notified && now >= reminderTime)                         │  │
│  │  4. DECISION POINT: Time match?                                                      │  │
│  │     • YES → Trigger notification                                                     │  │
│  │     • NO → Continue to next reminder                                                 │  │
│  │                                                                                       │  │
│  │  RESULT: Medication identified as due for notification                               │  │
│  │                                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                             │
│  SEQUENCE 3: NOTIFICATION DISPATCH                                                          │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                                       │  │
│  │  OBJECT: Medication (Due)                                                              │  │
│  │  INTERACTION: Time match confirmed                                                     │  │
│  │  OPERATION: sendNotification(medication)                                             │  │
│  │                                                                                       │  │
│  │  PARALLEL OPERATIONS:                                                                 │  │
│  │                                                                                       │  │
│  │  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐      │  │
│  │  │  Browser Notification│  │  SMS Notification    │  │  In-App Notification │      │  │
│  │  │                      │  │                      │  │                      │      │  │
│  │  │  if (Notification    │  │  if (productionMode) │  │  CustomEvent dispatch│      │  │
│  │  │  .permission ===     │  │  → phoneNotif.       │  │  window.dispatch(    │      │  │
│  │  │  'granted')          │  │  .sendSMS()          │  │  'medicationReminder'│      │  │
│  │  │  → new Notification()│  │  → fetch(API)        │  │  )                   │      │  │
│  │  │                      │  │                      │  │                      │      │  │
│  │  │  RESULT: Desktop     │  │  RESULT: SMS sent    │  │  RESULT: Toast       │      │  │
│  │  │  notification popup  │  │  to phone            │  │  appears in UI       │      │  │
│  │  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘      │  │
│  │                                                                                       │  │
│  │  STATE UPDATE: reminder.notified = true                                              │  │
│  │  RESCHEDULING: reminder.reminderTime += 1 day                                        │  │
│  │                                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                             │
│  SEQUENCE 4: USER RESPONSE (COMPLETING THE LOOP)                                            │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                                       │  │
│  │  OBJECT: Medication Card (UI Component)                                              │  │
│  │  INTERACTION: User clicks "Taken" button                                           │  │
│  │  OPERATION: toggleStatus(id)                                                         │  │
│  │                                                                                       │  │
│  │  STEPS:                                                                               │  │
│  │  1. Find medication by ID                                                            │  │
│  │  2. Toggle status: taken ↔ upcoming                                                  │  │
│  │  3. Update meds state: setMeds(updatedArray)                                         │  │
│  │  4. Sync to localStorage                                                             │  │
│  │  5. IF newStatus === 'taken':                                                        │  │
│  │     → medicationHistory.logDose()                                                    │  │
│  │     → Remove from reminder system                                                    │  │
│  │                                                                                       │  │
│  │  RESULT:                                                                              │  │
│  │  • Medication marked as taken (green checkmark)                                      │  │
│  │  • Dose logged in history with timestamp                                             │  │
│  │  • Compliance statistics recalculated                                              │  │
│  │  • Reminder removed (won't fire again today)                                       │  │
│  │                                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Significance

This OIOR table is critical because it:

1. **Documents System Behavior Precisely**: Each row maps exactly what happens when a user interacts with an object, leaving no ambiguity about system responses. This serves as executable documentation for developers.

2. **Maps Data Transformations**: Shows how data flows through operations (e.g., medication form → validation → localStorage → reminder scheduling), revealing the complete data lifecycle.

3. **Identifies Side Effects**: Makes clear that operations have multiple results (e.g., adding medication updates UI, storage, AND schedules reminders), critical for debugging cascading issues.

4. **Exposes Business Logic**: The medication reminder flow shows complex temporal logic (scheduling → checking → notifying → rescheduling) that must be tested thoroughly.

5. **Guides Testing Scenarios**: Each OIOR row is a test case. The "Phone Notification Test" row reveals the exact API call sequence needed to verify SMS functionality.

6. **Maps Error Points**: The decision branches (time match? production mode?) show exactly where failures can occur, guiding error handling and user feedback design.

7. **Validates Feature Completeness**: By listing all objects and their interactions, the table confirms that core medication management workflows (CRUD, reminders, compliance, interactions) are fully implemented.
