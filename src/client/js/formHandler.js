import { checkForName } from './nameChecker';

const form = document.getElementById('urlForm');
if (form) {
    form.addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
    event.preventDefault();

    const formText = document.getElementById('name').value;

    checkForName(formText);
    
    fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: formText })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('results').innerText = JSON.stringify(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
// Export the function to the global scope
window.handleSubmit = handleSubmit;

// export { handleSubmit };
