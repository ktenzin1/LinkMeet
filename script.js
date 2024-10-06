// script.js
document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.querySelector('input[placeholder="Full Name"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value; // Ensure this input is added to your HTML
    const skills = document.querySelector('input[placeholder="Skills (comma-separated)"]').value;
    try {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, skills }),
        });
        const data = await response.json();
        alert(data.message || data.error);
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating account.');
    }
});

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.querySelector('input[placeholder="Email"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value; // Ensure this input is added to your HTML

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        alert(data.message || data.error);
    } catch (error) {
        console.error('Error:', error);
        alert('Error logging in.');
    }
});

// Search form
document.getElementById('search-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const skill = document.querySelector('input[name="skill"]').value;

    try {
        const response = await fetch(`/search?skill=${encodeURIComponent(skill)}`, {
            method: 'GET',
        });
        const professionals = await response.json();
        
        const resultsDiv = document.getElementById('search-results');
        resultsDiv.innerHTML = ''; // Clear previous results

        if (professionals.length > 0) {
            professionals.forEach(prof => {
                const professionalDiv = document.createElement('div');
                professionalDiv.textContent = `Name: ${prof.username}, Skills: ${prof.skills.join(', ')}`;
                resultsDiv.appendChild(professionalDiv);
            });
        } else {
            resultsDiv.textContent = 'No live professionals found for the selected skill.';
        }
    } catch (error) {
        alert('Search failed.');
    }
});
