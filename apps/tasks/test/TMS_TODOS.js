// List of possible task titles and projects
const todos = [
    "Complete project report",
    "Update website content",
    "Fix broken link",
    "Prepare presentation",
    "Research market trends",
    "Design new UI layout",
    "Test new feature",
    "Write blog post",
    "Organize team meeting",
    "Review pull requests"
];

// Function to generate a random number between a min and max value
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Function to generate a random task
function generateRandomTodo(len) {
    return {
        id: len + 1,
        title: todos[getRandomInt(0, todos?.length - 1)], // Random task title
    };
}

// Function to create 50 tasks and store them in local storage
export function generateTodosInLocalStorage() {
    const todos = [];
    
    // Generate 50 random tasks
    for (let i = 0; i < 50; i++) {
        todos.push(generateRandomTodo(todos?.length));
    }

    // Store tasks in local storage under the key 'TMS_TASKS'
    localStorage.setItem('TMS_TODOS', JSON.stringify(todos));

    console.log('50 meaningful todos have been generated and stored in local storage under TMS_TODOS');
}

// Call the function to generate tasks and store them in local storage
// document.querySelector("button").addEventListener("click", generateTasksInLocalStorage)
