const apiUrl = 'http://localhost:8000/api';

document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'app.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('registerForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password_confirmation = document.getElementById('password_confirmation').value;

    try {
        const response = await fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, password_confirmation }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'app.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

const path = window.location.pathname;

if (path === '/app.html' && !localStorage.getItem('token')) {
    window.location.href = 'index.html';
} else if (path !== '/index.html' && path !== '/app.html' && path !== '/404.html' && path !== '/register.html') {
    window.location.href = '404.html';
}

document.getElementById('logout')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

if (window.location.pathname === '/app.html') {
    loadTasks();
}

async function loadTasks() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${apiUrl}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const tasks = await response.json();
        const taskContainer = document.getElementById('taskContainer');

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.textContent = `${task.name} - ${task.is_completed ? 'Completed' : 'Pending'}`;
            taskContainer.appendChild(taskElement);
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}
