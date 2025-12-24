from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from datetime import datetime, date
import json
import os

app = Flask(__name__, static_folder='../static')
CORS(app)

# Simple in-memory storage (for MVP - replace with database later)
DATA_FILE = 'data.json'

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def get_today():
    return date.today().isoformat()

def calculate_fitness_score(workouts):
    if not workouts:
        return 0
    total = sum(len(w.get('sets', [])) for w in workouts)
    completed = sum(sum(1 for s in w.get('sets', []) if s) for w in workouts)
    return int((completed / total * 100)) if total > 0 else 0

def calculate_tasks_score(tasks):
    if not tasks:
        return 0
    completed = sum(1 for t in tasks if t.get('completed', False))
    return int((completed / len(tasks) * 100))

def calculate_food_score(nutrition, targets):
    if not nutrition:
        return 0
    score = 100
    for nutrient, value in nutrition.items():
        target = targets.get(nutrient, 0)
        if target > 0:
            diff = abs(value - target) / target
            if diff > 0.2:  # More than 20% off
                score -= 10
    return max(0, score)

def calculate_sleep_score(sleep_hours):
    if sleep_hours <= 0:
        return 0
    # Calculate raw percentage based on target midpoint (7-9 hours, midpoint = 8)
    target_midpoint = 8
    return round((sleep_hours / target_midpoint) * 100)

@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/api/daily/<date_str>', methods=['GET'])
def get_daily(date_str):
    data = load_data()
    daily = data.get(date_str, {
        'date': date_str,
        'workouts': [],
        'tasks': [],
        'nutrition': {},
        'sleep_hours': 0,
        'scores': {'fitness': 0, 'tasks': 0, 'food': 0, 'sleep': 0}
    })
    return jsonify(daily)

@app.route('/api/daily/<date_str>', methods=['POST'])
def update_daily(date_str):
    data = load_data()
    daily_data = request.json

    # Calculate scores
    targets = {
        'calories': 2400,
        'protein': 175,
        'carbs': 300,
        'fiber': 22,
        'sugar': 75,
        'fat': 205,
        'salt': 4000
    }

    scores = {
        'fitness': calculate_fitness_score(daily_data.get('workouts', [])),
        'tasks': calculate_tasks_score(daily_data.get('tasks', [])),
        'food': calculate_food_score(daily_data.get('nutrition', {}), targets),
        'sleep': calculate_sleep_score(daily_data.get('sleep_hours', 0))
    }

    daily_data['scores'] = scores
    daily_data['date'] = date_str
    data[date_str] = daily_data
    save_data(data)

    return jsonify(daily_data)

@app.route('/api/workouts/template', methods=['GET'])
def get_workout_template():
    template = [
        {
            'time': '5AM',
            'name': 'σθενος',
            'exercises': [
                {'name': '[0*][10] - barbell press', 'sets': [False] * 8}
            ]
        },
        {
            'time': '6AM',
            'name': '',
            'exercises': [
                {'name': '[30*][10] - dumbell curl', 'sets': [False] * 8},
                {'name': '[8] wide', 'sets': [False] * 1, 'reps': 95}
            ]
        },
        {
            'time': '7AM',
            'name': '',
            'exercises': [
                {'name': 'machine row', 'sets': [False] * 8}
            ]
        }
    ]
    return jsonify(template)

@app.route('/api/nutrition/targets', methods=['GET'])
def get_nutrition_targets():
    targets = {
        'calories': 2400,
        'protein': 175,
        'carbs': 300,
        'fiber': 22,
        'sugar': 75,
        'fat': 205,
        'salt': 4000
    }
    return jsonify(targets)

# Vercel serverless function handler
def handler(request):
    with app.request_context(request.environ):
        return app.full_dispatch_request()
