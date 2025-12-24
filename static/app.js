// Pure client-side app using localStorage
let currentDate = new Date().toISOString().split('T')[0];
let workoutTemplate = [];
let nutritionTargets = {
    calories: 2400,
    protein: 175,
    carbs: 300,
    fiber: 22,
    sugar: 75,
    fat: 205,
    salt: 4000
};

let charts = {
    fitness: null,
    tasks: null,
    food: null,
    sleep: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadNutritionTargets();
    initializeDatePicker();
    loadWorkoutTemplate();
    loadDailyData();
    setupEventListeners();
    initializeCharts();
    updateCharts();
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

    // Nutrition targets modal
    document.getElementById('edit-targets-btn').addEventListener('click', openTargetsModal);
    document.getElementById('save-targets-btn').addEventListener('click', saveNutritionTargets);
    document.getElementById('cancel-targets-btn').addEventListener('click', closeTargetsModal);

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

// LocalStorage helpers
function loadFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Nutrition targets management
function loadNutritionTargets() {
    const saved = loadFromStorage('arete-nutrition-targets');
    if (saved) {
        nutritionTargets = saved;
    }
    updateTargetLabels();
}

function updateTargetLabels() {
    document.getElementById('target-protein').textContent = nutritionTargets.protein;
    document.getElementById('target-carbs').textContent = nutritionTargets.carbs;
    document.getElementById('target-fiber').textContent = nutritionTargets.fiber;
    document.getElementById('target-sugar').textContent = nutritionTargets.sugar;
    document.getElementById('target-fat').textContent = nutritionTargets.fat;
    document.getElementById('target-salt').textContent = nutritionTargets.salt;
}

function openTargetsModal() {
    document.getElementById('modal-protein').value = nutritionTargets.protein;
    document.getElementById('modal-carbs').value = nutritionTargets.carbs;
    document.getElementById('modal-fiber').value = nutritionTargets.fiber;
    document.getElementById('modal-sugar').value = nutritionTargets.sugar;
    document.getElementById('modal-fat').value = nutritionTargets.fat;
    document.getElementById('modal-salt').value = nutritionTargets.salt;
    document.getElementById('targets-modal').style.display = 'block';
}

function closeTargetsModal() {
    document.getElementById('targets-modal').style.display = 'none';
}

function saveNutritionTargets() {
    nutritionTargets = {
        calories: 2400,
        protein: parseInt(document.getElementById('modal-protein').value),
        carbs: parseInt(document.getElementById('modal-carbs').value),
        fiber: parseInt(document.getElementById('modal-fiber').value),
        sugar: parseInt(document.getElementById('modal-sugar').value),
        fat: parseInt(document.getElementById('modal-fat').value),
        salt: parseInt(document.getElementById('modal-salt').value)
    };

    saveToStorage('arete-nutrition-targets', nutritionTargets);
    updateTargetLabels();
    updateNutritionProgress();
    closeTargetsModal();
}

function loadWorkoutTemplate() {
    workoutTemplate = [
        {
            'time': '5AM',
            'name': 'σθενος',
            'exercises': [
                {'name': '[0*][10] - barbell press', 'sets': [false, false, false, false, false, false, false, false]}
            ]
        },
        {
            'time': '6AM',
            'name': '',
            'exercises': [
                {'name': '[30*][10] - dumbell curl', 'sets': [false, false, false, false, false, false, false, false]},
                {'name': '[8] wide', 'sets': [false], 'reps': 95}
            ]
        },
        {
            'time': '7AM',
            'name': '',
            'exercises': [
                {'name': 'machine row', 'sets': [false, false, false, false, false, false, false, false]}
            ]
        }
    ];
    renderWorkouts([]);
}

function loadDailyData() {
    const data = loadFromStorage(`arete-${currentDate}`) || {
        date: currentDate,
        workouts: [],
        tasks: [],
        nutrition: {},
        sleep_hours: 0,
        scores: {fitness: 0, tasks: 0, food: 0, sleep: 0}
    };

    // Update scores
    updateScores(data.scores);

    // Update workouts
    renderWorkouts(data.workouts);

    // Update tasks
    renderTasks(data.tasks);

    // Update nutrition
    updateNutrition(data.nutrition);

    // Update sleep
    document.getElementById('sleep-hours').value = data.sleep_hours || '';

    // Update charts
    updateCharts();
}

function calculateFitnessScore(workouts) {
    if (!workouts || workouts.length === 0) return 0;
    let total = 0;
    let completed = 0;

    workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
            total += exercise.sets.length;
            completed += exercise.sets.filter(s => s).length;
        });
    });

    return total > 0 ? Math.round((completed / total) * 100) : 0;
}

function calculateTasksScore(tasks) {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
}

