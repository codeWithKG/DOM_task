
// Task data model
let tasks = [
    {
        id: 1,
        title: 'Complete project proposal',
        completed: false,
        priority: 'urgent',
        createdAt: new Date('2025-04-01T10:00:00')
    },
    {
        id: 2,
        title: 'Schedule team meeting',
        completed: true,
        priority: 'normal',
        createdAt: new Date('2025-04-02T14:30:00')
    },
    {
        id: 3,
        title: 'Review client feedback',
        completed: false,
        priority: 'normal',
        createdAt: new Date('2025-04-03T09:15:00')
    },
    {
        id: 4,
        title: 'Prepare presentation slides',
        completed: false,
        priority: 'urgent',
        createdAt: new Date('2025-04-03T16:45:00')
    }
];

// DOM elements
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksContainer = document.getElementById('tasks-container');
const filterButtons = document.querySelectorAll('.filter-button');
const searchInput = document.getElementById('search-input');
const summaryEl = document.getElementById('summary');

// Stats elements
const completedCountEl = document.getElementById('completed-count');
const pendingCountEl = document.getElementById('pending-count');
const urgentCountEl = document.getElementById('urgent-count');

// Current filter
let currentFilter = 'all';

// Event listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
});

searchInput.addEventListener('input', renderTasks);
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active filter button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

// Initialize
renderTasks();
updateStats();

// Add new task
function addTask() {
    const title = taskInput.value.trim();
    if (title === '') return;

    const newTask = {
        id: Date.now(),
        title,
        completed: false,
        priority: prioritySelect.value,
        createdAt: new Date()
    };

    tasks.push(newTask);
    taskInput.value = '';
    renderTasks();
    updateStats();
}

// Toggle task completion
function toggleTaskCompletion(id) {
    // Using find to get the specific task
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
    }
}

// Delete task
function deleteTask(id) {
    // Using filter to remove the task
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    updateStats();
}

// Render tasks based on filter and search
function renderTasks() {
    const searchTerm = searchInput.value.toLowerCase();

    // Using filter to get tasks based on current filter and search term
    const filteredTasks = tasks.filter(task => {
        // Filter by completion status and priority
        if (currentFilter === 'active' && task.completed) return false;
        if (currentFilter === 'completed' && !task.completed) return false;
        if (currentFilter === 'urgent' && task.priority !== 'urgent') return false;

        // Filter by search term
        return task.title.toLowerCase().includes(searchTerm);
    });

    // Sort tasks: urgents first, then by creation date (newest first)
    filteredTasks.sort((a, b) => {
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
        if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
        return b.createdAt - a.createdAt;
    });

    // Clear tasks container
    tasksContainer.innerHTML = '';

    // Using map to create task elements
    const taskElements = filteredTasks.map(task => {
        const taskEl = document.createElement('div');
        taskEl.className = `task ${task.completed ? 'completed' : task.priority}`;

        taskEl.innerHTML = `
    <div class="task-left">
        <div class="task-check ${task.completed ? 'completed' : ''}" onclick="toggleTaskCompletion(${task.id})">
            ${task.completed ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
        </div>
        <div class="task-info">
            <div class="task-title">${task.title}</div>
            <div class="task-meta">
                <span>${formatDate(task.createdAt)}</span>
                ${task.priority === 'urgent' ? '<span class="priority-badge urgent">Urgent</span>' : '<span class="priority-badge normal">Normal</span>'}
            </div>
        </div>
    </div>
    <div class="task-actions">
        <button class="task-action-btn" onclick="deleteTask(${task.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
        </button>
    </div>
    `;

        return taskEl;
    });

    // Append all task elements
    taskElements.forEach(el => tasksContainer.appendChild(el));

    // Show empty state if no tasks
    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                        No tasks found
                    </div>
                `;
    }

    // Update summary
    updateSummary(filteredTasks);
}

// Update task stats
function updateStats() {
    // Using reduce to count tasks by status
    const stats = tasks.reduce((acc, task) => {
        if (task.completed) {
            acc.completed++;
        } else {
            acc.pending++;
            if (task.priority === 'urgent') {
                acc.urgent++;
            }
        }
        return acc;
    }, { completed: 0, pending: 0, urgent: 0 });

    completedCountEl.textContent = `${stats.completed} Completed`;
    pendingCountEl.textContent = `${stats.pending} Pending`;
    urgentCountEl.textContent = `${stats.urgent} Urgent`;
}

// Update summary
function updateSummary(filteredTasks) {
    // Using reduce to get summary data
    const summaryData = filteredTasks.reduce((acc, task) => {
        if (task.completed) {
            acc.completed++;
        } else {
            acc.pending++;
        }
        return acc;
    }, { completed: 0, pending: 0 });

    const totalTasks = filteredTasks.length;
    const completionRate = totalTasks > 0
        ? Math.round((summaryData.completed / totalTasks) * 100)
        : 0;

    summaryEl.textContent = `Showing ${totalTasks} tasks (${summaryData.completed} completed, ${summaryData.pending} pending) - ${completionRate}% completion rate`;
}

// Format date helper
function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' +
            date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}
