# Arete - Wellness Tracker

A simple, elegant wellness tracking application inspired by Greek philosophy. Track your fitness, tasks, nutrition, and sleep with a clean dark-themed interface.

![Arete Screenshot](https://via.placeholder.com/800x400?text=Arete+Wellness+Tracker)

## Features

- **Daily Scoring**: Get instant feedback on Fitness, Tasks, Food, and Sleep (0-100 scale)
- **Workout Tracking**: Checkbox-based workout logging with customizable exercises and sets
- **Task Management**: Simple todo list to track daily goals
- **Nutrition Tracking**: Log macros with visual progress bars (protein, carbs, fiber, sugar, fat, salt)
- **Sleep Logging**: Track sleep hours with automatic scoring
- **Date Navigation**: Easily navigate between days to review history

## Quick Start (Local Development)

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd arete
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

4. Open your browser and navigate to:
```
http://localhost:5000/static/index.html
```

That's it! You should see the Arete wellness tracker interface.

## Deploy to Vercel

### Prerequisites
- [Vercel Account](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/docs/cli) (optional, for command-line deployment)

### Option 1: Deploy via GitHub (Recommended)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin master
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "New Project"

4. Import your GitHub repository

5. Vercel will auto-detect the configuration from `vercel.json`

6. Click "Deploy"

7. Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and your app will be deployed!

## Project Structure

```
arete/
├── api/
│   └── index.py          # Flask API endpoints
├── static/
│   ├── index.html        # Main HTML interface
│   ├── styles.css        # Dark theme styling
│   └── app.js            # Frontend JavaScript logic
├── app.py                # Local development server
├── requirements.txt      # Python dependencies
├── vercel.json           # Vercel deployment config
├── .gitignore           # Git ignore rules
├── Spec.md              # Full specification document
└── README.md            # This file
```

## API Endpoints

- `GET /` - Health check
- `GET /api/daily/<date>` - Get daily data for a specific date
- `POST /api/daily/<date>` - Save daily data and calculate scores
- `GET /api/workouts/template` - Get default workout template
- `GET /api/nutrition/targets` - Get nutrition targets

## Data Storage

Currently uses a simple JSON file (`data.json`) for data persistence. This is perfect for:
- Local testing
- Single-user deployments
- MVP/prototype stage

For production multi-user deployments, consider upgrading to:
- PostgreSQL (via Vercel Postgres)
- MongoDB
- Firebase

## Customization

### Change Workout Template
Edit the workout template in `api/index.py`:
```python
@app.route('/api/workouts/template', methods=['GET'])
def get_workout_template():
    # Customize your workouts here
```

### Change Nutrition Targets
Edit nutrition targets in `api/index.py`:
```python
@app.route('/api/nutrition/targets', methods=['GET'])
def get_nutrition_targets():
    # Customize your targets here
```

### Modify Scoring Algorithm
Edit the scoring functions in `api/index.py`:
- `calculate_fitness_score()`
- `calculate_tasks_score()`
- `calculate_food_score()`
- `calculate_sleep_score()`

## Color Theme

The app uses a dark theme with accent colors:
- Background: `#1a1a1a`
- Cards: `#2d2d2d`
- Primary Accent: `#4ecca3` (mint green)
- Text: `#e0e0e0`

Nutrition progress bars have distinct colors:
- Protein: Green (`#4ecca3`)
- Carbs: Orange (`#ffa726`)
- Fiber: Tan (`#d4a574`)
- Sugar: White (`#e0e0e0`)
- Fat: Pink (`#f48fb1`)
- Salt: Gray (`#90a4ae`)

## Greek Philosophy

The name "Arete" (ἀρετή) means excellence or virtue in ancient Greek philosophy. It represents the fulfillment of purpose and the achievement of one's highest potential - the perfect name for a wellness tracker.

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## License

MIT License - feel free to use and modify as needed.

## Troubleshooting

### Local Development Issues

**Port already in use?**
```bash
# Change port in app.py
app.run(debug=True, host='0.0.0.0', port=5001)
```

**Dependencies not installing?**
```bash
# Try upgrading pip first
pip install --upgrade pip
pip install -r requirements.txt
```

### Vercel Deployment Issues

**Build failing?**
- Make sure `requirements.txt` is in the root directory
- Verify `vercel.json` configuration is correct
- Check Vercel build logs for specific errors

**API not working after deployment?**
- Ensure all API routes start with `/api/`
- Check browser console for CORS errors
- Verify environment variables if using any

## Roadmap

- [ ] Historical data visualization (charts/graphs)
- [ ] Weekly and monthly analytics
- [ ] Multi-user support with authentication
- [ ] Mobile app (PWA)
- [ ] Export data to CSV/PDF
- [ ] Todoist API integration
- [ ] Custom workout templates
- [ ] Goal setting and streak tracking
- [ ] Dark/Light theme toggle

## Support

For questions or issues, please open an issue on GitHub.

---

Built with Flask, vanilla JavaScript, and a commitment to αρετή (excellence).
