# Arete - Wellness Tracking Application
## Complete Feature Specification

---

## Executive Summary

**Arete** (ἀρετή - "excellence" or "virtue" in ancient Greek) is a production-ready personal wellness tracking application that provides a unified dashboard for tracking fitness activities, daily tasks, nutrition intake, and sleep quality. The application emphasizes simplicity, privacy, and real-time feedback through automated scoring across all wellness categories.

### Current Status
- **Production Ready**: Fully functional with all core features implemented
- **Architecture**: Client-side first with localStorage persistence
- **Backend**: Flask API available but not actively used (ready for multi-device sync)
- **Deployment**: Vercel-compatible serverless deployment

---

## Core Features

### 1. Daily Scoring System

Real-time scoring dashboard displaying four wellness categories on a 0-100 scale:

- **Fitness Score**: Based on workout completion percentage
- **Tasks Score**: Based on todo list completion percentage
- **Food Score**: Based on nutrition target adherence
- **Sleep Score**: Based on sleep duration vs target range

#### Dynamic Color Coding
Scores are color-coded for instant visual feedback:
- **90-100**: Mint green (#4ecca3) - Excellent
- **80-89**: Blue (#6eb6ff) - Good
- **70-79**: Orange (#ffa726) - Fair
- **<70**: Red (#ff6b6b) - Needs attention

All scores update automatically as data is entered throughout the day.

---

### 2. Workout Tracking System

#### Features
- **Time-based workout blocks** (e.g., 5AM, 6AM, 7AM)
- **Customizable workout templates** with Greek naming (e.g., σθενος - "strength")
- **Exercise tracking** with checkbox-based set completion
- **Configurable exercises**: Each can have 1-20 sets
- **Real-time progress**: Visual feedback as sets are completed
- **Unlimited workout blocks**: Add as many time slots as needed

#### Default Workout Template
```
5 AM - σθενος (Strength)
  □ □ □ □ □ □ □ □  Barbell Press (8 sets)

6 AM
  □ □ □ □ □ □ □ □  Dumbell Curl (8 sets)
  □  Wide grip (1 set × 95 reps)

7 AM
  □ □ □ □ □ □ □ □  Machine Row (8 sets)
```

#### Customization
Via Settings Modal → Workout Template tab:
- Add/remove workout blocks
- Edit time slots (e.g., change 5AM to 6:30AM)
- Modify exercise names
- Adjust number of sets per exercise (1-20)
- Add custom workout names/labels
- Changes persist across all future dates

#### Scoring Algorithm
```
Fitness Score = (Completed Sets / Total Sets) × 100
```

Example: 16 out of 17 total sets completed = 94 points (mint green)

---

### 3. Task Management System

#### Features
- **Dynamic todo list** with unlimited tasks
- **Checkbox completion tracking** for each task
- **Editable task text** with inline editing
- **Add tasks on the fly** using "Add Task" button
- **Persistent storage** per date
- **Delete tasks** when no longer needed
- **Independent lists** for each day

#### User Workflow
1. Tasks load automatically for the current date
2. Click checkbox to mark complete/incomplete
3. Click task text to edit
4. Click "Add Task" to create new items
5. All changes auto-save immediately

#### Scoring Algorithm
```
Tasks Score = (Completed Tasks / Total Tasks) × 100
```

Example: 6 out of 7 tasks completed = 86 points (blue)

---

### 4. Nutrition Tracking System

#### Tracked Macronutrients
Six macros tracked with distinct color-coded progress bars:

| Nutrient | Default Target | Bar Color | Gradient |
|----------|---------------|-----------|----------|
| **Protein** | 175g | Green | #4ecca3 |
| **Carbs** | 300g | Orange | #ffa726 |
| **Fiber** | 22g | Tan | #d4a574 |
| **Sugar** | 75g | White | #e0e0e0 |
| **Fat** | 205g | Pink | #f48fb1 |
| **Salt** | 4000mg | Gray | #90a4ae |
| **Calories** | 2400 kcal | (tracked but not scored) |

#### Visual Feedback System
Progress bars provide instant feedback:
- **Bar fill**: Shows current intake vs target
- **Opacity changes**: Indicates adherence quality
  - **90-110% of target**: Full opacity (on track)
  - **>110%**: Reduced opacity (over target)
  - **<90%**: Reduced opacity (under target)

#### Customization
All targets fully customizable via Settings Modal → Nutrition Targets tab

#### Scoring Algorithm
```javascript
Start at 100 points
For each nutrient that is >20% away from target:
  Subtract 10 points
Minimum score: 0
Returns 0 if no nutrition data entered
```

Example Calculation:
- Protein: 160g / 175g target = 91% ✓ (within 20%)
- Carbs: 320g / 300g target = 107% ✓ (within 20%)
- Fiber: 15g / 22g target = 68% ✗ (>20% below) → -10 points
- Sugar: 75g / 75g target = 100% ✓
- Fat: 200g / 205g target = 98% ✓
- Salt: 3800mg / 4000mg target = 95% ✓

**Final Score**: 100 - 10 = 90 points (mint green)

---

### 5. Sleep Tracking System

#### Features
- **Sleep hours input** (0-24 hours, 0.5 hour increments)
- **Configurable target range** (default: 7-9 hours)
- **Intelligent scoring** based on sleep quality zones
- **Same-day tracking** (records for current date)

#### Customization
Configure optimal sleep range via Settings Modal → Sleep Target tab:
- Minimum hours for 100 points (default: 7)
- Maximum hours for 100 points (default: 9)

#### Scoring Algorithm
```javascript
Within target range (7-9h):        100 points
1 hour outside range (6h or 10h):  80 points
2 hours outside range (5h or 11h): 60 points
>2 hours outside range:            40 points
No data or 0 hours:                0 points
```

Example: 8 hours sleep = 100 points (mint green)
Example: 6 hours sleep = 80 points (blue)

---

### 6. 30-Day Analytics Dashboard

#### Features
Real-time trend visualizations for all four wellness categories displayed in the right panel.

#### Four Trend Charts
1. **Fitness Score Chart** (mint green line with gradient fill)
2. **Tasks Score Chart** (blue line with gradient fill)
3. **Food Score Chart** (orange line with gradient fill)
4. **Sleep Score Chart** (purple line with gradient fill)

#### Chart Specifications
- **Technology**: Chart.js with smooth curves
- **Scale**: 0-100 on Y-axis
- **Time Range**: Last 30 days
- **Date Format**: MM-DD on X-axis
- **Style**: Line charts with gradient area fill
- **Updates**: Real-time as data changes
- **Responsive**: Adapts to screen size

#### Responsive Behavior
- **Desktop (>1400px)**: Charts displayed in right sidebar
- **Tablet/Mobile (<1400px)**: Charts stack below main panel

---

### 7. Settings & Customization Modal

Accessed via gear icon (⚙️) in top-right corner.

#### Three Configuration Tabs

##### A. Workout Template Tab
Full workout editor with visual preview:
- **Add Workout Blocks**: Create new time-based workout slots
- **Edit Times**: Change workout times (e.g., 5AM → 6:30AM)
- **Edit Workout Names**: Customize labels (e.g., "Morning Strength")
- **Add/Remove Exercises**: Unlimited exercises per block
- **Configure Sets**: 1-20 sets per exercise
- **Delete Blocks**: Remove unwanted workout times
- **Real-time Preview**: See changes as you edit

##### B. Sleep Target Tab
Configure optimal sleep range:
- **Minimum Sleep Hours**: Lower bound for 100-point score
- **Maximum Sleep Hours**: Upper bound for 100-point score
- **Scoring Guide**: Shows how different sleep durations are scored
- **Default**: 7-9 hours

##### C. Nutrition Targets Tab
Customize all macro targets:
- **Protein** (grams)
- **Carbs** (grams)
- **Fiber** (grams)
- **Sugar** (grams)
- **Fat** (grams)
- **Salt** (milligrams)

#### Settings Persistence
All settings stored in localStorage:
- `arete-workout-template`: Workout configuration
- `arete-sleep-target`: Sleep range
- `arete-nutrition-targets`: Macro goals

Settings apply to current date and all future dates.

---

### 8. Auto-Save System

#### Features
- **Automatic saving** on every data change
- **No manual save required** (save button removed)
- **Visual feedback indicators**:
  - "Saving..." (blue border pulse)
  - "All changes saved" (green border, auto-hides after 2s)
  - "Save failed" (red border, auto-hides after 3s)
- **Debounce protection**: Prevents saves during data loading

#### Save Triggers
Auto-save activates when user:
- Checks/unchecks workout sets
- Completes/uncompletes tasks
- Edits task text
- Updates nutrition values
- Changes sleep hours
- Modifies settings

#### Technical Implementation
All data saved to browser localStorage with date-specific keys.

---

### 9. Date Navigation & Historical Data

#### Features
- **Date Picker**: Click date to select any day
- **Previous/Next Buttons**: Navigate day-by-day (← →)
- **Today Button**: Quick return to current date
- **Unlimited History**: Access all past data
- **Independent Daily Records**: Each date stores separately
- **Future Dates**: Can pre-plan upcoming days

#### User Workflow
1. Click date picker to open calendar
2. Select any date (past, present, or future)
3. View/edit data for that date
4. Navigate with arrows for adjacent days
5. All changes auto-save to selected date

#### Data Independence
- Each date has its own workout completion state
- Tasks are date-specific (today's tasks ≠ yesterday's)
- Nutrition and sleep tracked per day
- Scores calculated independently per date
- Historical data never modified when viewing

---

## Technical Architecture

### Frontend Stack
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No framework dependencies (1035 lines)
- **Chart.js**: 30-day trend visualizations
- **LocalStorage API**: Client-side data persistence

### Backend Stack (Available)
- **Flask**: Python web framework
- **Flask-CORS**: Cross-origin resource sharing
- **JSON File Storage**: data.json for server-side persistence
- **Vercel Serverless**: Ready for cloud deployment

### Current Architecture
**100% Client-Side Implementation**
- All data stored in browser localStorage
- No server API calls required for functionality
- Backend exists but not actively used
- Can run completely offline after first load

### Data Flow
```
User Input → JavaScript Event Handler → Update State →
Save to localStorage → Recalculate Scores → Update UI →
Update Charts → Show Save Feedback
```

---

## Data Model & Persistence

### localStorage Keys Structure

#### Daily Data
```
Key: arete-YYYY-MM-DD
Value: {
  "date": "2025-12-23",
  "workouts": [
    {
      "time": "5 AM",
      "name": "σθενος",
      "exercises": [
        {
          "name": "Barbell Press",
          "sets": [false, true, true, ...],
          "totalSets": 8
        }
      ]
    }
  ],
  "tasks": [
    {
      "id": 1735008000000,
      "text": "Review project documentation",
      "completed": false
    }
  ],
  "nutrition": {
    "protein": 160,
    "carbs": 320,
    "fiber": 15,
    "sugar": 70,
    "fat": 200,
    "salt": 3800,
    "calories": 2350
  },
  "sleep_hours": 8,
  "scores": {
    "fitness": 94,
    "tasks": 86,
    "food": 90,
    "sleep": 100
  }
}
```

#### Settings Data
```
Key: arete-workout-template
Value: [
  {
    "time": "5 AM",
    "name": "σθενος",
    "exercises": [
      { "name": "Barbell Press", "sets": 8 }
    ]
  }
]

Key: arete-sleep-target
Value: { "min": 7, "max": 9 }

Key: arete-nutrition-targets
Value: {
  "protein": 175,
  "carbs": 300,
  "fiber": 22,
  "sugar": 75,
  "fat": 205,
  "salt": 4000
}
```

---

## Visual Design System

### Color Palette

#### Background & Structure
- **Page Background**: Linear gradient from #1a1a1a to #2d2d3d (purple-blue)
- **Card Background**: rgba(255, 255, 255, 0.05) with glassmorphism
- **Card Backdrop**: Blur(10px) for frosted glass effect
- **Border**: rgba(255, 255, 255, 0.1)

#### Score Colors (Dynamic)
- **90-100**: #4ecca3 (Mint Green) - Excellence
- **80-89**: #6eb6ff (Sky Blue) - Good Progress
- **70-79**: #ffa726 (Orange) - Acceptable
- **<70**: #ff6b6b (Red) - Needs Work

#### Nutrition Bar Colors
- **Protein**: Linear gradient from #4ecca3 to transparent (Green)
- **Carbs**: Linear gradient from #ffa726 to transparent (Orange)
- **Fiber**: Linear gradient from #d4a574 to transparent (Tan)
- **Sugar**: Linear gradient from #e0e0e0 to transparent (White)
- **Fat**: Linear gradient from #f48fb1 to transparent (Pink)
- **Salt**: Linear gradient from #90a4ae to transparent (Gray)

#### Text Colors
- **Primary Text**: #e0e0e0 (Light gray)
- **Secondary Text**: #b0b0b0 (Medium gray)
- **Accent Text**: #4ecca3 (Mint green)

### Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headers**: Bold weight, larger size
- **Body**: Normal weight, readable size
- **Monospace**: For numerical data

### Layout & Spacing
- **Two-Column Layout** (desktop):
  - Left: Main dashboard (70%)
  - Right: Analytics charts (30%)
- **Single-Column Layout** (mobile/tablet):
  - Stacked vertically
  - Cards full width

### Design Effects
- **Glassmorphism**: Frosted glass cards with backdrop blur
- **Smooth Transitions**: 0.3s ease on hover states
- **Hover Effects**: Slight lift and brightness increase
- **Box Shadows**: Subtle elevation for depth
- **Gradient Fills**: Chart areas and progress bars

### Responsive Breakpoints
```css
@media (max-width: 1400px) {
  /* Charts move below main panel */
  /* Single-column layout */
}

@media (max-width: 768px) {
  /* 2-column score grid */
  /* Single-column nutrition */
  /* Smaller font sizes */
}
```

---

## Greek Philosophy Integration

The application embraces Greek philosophical concepts of excellence and virtue.

### Greek Terms Used

| Term | Pronunciation | Meaning | Usage in App |
|------|--------------|---------|--------------|
| **αρετη** | arete | Excellence, virtue | Application name |
| **σθενος** | sthenos | Strength | Default workout name |
| **πυθαγορας** | Pythagoras | Nutrition philosopher | (Historical reference) |
| **πpοσεκτικος** | proséktikos | Mindfulness, attention | (Planned feature) |
| **ασκλητιος** | asklētios | Discipline, training | (Planned feature) |

### Philosophy
The name "Arete" represents the ancient Greek concept of excellence - not just physical prowess, but the fulfillment of purpose and achievement of one's highest potential across all dimensions of life: physical (fitness), mental (tasks), nutritional (food), and rest (sleep).

---

## User Workflows

### Daily Usage Pattern
1. **Morning**: Open app (defaults to today)
2. **During Workouts**: Check off sets as completed
3. **Throughout Day**: Add and complete tasks
4. **At Meals**: Log nutrition intake
5. **Evening**: Record sleep hours
6. **Continuous**: Watch scores update in real-time
7. **Review**: Check 30-day trends in right panel
8. **Auto-Save**: All changes saved automatically

### Configuration Workflow
1. Click gear icon (⚙️) in top-right corner
2. Select desired tab:
   - **Workout Template**: Modify exercises and schedules
   - **Sleep Target**: Adjust optimal sleep range
   - **Nutrition Targets**: Change macro goals
3. Make changes in the editor
4. Click "Save All Settings" button
5. Settings apply immediately and persist for all future dates
6. Close modal to return to dashboard

### Historical Review Workflow
1. Click date in header to open date picker
2. Select past date to review
3. View all data for that date
4. Optionally edit historical data
5. Changes auto-save to that date
6. Use arrow buttons to navigate adjacent days
7. Click date again to select different date
8. Review trends in analytics charts

---

## API Endpoints (Backend - Available but Not Used)

The Flask backend provides these endpoints for potential multi-device sync:

### Data Endpoints
```
GET  /                          Health check / serve index
GET  /api/daily/<date>          Retrieve daily data (YYYY-MM-DD)
POST /api/daily/<date>          Save daily data with scores
GET  /api/workouts/template     Get default workout template
GET  /api/nutrition/targets     Get nutrition target defaults
```

### Example Request
```bash
# Get daily data
curl https://arete.vercel.app/api/daily/2025-12-23

# Save daily data
curl -X POST https://arete.vercel.app/api/daily/2025-12-23 \
  -H "Content-Type: application/json" \
  -d '{"workouts": [...], "tasks": [...], ...}'
```

**Note**: Current frontend implementation uses localStorage exclusively. API endpoints are ready for future multi-device synchronization feature.

---

## Limitations & Considerations

### Current Limitations
1. **Single Device Storage**: Data stored in browser localStorage only
   - Not synchronized across devices
   - Not accessible from different browsers
   - Tied to specific browser profile

2. **No Cloud Backup**:
   - Data lost if browser cache cleared
   - No automatic backup system
   - Manual export not implemented

3. **No Authentication**:
   - No user accounts or login system
   - Single-user per browser/device
   - No multi-user support

4. **Browser Storage Limits**:
   - Typically 5-10MB localStorage quota
   - Varies by browser and device
   - No warning when approaching limit

5. **No Data Export**:
   - No built-in CSV/PDF export
   - Manual extraction via browser DevTools only
   - No sharing functionality

6. **No Offline Notifications**:
   - No reminders for daily tracking
   - No push notifications
   - No mobile app features

### Technical Considerations
- **Browser Compatibility**: Requires modern browser with localStorage support
- **JavaScript Required**: Won't function with JavaScript disabled
- **Privacy First**: All data stays local (benefit and limitation)
- **Performance**: Excellent for single user, no server latency
- **Scalability**: Limited to browser storage capacity

---

## Future Enhancements

### Near-Term (Backend Activation)
- [ ] Multi-device synchronization (use existing Flask API)
- [ ] Cloud backup to JSON file storage
- [ ] Data export (CSV, JSON, PDF formats)
- [ ] Import data from file
- [ ] Backup/restore functionality

### Medium-Term (Extended Features)
- [ ] User authentication and accounts
- [ ] Multi-user support with data isolation
- [ ] Weekly and monthly analytics views
- [ ] Goal setting and progress tracking
- [ ] Streak tracking for consistency
- [ ] Custom themes (light/dark/custom colors)
- [ ] Todoist API integration for tasks
- [ ] Calendar view for monthly overview

### Long-Term (Platform Expansion)
- [ ] Progressive Web App (PWA) with offline support
- [ ] Native mobile applications (iOS/Android)
- [ ] Desktop applications (Electron)
- [ ] Social features (accountability partners)
- [ ] Community challenges and leaderboards
- [ ] Integration with fitness trackers (Fitbit, Apple Health)
- [ ] Nutrition database API integration
- [ ] AI-powered insights and recommendations
- [ ] Voice input for quick logging
- [ ] Widget support for mobile home screens

---

## File Structure

```
/Users/walkermy4/Code/arete/
├── api/
│   └── index.py              # Flask backend API (697 lines)
│                            # Available for multi-device sync
├── static/
│   ├── index.html            # Main UI structure (429 lines)
│   ├── app.js               # Frontend logic (1035 lines)
│   └── styles.css           # Dark theme styling (733 lines)
├── app.py                    # Local development server
├── requirements.txt          # Python dependencies (Flask, Flask-CORS)
├── vercel.json              # Serverless deployment config
├── data.json                # Server-side data storage (unused)
├── .gitignore               # Git exclusions
├── CLAUDE.md                 # Development instructions
├── README.md                 # Quick start and deployment guide
└── Spec.md                   # This file - complete specification
```

---

## Development Information

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run local server
python app.py

# Access application
http://localhost:5000/static/index.html
```

### Deployment
Configured for Vercel serverless deployment:
```bash
# Deploy with Vercel CLI
vercel

# Or connect GitHub repository to Vercel dashboard
# Auto-deploys on git push
```

### Code Statistics
- **Total Lines**: ~2,900 lines of code
- **Frontend**: ~2,200 lines (HTML/CSS/JS)
- **Backend**: ~700 lines (Python/Flask)
- **Languages**: JavaScript (36%), CSS (25%), Python (24%), HTML (15%)

---

## Scoring Summary Reference

Quick reference for all scoring algorithms:

| Category | Algorithm | Notes |
|----------|-----------|-------|
| **Fitness** | (Completed Sets / Total Sets) × 100 | Based on checkbox completion |
| **Tasks** | (Completed Tasks / Total Tasks) × 100 | Based on todo completion |
| **Food** | 100 - (10 × nutrients >20% off target) | Min: 0, Max: 100 |
| **Sleep** | Tiered: 100/80/60/40 points | Based on distance from target range |

**Color Coding** (All Categories):
- 90-100: Mint Green (#4ecca3)
- 80-89: Blue (#6eb6ff)
- 70-79: Orange (#ffa726)
- <70: Red (#ff6b6b)

---

## Support & Contributing

### Getting Help
- Review README.md for deployment instructions
- Check browser console for JavaScript errors
- Inspect localStorage in DevTools for data issues
- Verify browser supports modern JavaScript (ES6+)

### Contributing
This is a personal wellness tracker, but feel free to:
- Fork the repository for personal use
- Customize for your own needs
- Submit issues for bugs found
- Suggest enhancements

### License
MIT License - Free to use and modify

---

**Built with Flask, vanilla JavaScript, Chart.js, and a commitment to αρετή (excellence).**

*Last Updated: December 2025*