function calculateFoodScore(nutrition) {
    if (!nutrition || Object.keys(nutrition).length === 0) return 0;
    let score = 100;

    for (const [nutrient, value] of Object.entries(nutrition)) {
        const target = nutritionTargets[nutrient];
        if (target > 0) {
            const diff = Math.abs(value - target) / target;
            if (diff > 0.2) {
                score -= 10;
            }
        }
    }

    return Math.max(0, score);
}

function calculateSleepScore(sleepHours) {
    if (sleepHours >= 7 && sleepHours <= 9) return 100;
    if (sleepHours >= 6) return 80;
    if (sleepHours >= 5) return 60;
    return 40;
}

function updateScores(scores) {
    document.getElementById('fitness-score').textContent = scores.fitness || 0;
    document.getElementById('tasks-score').textContent = scores.tasks || 0;
    document.getElementById('food-score').textContent = scores.food || 0;
    document.getElementById('sleep-score').textContent = scores.sleep || 0;

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
        calories: 0
    };
}

function saveData() {
    const workouts = collectWorkoutData();
    const tasks = collectTaskData();
    const nutrition = collectNutritionData();
    const sleepHours = parseFloat(document.getElementById('sleep-hours').value) || 0;

    const scores = {
        fitness: calculateFitnessScore(workouts),
        tasks: calculateTasksScore(tasks),
        food: calculateFoodScore(nutrition),
        sleep: calculateSleepScore(sleepHours)
    };

    const dailyData = {
        date: currentDate,
        workouts: workouts,
        tasks: tasks,
        nutrition: nutrition,
        sleep_hours: sleepHours,
        scores: scores
    };

    // Save to localStorage
    saveToStorage(`arete-${currentDate}`, dailyData);

    // Update scores display
    updateScores(scores);

    // Update charts
    updateCharts();

    // Show success feedback
    const saveBtn = document.getElementById('save-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.style.background = '#45b890';

    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = 'linear-gradient(135deg, #4ecca3 0%, #45b890 100%)';
    }, 2000);
}

// Charts functionality
function initializeCharts() {
    const chartConfig = {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#b0b0b0'
                    },
                    grid: {
                        color: 'rgba(78, 204, 163, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#b0b0b0',
                        maxTicksLimit: 10
                    },
                    grid: {
                        color: 'rgba(78, 204, 163, 0.1)'
                    }
                }
            }
        }
    };

    charts.fitness = new Chart(document.getElementById('fitness-chart'), {
        ...chartConfig,
        data: {
            labels: [],
            datasets: [{
                label: 'Fitness Score',
                data: [],
                borderColor: '#4ecca3',
                backgroundColor: 'rgba(78, 204, 163, 0.1)',
                tension: 0.4,
                fill: true
            }]
        }
    });

    charts.tasks = new Chart(document.getElementById('tasks-chart'), {
        ...chartConfig,
        data: {
            labels: [],
            datasets: [{
                label: 'Tasks Score',
                data: [],
                borderColor: '#6eb6ff',
                backgroundColor: 'rgba(110, 182, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        }
    });

    charts.food = new Chart(document.getElementById('food-chart'), {
        ...chartConfig,
        data: {
            labels: [],
            datasets: [{
                label: 'Food Score',
                data: [],
                borderColor: '#ffa726',
                backgroundColor: 'rgba(255, 167, 38, 0.1)',
                tension: 0.4,
                fill: true
            }]
        }
    });

    charts.sleep = new Chart(document.getElementById('sleep-chart'), {
        ...chartConfig,
        data: {
            labels: [],
            datasets: [{
                label: 'Sleep Score',
                data: [],
                borderColor: '#9c27b0',
                backgroundColor: 'rgba(156, 39, 176, 0.1)',
                tension: 0.4,
                fill: true
            }]
        }
    });
}

function updateCharts() {
    const days = 30;
    const labels = [];
    const fitnessData = [];
    const tasksData = [];
    const foodData = [];
    const sleepData = [];

    // Get last 30 days of data
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const data = loadFromStorage(`arete-${dateStr}`);

        labels.push(dateStr.slice(5)); // MM-DD format
        fitnessData.push(data?.scores?.fitness || 0);
        tasksData.push(data?.scores?.tasks || 0);
        foodData.push(data?.scores?.food || 0);
        sleepData.push(data?.scores?.sleep || 0);
    }

    // Update all charts
    charts.fitness.data.labels = labels;
    charts.fitness.data.datasets[0].data = fitnessData;
    charts.fitness.update();

    charts.tasks.data.labels = labels;
    charts.tasks.data.datasets[0].data = tasksData;
    charts.tasks.update();

    charts.food.data.labels = labels;
    charts.food.data.datasets[0].data = foodData;
    charts.food.update();

    charts.sleep.data.labels = labels;
    charts.sleep.data.datasets[0].data = sleepData;
    charts.sleep.update();
}
