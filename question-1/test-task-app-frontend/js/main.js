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
            if (data.messages) {
                let errorMessages = '';
                for (const field in data.messages) {
                    errorMessages += `${data.messages[field].join(' ')}\n`;
                }
                alert(errorMessages);
            } else {
                alert(data.error || 'Registration failed');
            }
        }

    } catch (error) {
        alert('An error occurred during registration. Please try again later');
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
