// API Base URL - automatically detects local vs production
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

let currentDate = new Date().toISOString().split('T')[0];
let workoutTemplate = [];
let nutritionTargets = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeDatePicker();
    loadWorkoutTemplate();
    loadNutritionTargets();
    loadDailyData();
    setupEventListeners();
});

function initializeDatePicker() {
    const datePicker = document.getElementById('date-picker');
    datePicker.value = currentDate;
}

function setupEventListeners() {
    document.getElementById('prev-day').addEventListener('click', () => changeDate(-1));
    document.getElementById('next-day').addEventListener('click', () => changeDate(1));
    document.getElementById('date-picker').addEventListener('change', (e) => {
        currentDate = e.target.value;
        loadDailyData();
    });
    document.getElementById('add-task-btn').addEventListener('click', addTask);
    document.getElementById('save-btn').addEventListener('click', saveData);

    // Auto-update progress bars on nutrition input
    document.querySelectorAll('.nutrition-input').forEach(input => {
        input.addEventListener('input', updateNutritionProgress);
    });
}

function changeDate(days) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    currentDate = date.toISOString().split('T')[0];
    document.getElementById('date-picker').value = currentDate;
    loadDailyData();
}

async function loadWorkoutTemplate() {
    try {
        const response = await fetch(`${API_BASE}/api/workouts/template`);
        workoutTemplate = await response.json();
        renderWorkouts([]);
    } catch (error) {
        console.error('Error loading workout template:', error);
    }
}

async function loadNutritionTargets() {
    try {
        const response = await fetch(`${API_BASE}/api/nutrition/targets`);
        nutritionTargets = await response.json();
    } catch (error) {
        console.error('Error loading nutrition targets:', error);
    }
}

async function loadDailyData() {
    try {
        const response = await fetch(`${API_BASE}/api/daily/${currentDate}`);
        const data = await response.json();

        // Update scores
        updateScores(data.scores || {});

        // Update workouts
        renderWorkouts(data.workouts || []);

        // Update tasks
        renderTasks(data.tasks || []);

        // Update nutrition
        updateNutrition(data.nutrition || {});

        // Update sleep
        document.getElementById('sleep-hours').value = data.sleep_hours || '';
    } catch (error) {
        console.error('Error loading daily data:', error);
    }
}

function updateScores(scores) {
    document.getElementById('fitness-score').textContent = scores.fitness || 0;
    document.getElementById('tasks-score').textContent = scores.tasks || 0;
    document.getElementById('food-score').textContent = scores.food || 0;
    document.getElementById('sleep-score').textContent = scores.sleep || 0;

    // Update score card colors based on performance
    updateScoreColor('fitness-score', scores.fitness || 0);
    updateScoreColor('tasks-score', scores.tasks || 0);
    updateScoreColor('food-score', scores.food || 0);
    updateScoreColor('sleep-score', scores.sleep || 0);
}

function updateScoreColor(elementId, score) {
    const element = document.getElementById(elementId);
    if (score >= 90) {
        element.style.color = '#4ecca3';
    } else if (score >= 80) {
        element.style.color = '#6eb6ff';
    } else if (score >= 70) {
        element.style.color = '#ffa726';
    } else {
        element.style.color = '#ff6b6b';
    }
}

function renderWorkouts(savedWorkouts) {
    const container = document.getElementById('workouts-container');
    container.innerHTML = '';

    workoutTemplate.forEach((workout, workoutIndex) => {
        const workoutDiv = document.createElement('div');
        workoutDiv.className = 'workout-block';

        const timeHeader = document.createElement('div');
        timeHeader.className = 'workout-time';
        timeHeader.textContent = `${workout.time} ${workout.name}`;
        workoutDiv.appendChild(timeHeader);

        workout.exercises.forEach((exercise, exerciseIndex) => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.className = 'exercise-item';

            const exerciseName = document.createElement('div');
            exerciseName.className = 'exercise-name';
            exerciseName.textContent = exercise.name;
            exerciseDiv.appendChild(exerciseName);

            const setsContainer = document.createElement('div');
            setsContainer.className = 'sets-container';

            const savedSets = savedWorkouts[workoutIndex]?.exercises[exerciseIndex]?.sets || exercise.sets;

            savedSets.forEach((checked, setIndex) => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'set-checkbox';
                checkbox.checked = checked;
                checkbox.dataset.workout = workoutIndex;
                checkbox.dataset.exercise = exerciseIndex;
                checkbox.dataset.set = setIndex;
                setsContainer.appendChild(checkbox);
            });

            exerciseDiv.appendChild(setsContainer);
            workoutDiv.appendChild(exerciseDiv);
        });

        container.appendChild(workoutDiv);
    });
}

