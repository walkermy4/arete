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

let sleepTarget = {
    min: 7,
    max: 9
};

let charts = {
    fitness: null,
    tasks: null,
    food: null,
    sleep: null
};

// Auto-save configuration
let autoSaveIndicatorTimeout = null;
let isLoadingData = false;

function triggerAutoSave() {
    if (isLoadingData) return;
    autoSaveData();
}

function autoSaveData() {
    showAutoSaveIndicator('saving');
    try {
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

        saveToStorage(`arete-${currentDate}`, dailyData);
        updateScores(scores);
        updateCharts();
        showAutoSaveIndicator('saved');
    } catch (error) {
        console.error('Auto-save failed:', error);
        showAutoSaveIndicator('error');
    }
}

function showAutoSaveIndicator(state) {
    let indicator = document.getElementById('auto-save-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'auto-save-indicator';
        document.querySelector('.left-panel').insertBefore(
            indicator, document.querySelector('.left-panel').firstChild
        );
    }

    if (autoSaveIndicatorTimeout) clearTimeout(autoSaveIndicatorTimeout);

    switch(state) {
        case 'saving':
            indicator.textContent = 'Saving...';
            indicator.className = 'auto-save-indicator saving';
            indicator.style.opacity = '1';
            break;
        case 'saved':
            indicator.textContent = 'All changes saved';
            indicator.className = 'auto-save-indicator saved';
            indicator.style.opacity = '1';
            autoSaveIndicatorTimeout = setTimeout(() => {
                indicator.style.opacity = '0';
            }, 2000);
            break;
        case 'error':
            indicator.textContent = 'Save failed';
            indicator.className = 'auto-save-indicator error';
            indicator.style.opacity = '1';
            autoSaveIndicatorTimeout = setTimeout(() => {
                indicator.style.opacity = '0';
            }, 3000);
            break;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAllSettings();
    initializeDatePicker();
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

    // Settings modal
    document.getElementById('settings-btn').addEventListener('click', openSettingsModal);
    document.getElementById('save-settings-btn').addEventListener('click', saveAllSettings);
    document.getElementById('cancel-settings-btn').addEventListener('click', closeSettingsModal);

    // Settings tabs
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', (e) => switchSettingsTab(e.target.dataset.tab));
    });

    // Add workout block
    document.getElementById('add-workout-block-btn').addEventListener('click', addWorkoutBlockToEditor);

    // Auto-save for static inputs
    document.querySelectorAll('.nutrition-input').forEach(input => {
        input.addEventListener('input', () => {
            updateNutritionProgress();
            triggerAutoSave();
        });
    });
    document.getElementById('sleep-hours').addEventListener('input', triggerAutoSave);

    // Event delegation for dynamic elements
    setupEventDelegation();
}

function setupEventDelegation() {
    const workoutsContainer = document.getElementById('workouts-container');
    workoutsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('set-checkbox')) {
            triggerAutoSave();
        }
    });

    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('task-checkbox')) {
            triggerAutoSave();
        }
    });
    tasksContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('task-input')) {
            triggerAutoSave();
        }
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


// Settings Management
function loadAllSettings() {
    loadNutritionTargets();
    loadSleepTarget();
    loadWorkoutTemplateFromStorage();
}

function loadSleepTarget() {
    const saved = loadFromStorage('arete-sleep-target');
    if (saved) {
        sleepTarget = saved;
    }
}

function loadWorkoutTemplateFromStorage() {
    const saved = loadFromStorage('arete-workout-template');
    if (saved && saved.length > 0) {
        workoutTemplate = saved;
    } else {
        // Use default hardcoded template
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
    }
}


// Settings Modal Controls
function openSettingsModal() {
    // Populate workout template editor
    renderWorkoutTemplateEditor();

    // Populate sleep target fields
    document.getElementById('sleep-min').value = sleepTarget.min;
    document.getElementById('sleep-max').value = sleepTarget.max;

    // Populate nutrition targets
    document.getElementById('settings-protein').value = nutritionTargets.protein;
    document.getElementById('settings-carbs').value = nutritionTargets.carbs;
    document.getElementById('settings-fiber').value = nutritionTargets.fiber;
    document.getElementById('settings-sugar').value = nutritionTargets.sugar;
    document.getElementById('settings-fat').value = nutritionTargets.fat;
    document.getElementById('settings-salt').value = nutritionTargets.salt;

    // Show modal on workout tab by default
    switchSettingsTab('workout');
    document.getElementById('settings-modal').style.display = 'block';
}

