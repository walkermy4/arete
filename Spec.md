# Arete - Wellness Tracking Application

## Overview
A simple Python-based wellness tracking application that replicates the functionality of a Google Sheets daily tracker. The app allows users to track fitness activities, daily tasks, nutrition intake, and sleep, with automated scoring across key wellness categories.

## Core Features

### 1. Daily Scoring Dashboard
Display daily scores (0-100) for four main categories:
- **Fitness Score (80)**: Based on workout completion
- **Tasks Score (87)**: Based on todo list completion
- **Food Score (90)**: Based on nutrition goals
- **Sleep Score (100)**: Based on sleep tracking

### 2. Workout Tracking
Time-based workout schedule with checkboxes:

**5 AM - σθενος (Strength)**
- Exercise: `[0*][10]` - Barbell Press
  - Sets: 8 reps each
  - Checkbox tracking for each set

**6 AM**
- Exercise: `[30*][10]` - Dumbell Curl (can be swapped with Dumbell Fly)
  - Sets: 8 reps each
  - Exercise: `[8] wide` - Wide grip variation
  - Sets: 95 reps

**7 AM**
- Machine Row (can be swapped with Machine Pulldown)
  - Sets: 8 reps each

**Additional Workouts**:
- πpοσεκτικος (Mindfulness/Flexibility): +820 (units TBD)
- ασκλητιος (Discipline): +9h

### 3. Task Management
**8 AM - Todoist Integration**
Editable checklist:
- Clean up desktop and todoist
- Make soil pots gardening
- Custom tasks (editable)

### 4. Nutrition Tracking
**6 PM - σθενος (Evening Check)**
- Distance: 0.0K
- Miles: 0.0mi

**Evening Nutrition - πυθαγορας (Pythagoras/Nutrition)**
Target: 2400 kcal daily

Track in grams with visual progress bars:
- **7 PM**
  - Protein: 175g (green bar)
  - Carbs: 300g (yellow/orange bar)
  - Fiber: 22g (tan bar)
  - Sugar: 75g (white bar)

- **8 PM**
  - Fat: 205g (pink bar)
  - Salt: 4000mg (white bar)

Progress bars show consumption vs. target with color coding:
- Green: On track
- Red: Over/under target

### 5. Sleep & Reading
**9 PM**
- πpοσεκτικος (Mindfulness): Checkbox
- Sleep: Tracking field

## Technical Requirements

### Technology Stack
- **Backend**: Python (Flask or FastAPI)
- **Frontend**: Simple HTML/CSS/JavaScript
- **Database**: SQLite for local testing, PostgreSQL for production
- **Deployment**: Vercel-compatible (using serverless functions)

### Data Model
- **User**: Basic user account
- **DailyEntry**: Date-based records
- **WorkoutLog**: Checkbox completion for each exercise/set
- **TodoList**: Dynamic task list with completion status
- **NutritionLog**: Gram-based tracking for all nutrients
- **SleepLog**: Sleep duration and quality
- **Scores**: Calculated scores for each category

### Scoring Algorithm
Each category (Fitness, Tasks, Food, Sleep) scored 0-100:
- **Fitness**: % of planned workout checkboxes completed
- **Tasks**: % of todo items completed
- **Food**: Composite score based on hitting nutrition targets
- **Sleep**: Based on sleep duration and timing

## UI/UX Design Principles
- Clean, minimal interface
- Mobile-responsive
- Dark theme (matching the screenshot aesthetic)
- Visual progress indicators (checkboxes, progress bars)
- Daily view with date navigation
- Quick data entry
- Greek terminology for section headers (σθενος, πυθαγορας, πpοσεκτικος)

## MVP Scope (Phase 1)
1. Single-user local deployment
2. Daily workout checkbox tracking
3. Simple todo list with checkboxes
4. Nutrition logging with progress bars
5. Basic scoring calculation
6. Simple SQLite database
7. Responsive web interface

## Future Enhancements (Phase 2+)
- Multi-user support with authentication
- Historical data visualization (charts, trends)
- Weekly/monthly analytics
- Custom workout templates
- Todoist API integration
- Mobile app (PWA)
- Export data to CSV/PDF
- Goal setting and reminders
- Social features / accountability partners

## Deployment Options
1. **Local**: Run Flask/FastAPI server locally
2. **Vercel**: Deploy as serverless Python functions with static frontend
3. **Docker**: Containerized deployment for any platform

## Greek Terms Reference
- **σθενος** (sthenos): Strength
- **πυθαγορας** (Pythagoras): Associated with nutrition/wellness philosophy
- **πpοσεκτικος** (proséktikos): Mindfulness/attention
- **ασκλητιος** (asklētios): Discipline/training
- **αρετη** (arete): Excellence/virtue (project name)
