document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Account created! You can now log in.');
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Logged in successfully!');
});
