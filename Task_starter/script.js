
// Task data model
let tasks = [
    {
        id: 1,
        title: 'Complete Project proposal',
        completed: true,
        priority: 'urgent',
        createAt: new Date('2024-04-01T10:00:00')
    },
    {
        id: 2,
        title: 'Cook Food',
        completed: false,
        priority: 'normal',
        createAt: new Date()
    },
    {
        id: 2,
        title: 'Cook Food',
        completed: false,
        priority: 'normal',
        createAt: new Date()
    },
];

const tasksContainer = document.getElementById('tasks-container');
const task = document.getElementById('task');


function renderTasks() {
    tasksContainer.innerHTML = '';
    tasks.forEach((ts) => {
        const taskHTML = document.createElement('div');
        const status = ts.completed ? 'completed' : ts.priority
        taskHTML.className = `task ${status}`
        taskHTML.innerHTML = `
    
          <div class="task-left">
            <div class="task-check" onclick="toggleTaskCompletion(1)">
              <!-- This is where the checkmark SVG would appear when completed -->
            </div>
            <div class="task-info">
              <div class="task-title">${ts.title}</div>
              <div class="task-meta">
                <span>${ts.createAt}</span>
             ${ts.priority == 'urgent' ? '<span class="priority-badge urgent">Urgent</span>' : '<span class="priority-badge normal">Normal</span>'}                   
              </div>
            </div>
          </div>
          <div class="task-actions">
            <button class="task-action-btn" onclick="deleteTask(1)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>

      
      `
        tasksContainer.appendChild(taskHTML);
    })

    console.log((tasks));




}


renderTasks();