// const apiUrl = 'http://localhost:8000/api';
const token = localStorage.getItem('token');

document.getElementById('addTask').addEventListener('click', async () => {
    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;

    try {
        const response = await fetch(`${apiUrl}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: taskName, description: taskDescription }),
        });

        const task = await response.json();
        if (response.ok) {
            loadTasks();
            document.getElementById('taskName').value = '';
            document.getElementById('taskDescription').value = '';
        } else {
            alert(task.message || 'Failed to add task');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

async function loadTasks() {
    try {
        const response = await fetch(`${apiUrl}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const tasks = await response.json();
        const taskContainer = document.getElementById('taskContainer');
        taskContainer.innerHTML = '';

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');

            const taskName = document.createElement('div');
            taskName.textContent = `${task.name} - ${task.is_completed ? 'Completed' : 'Pending'}`;
    
            taskElement.appendChild(taskName);

            const taskDescription = document.createElement('div');
            taskDescription.textContent = task.description;

            taskElement.appendChild(taskDescription);

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.addEventListener('click', () => markTaskComplete(task.id));
            if (task.is_completed) completeButton.disabled = true;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(task.id));

            taskElement.appendChild(completeButton);
            taskElement.appendChild(deleteButton);
            taskContainer.appendChild(taskElement);
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
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