function closeSettingsModal() {
    document.getElementById('settings-modal').style.display = 'none';
}

function switchSettingsTab(tabName) {
    // Remove active from all tabs
    document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.settings-tab-content').forEach(content => content.classList.remove('active'));

    // Add active to selected tab
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Workout Template Editor
function renderWorkoutTemplateEditor() {
    const container = document.getElementById('workout-template-editor');
    container.innerHTML = '';

    workoutTemplate.forEach((workout, workoutIndex) => {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'workout-block-editor';
        blockDiv.dataset.workoutIndex = workoutIndex;

        // Block header with time and name inputs
        const headerDiv = document.createElement('div');
        headerDiv.className = 'workout-block-header';

        const timeInput = document.createElement('input');
        timeInput.type = 'text';
        timeInput.className = 'time-input';
        timeInput.value = workout.time;
        timeInput.placeholder = 'Time';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'name-input';
        nameInput.value = workout.name;
        nameInput.placeholder = 'Workout Name';

        const removeBlockBtn = document.createElement('button');
        removeBlockBtn.className = 'remove-workout-block-btn';
        removeBlockBtn.textContent = 'Remove Block';
        removeBlockBtn.onclick = () => removeWorkoutBlock(workoutIndex);

        headerDiv.appendChild(timeInput);
        headerDiv.appendChild(nameInput);
        headerDiv.appendChild(removeBlockBtn);
        blockDiv.appendChild(headerDiv);

        // Exercises
        const exercisesDiv = document.createElement('div');
        exercisesDiv.className = 'exercises-editor';

        workout.exercises.forEach((exercise, exerciseIndex) => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.className = 'exercise-editor';

            const exerciseNameInput = document.createElement('input');
            exerciseNameInput.type = 'text';
            exerciseNameInput.className = 'exercise-name-input';
            exerciseNameInput.value = exercise.name;
            exerciseNameInput.placeholder = 'Exercise name';

            const setsCountInput = document.createElement('input');
            setsCountInput.type = 'number';
            setsCountInput.className = 'sets-count-input';
            setsCountInput.value = exercise.sets.length;
            setsCountInput.min = '1';
            setsCountInput.max = '20';
            setsCountInput.placeholder = 'Sets';

            const removeExerciseBtn = document.createElement('button');
            removeExerciseBtn.className = 'remove-exercise-btn';
            removeExerciseBtn.textContent = 'Remove';
            removeExerciseBtn.onclick = () => removeExercise(workoutIndex, exerciseIndex);

            exerciseDiv.appendChild(exerciseNameInput);
            exerciseDiv.appendChild(setsCountInput);
            exerciseDiv.appendChild(removeExerciseBtn);
            exercisesDiv.appendChild(exerciseDiv);
        });

        blockDiv.appendChild(exercisesDiv);

        // Add exercise button
        const addExerciseBtn = document.createElement('button');
        addExerciseBtn.className = 'add-exercise-btn';
        addExerciseBtn.textContent = '+ Add Exercise';
        addExerciseBtn.onclick = () => addExercise(workoutIndex);
        blockDiv.appendChild(addExerciseBtn);

        container.appendChild(blockDiv);
    });
}

function addWorkoutBlockToEditor() {
    workoutTemplate.push({
        time: '',
        name: '',
        exercises: [{name: '', sets: [false, false, false, false]}]
    });
    renderWorkoutTemplateEditor();
}

function removeWorkoutBlock(workoutIndex) {
    if (workoutTemplate.length <= 1) {
        alert('You must have at least one workout block');
        return;
    }
    workoutTemplate.splice(workoutIndex, 1);
    renderWorkoutTemplateEditor();
}

function addExercise(workoutIndex) {
    workoutTemplate[workoutIndex].exercises.push({
        name: '',
        sets: [false, false, false, false]
    });
    renderWorkoutTemplateEditor();
}

function removeExercise(workoutIndex, exerciseIndex) {
    if (workoutTemplate[workoutIndex].exercises.length <= 1) {
        alert('You must have at least one exercise per workout block');
        return;
    }
    workoutTemplate[workoutIndex].exercises.splice(exerciseIndex, 1);
    renderWorkoutTemplateEditor();
}

