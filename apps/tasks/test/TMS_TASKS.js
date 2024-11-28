// List of possible task titles and projects
const taskTitles = [
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

const projectNames = [
    "Website Redesign",
    "Mobile App Development",
    "Marketing Campaign",
    "Client Onboarding",
    "Sales Growth Strategy",
    "Tech Support",
    "Product Launch",
    "Content Creation",
    "Internal Tools",
    "Data Analytics"
];

// Function to generate a random number between a min and max value
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random task body
function generateRandomBody() {
    const descriptions = [
        "Work on completing the assigned sections and submit it by the end of the day.",
        "Ensure all content is updated and relevant to the target audience.",
        "Investigate the issue and resolve the broken link on the homepage.",
        "Prepare a visually appealing and informative presentation for the upcoming client meeting.",
        "Analyze industry trends and provide insights for the upcoming quarter.",
        "Create a new user interface layout with improved navigation and user experience.",
        "Test the newly developed feature and log any bugs or performance issues.",
        "Write a compelling blog post on recent trends in the tech industry.",
        "Schedule and lead the weekly team meeting, and ensure all agendas are covered.",
        "Review the latest code submissions, check for errors, and approve the pull requests."
    ];
    return descriptions[getRandomInt(0, descriptions.length - 1)];
}

// Function to generate a random task
function generateRandomTask(len) {
    return {
        id: len + 1,
        body: generateRandomBody(), // Meaningful task body
        duration: getRandomInt(30, 180), // Random duration between 30 to 180 minutes
        title: taskTitles[getRandomInt(0, taskTitles.length - 1)], // Random task title
        // project: projectNames[getRandomInt(0, projectNames.length - 1)] // Random project name
    };
}

// Function to create 50 tasks and store them in local storage
export function generateTasksInLocalStorage() {
    const tasks = [];
    
    // Generate 50 random tasks
    for (let i = 0; i < 50; i++) {
        tasks.push(generateRandomTask(tasks?.length));
    }

    // Store tasks in local storage under the key 'TMS_TASKS'
    localStorage.setItem('TMS_TASKS', JSON.stringify(tasks));

    console.log('50 meaningful tasks have been generated and stored in local storage under TMS_TASKS');
}

// Call the function to generate tasks and store them in local storage
// document.querySelector("button").addEventListener("click", generateTasksInLocalStorage)
