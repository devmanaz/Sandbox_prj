// Simple frontend JavaScript template

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    
    // Example: Get elements by ID
    const button = document.getElementById('myButton');
    
    // Example: Add event listener
    if (button) {
        button.addEventListener('click', () => {
            console.log('Button clicked');
        });
    }
});

// Example function
function greet(name) {
    return `Hello, ${name}!`;
}

// Export for use in other modules
module.exports = { greet };