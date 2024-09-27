const token = localStorage.getItem('token');

document.getElementById('addTask').addEventListener('click', async () => {
    const taskId = document.getElementById('addTask').dataset.taskId;
    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;

    try {
        let response;

        if (taskName === '') {
            alert('Task name can not be empty');
            return;
        }
        
        if (taskId) {
            response = await fetch(`${apiUrl}/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: taskName, description: taskDescription }),
            });
        } else {
            response = await fetch(`${apiUrl}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: taskName, description: taskDescription }),
            });
        }

        const task = await response.json();
        if (response.ok) {
            loadTasks();
            document.getElementById('taskName').value = '';
            document.getElementById('taskDescription').value = '';
            document.getElementById('addTask').textContent = 'Add Task';
            delete document.getElementById('addTask').dataset.taskId;
        } else {
            alert(task.message || 'Failed to add/update task');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function updateProgressBar(completedTasks, totalTasks) {
    const progressBar = document.getElementById('progressBar');
    const progressBarContainer = document.getElementById('progressBarContainer');

    if (totalTasks > 0) {
        const percentage = (completedTasks / totalTasks) * 100;
        progressBar.style.width = percentage + '%';
        progressBarContainer.style.display = 'block';
    } else {
        progressBar.style.width = '0%';
        progressBarContainer.style.display = 'none';
    }
}

async function loadTasks() {
    const searchQuery = document.getElementById('search').value.toLowerCase();

    try {
        const response = await fetch(`${apiUrl}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        let tasks = await response.json();
        const taskContainer = document.getElementById('taskContainer');
        taskContainer.innerHTML = '';

        const completedTasks = tasks.filter(task => task.is_completed).length;
        updateProgressBar(completedTasks, tasks.length);

        tasks = tasks.filter(task => task.name.toLowerCase().includes(searchQuery));

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');

            const titleContainer = document.createElement('div');
            titleContainer.classList.add('title-container');


            const taskName = document.createElement('div');
            taskName.classList.add('task-name');
            taskName.textContent = task.name;

            const taskStatus = document.createElement('div');
            taskStatus.classList.add('task-status');
            taskStatus.textContent = `${task.is_completed ? 'Completed' : 'Pending'}`;
    
            titleContainer.appendChild(taskName);
            titleContainer.appendChild(taskStatus);

            taskElement.appendChild(titleContainer);

            const taskDescription = document.createElement('div');
            taskDescription.textContent = task.description;

            taskElement.appendChild(taskDescription);

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editTask(task.id));
            buttonContainer.appendChild(editButton);

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.addEventListener('click', () => markTaskComplete(task.id));
            if (task.is_completed) completeButton.disabled = true;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(task.id));

            buttonContainer.appendChild(completeButton);
            buttonContainer.appendChild(deleteButton);
            taskElement.appendChild(buttonContainer);
            taskContainer.appendChild(taskElement);
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

async function editTask(taskId) {
    try {
        const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const task = await response.json();
        if (response.ok) {
            document.getElementById('taskName').value = task.name;
            document.getElementById('taskDescription').value = task.description;

            const addTaskButton = document.getElementById('addTask');
            addTaskButton.textContent = 'Update Task';
            addTaskButton.dataset.taskId = taskId;
        } else {
            alert(task.message || 'Failed to load task details');
        }
    } catch (error) {
        console.error('Error fetching task details:', error);
    }
}

async function markTaskComplete(taskId) {
    try {
        const response = await fetch(`${apiUrl}/tasks/${taskId}/complete`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            loadTasks();
        } else {
            const result = await response.json();
            alert(result.message || 'Failed to mark task as complete');
        }
    } catch (error) {
        console.error('Error marking task complete:', error);
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            loadTasks();
        } else {
            const result = await response.json();
            alert(result.message || 'Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

if (!token) {
    window.location.href = 'index.html';
} else {
    loadTasks();
}

document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});