function collectWorkoutTemplateFromEditor() {
    const template = [];
    const blocks = document.querySelectorAll('.workout-block-editor');

    blocks.forEach(block => {
        const workoutIndex = parseInt(block.dataset.workoutIndex);
        const timeInput = block.querySelector('.time-input');
        const nameInput = block.querySelector('.name-input');
        const exerciseDivs = block.querySelectorAll('.exercise-editor');

        const exercises = [];
        exerciseDivs.forEach(exerciseDiv => {
            const exerciseNameInput = exerciseDiv.querySelector('.exercise-name-input');
            const setsCountInput = exerciseDiv.querySelector('.sets-count-input');
            const setsCount = parseInt(setsCountInput.value) || 4;

            exercises.push({
                name: exerciseNameInput.value,
                sets: Array(setsCount).fill(false)
            });
        });

        template.push({
            time: timeInput.value,
            name: nameInput.value,
            exercises: exercises
        });
    });

    return template;
}

function saveAllSettings() {
    // Save workout template
    workoutTemplate = collectWorkoutTemplateFromEditor();
    saveToStorage('arete-workout-template', workoutTemplate);

    // Save sleep target
    sleepTarget = {
        min: parseFloat(document.getElementById('sleep-min').value) || 7,
        max: parseFloat(document.getElementById('sleep-max').value) || 9
    };
    saveToStorage('arete-sleep-target', sleepTarget);

    // Save nutrition targets
    nutritionTargets = {
        calories: 2400,
        protein: parseInt(document.getElementById('settings-protein').value),
        carbs: parseInt(document.getElementById('settings-carbs').value),
        fiber: parseInt(document.getElementById('settings-fiber').value),
        sugar: parseInt(document.getElementById('settings-sugar').value),
        fat: parseInt(document.getElementById('settings-fat').value),
        salt: parseInt(document.getElementById('settings-salt').value)
    };
    saveToStorage('arete-nutrition-targets', nutritionTargets);

    // Update UI
    updateTargetLabels();
    updateNutritionProgress();

    // Re-render workouts with new template
    const currentData = loadFromStorage(`arete-${currentDate}`);
    renderWorkouts(currentData?.workouts || []);

    // Recalculate scores with new settings
    triggerAutoSave();

    closeSettingsModal();

    // Show success feedback
    showAutoSaveIndicator('saved');
}

function loadDailyData() {
    // Set flag to prevent auto-saves during loading
    isLoadingData = true;

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

    // Update charts (only if they're initialized)
    if (charts.fitness) {
        updateCharts();
    }

    // Re-enable auto-save after a short delay to ensure DOM is fully updated
    setTimeout(() => {
        isLoadingData = false;
    }, 100);
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

    // Check if ANY nutrition value (except calories) is greater than 0
    const hasAnyData = Object.entries(nutrition).some(([key, value]) => {
        if (key === 'calories') return false; // Skip calories
        return value > 0;
    });

    // If no nutrition data entered, return 0
    if (!hasAnyData) return 0;

    let totalPercentage = 0;
    let nutrientCount = 0;

    for (const [nutrient, value] of Object.entries(nutrition)) {
        if (nutrient === 'calories') continue; // Skip calories in scoring
        const target = nutritionTargets[nutrient];
        if (target > 0) {
            // Calculate percentage of target achieved
            const percentage = (value / target) * 100;
            totalPercentage += percentage;
            nutrientCount++;
        }
    }

    // Return average percentage across all nutrients
    return nutrientCount > 0 ? Math.round(totalPercentage / nutrientCount) : 0;
}

function calculateSleepScore(sleepHours) {
    // Convert to number and handle all edge cases
    const hours = Number(sleepHours);

    // If no sleep data or invalid/zero hours, return 0
    if (!hours || hours <= 0 || isNaN(hours)) return 0;

    // Calculate raw percentage based on target midpoint
    const targetMidpoint = (sleepTarget.min + sleepTarget.max) / 2;
    return Math.round((hours / targetMidpoint) * 100);
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
                    min: 0,
                    max: 200,
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
        options: {
            ...chartConfig.options,
            scales: {
                ...chartConfig.options.scales,
                y: {
                    ...chartConfig.options.scales.y,
                    max: 100
                }
            }
        },
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
        options: {
            ...chartConfig.options,
            scales: {
                ...chartConfig.options.scales,
                y: {
                    ...chartConfig.options.scales.y,
                    max: 100
                }
            }
        },
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