function renderTasks(tasks) {
    const container = document.getElementById('tasks-container');
    container.innerHTML = '';

    if (tasks.length === 0) {
        tasks = [{ text: '', completed: false }];
    }

    tasks.forEach((task, index) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed || false;
        checkbox.dataset.index = index;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-input';
        input.value = task.text || '';
        input.placeholder = 'Add a task...';
        input.dataset.index = index;

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(input);
        container.appendChild(taskDiv);
    });
}

function addTask() {
    const container = document.getElementById('tasks-container');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-input';
    input.placeholder = 'Add a task...';

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(input);
    container.appendChild(taskDiv);
}

function updateNutrition(nutrition) {
    document.getElementById('protein').value = nutrition.protein || '';
    document.getElementById('carbs').value = nutrition.carbs || '';
    document.getElementById('fiber').value = nutrition.fiber || '';
    document.getElementById('sugar').value = nutrition.sugar || '';
    document.getElementById('fat').value = nutrition.fat || '';
    document.getElementById('salt').value = nutrition.salt || '';

    updateNutritionProgress();
}

function updateNutritionProgress() {
    const nutrients = ['protein', 'carbs', 'fiber', 'sugar', 'fat', 'salt'];

    nutrients.forEach(nutrient => {
        const input = document.getElementById(nutrient);
        const value = parseFloat(input.value) || 0;
        const target = nutritionTargets[nutrient] || 1;
        const percentage = Math.min((value / target) * 100, 100);

        const fill = document.querySelector(`.${nutrient}-fill`);
        if (fill) {
            fill.style.width = `${percentage}%`;

            // Change color based on target achievement
            if (percentage >= 90 && percentage <= 110) {
                fill.style.opacity = '1';
            } else if (percentage > 110) {
                fill.style.opacity = '0.7';
                fill.style.filter = 'brightness(0.8)';
            } else {
                fill.style.opacity = '0.6';
            }
        }
    });
}

function collectWorkoutData() {
    const workouts = [];
    const checkboxes = document.querySelectorAll('.set-checkbox');

    workoutTemplate.forEach((workout, workoutIndex) => {
        const workoutData = {
            time: workout.time,
            name: workout.name,
            exercises: []
        };

        workout.exercises.forEach((exercise, exerciseIndex) => {
            const sets = [];
            checkboxes.forEach(cb => {
                if (parseInt(cb.dataset.workout) === workoutIndex &&
                    parseInt(cb.dataset.exercise) === exerciseIndex) {
                    sets.push(cb.checked);
                }
            });

            workoutData.exercises.push({
                name: exercise.name,
                sets: sets
            });
        });

        workouts.push(workoutData);
    });

    return workouts;
}

function collectTaskData() {
    const tasks = [];
    const taskItems = document.querySelectorAll('.task-item');

    taskItems.forEach(item => {
        const checkbox = item.querySelector('.task-checkbox');
        const input = item.querySelector('.task-input');

        if (input.value.trim()) {
            tasks.push({
                text: input.value.trim(),
                completed: checkbox.checked
            });
        }
    });

    return tasks;
}

function collectNutritionData() {
    return {
        protein: parseFloat(document.getElementById('protein').value) || 0,
        carbs: parseFloat(document.getElementById('carbs').value) || 0,
        fiber: parseFloat(document.getElementById('fiber').value) || 0,
        sugar: parseFloat(document.getElementById('sugar').value) || 0,
        fat: parseFloat(document.getElementById('fat').value) || 0,
        salt: parseFloat(document.getElementById('salt').value) || 0,
        calories: 0 // Can calculate from macros if needed
    };
}

async function saveData() {
    const dailyData = {
        workouts: collectWorkoutData(),
        tasks: collectTaskData(),
        nutrition: collectNutritionData(),
        sleep_hours: parseFloat(document.getElementById('sleep-hours').value) || 0
    };

    try {
        const response = await fetch(`${API_BASE}/api/daily/${currentDate}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dailyData)
        });

        const data = await response.json();
        updateScores(data.scores);

        // Show success feedback
        const saveBtn = document.getElementById('save-btn');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saved!';
        saveBtn.style.background = '#45b890';

        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = '#4ecca3';
        }, 2000);
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Please try again.');
    }
}
