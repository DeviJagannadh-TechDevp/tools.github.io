document.addEventListener('DOMContentLoaded', () => {
    const meowSound = document.getElementById('meow-sound');
    const replySound = document.getElementById('reply-sound');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const startTimerButton = document.getElementById('start-timer');
    const pauseTimerButton = document.getElementById('pause-timer');
    const timerDisplay = document.getElementById('timer-display');
    const reminderBox = document.getElementById('reminder-box');
    let studyTimer, breakTimer, remainingTime, breakInterval, nextBreakTime, isPaused = false;

    const randomMessages = [
        "Are you studying?",
        "Keep up the good work!",
        "Stay focused!",
        "You can do it!",
        "Remember to take breaks.",
        "Concentration is key!",
        "How's the study going?",
        "Stay motivated!",
        "Don't give up!",
        "Keep pushing!",
        "You're doing great!",
        "Almost there!",
        "Keep that brain working!",
        "Stay on track!",
        "Focus on your goals!",
        "Every effort counts!",
        "Keep learning!",
        "Don't lose focus!",
        "Stay sharp!",
        "You're on fire!",
        "Keep those notes handy!",
        "Remember to review!",
        "Keep your mind clear!",
        "Stay productive!",
        "Every step is progress!",
        "Keep challenging yourself!",
        "Keep your energy up!",
        "Stay determined!",
        "You're making progress!",
        "Focus on the task at hand!"
    ];

    const predefinedResponses = {
        "hello": "Hi there! Let's study hard and achieve our goals!",
        "hi": "Hello! Ready to study?",
        "how are you": "I'm a cat, always ready to help you study!",
        "what's up": "Just here to help you study!",
        "help": "Sure, let's get back to studying!",
        "thank you": "You're welcome! Now, let's study!",
        "bye": "Let's study now. Bye bye, all the best!",
        "good morning": "Good morning! Time to study!",
        "good night": "Good night! See you tomorrow for more studying!",
        "good afternoon": "Good afternoon! Let's keep studying!",
        "good evening": "Good evening! Don't forget to study!",
        "hi cat": "Hi! Ready to study together?",
        "who are you": "I'm your study buddy cat!",
        "study time": "Yes, let's study!",
        "are you real": "I'm a virtual cat here to help you study!",
        "why study": "Studying helps you achieve your goals!",
        "what is your name": "I'm just your study buddy cat!",
        "do you like studying": "Yes, I love helping you study!",
        "how old are you": "I'm timeless, just here to help you study!",
        "where are you from": "I'm from the internet, here to help you study!",
        "let's study": "Yes, let's get to work!",
        "I'm bored": "Keep pushing, you can do it!",
        "I'm tired": "Take a short break, then let's get back to studying!",
        "motivate me": "You can achieve anything with hard work!",
        "I need a break": "Remember to rest and recharge!",
        "what should I study": "Focus on what's important to you!",
        "I'm distracted": "Try to focus, you can do it!",
        "any tips": "Take breaks and stay hydrated!",
        "let's chat": "Sure, but let's keep it short and study!",
        "tell me a joke": "Why did the cat sit on the computer? To keep an eye on the mouse!",
        "I'm stressed": "Take deep breaths, you got this!",
        "I'm happy": "That's great! Let's channel that energy into studying!",
        "let's play": "Let's play a game of studying hard!",
        "I love cats": "Me too! Now let's study!",
        "are you there": "Yes, I'm here to help you study!",
        "what do you do": "I help you stay focused on studying!",
        "what's new": "New study techniques to try!",
        "how to study": "Break it into chunks and take regular breaks!",
        "study tips": "Keep your study area tidy and take notes!",
        "exam tips": "Review past papers and stay calm!",
        "assignment help": "Break it into smaller tasks and tackle them one by one!",
        "feeling lazy": "A little effort now will pay off later!",
        "what's next": "Let's review what we've studied so far!",
        "need advice": "Stay focused, take breaks, and keep pushing!",
        "encourage me": "You're doing great, keep it up!",
        "remind me": "Don't forget to take short breaks and stay hydrated!",
        "let's do this": "Yes! Let's get to work!",
        "all the best":"Thank you! All the best to you too!"
    };


    function addMessage(sender, text) {
        const message = document.createElement('div');
        message.classList.add('chat-message');
        message.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
        meowSound.play(); // Play the meow sound every time a message is added
    }

    function randomCatMessage() {
        const message = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        addMessage('Cat', message);
    }

    sendButton.addEventListener('click', () => {
        const userMessage = chatInput.value.trim().toLowerCase();
        if (userMessage) {
            addMessage('You', chatInput.value);
            chatInput.value = '';
            if (predefinedResponses[userMessage]) {
                setTimeout(() => {
                    addMessage('Cat', predefinedResponses[userMessage]);
                    replySound.play();
                }, 1000);
            } else {
                setTimeout(() => {
                    addMessage('Cat', 'Let\'s study now. Bye bye, all the best!');
                    replySound.play();
                }, 1000);
            }
        }
    });

    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    function updateTimerDisplay() {
        const now = Date.now();
        const timeRemaining = remainingTime - (now - nextBreakTime + breakInterval);
        const nextBreak = nextBreakTime - now;

        if (timeRemaining <= 0) {
            clearInterval(studyTimer);
            clearInterval(breakTimer);
            timerDisplay.innerHTML = 'Study time is over! Great job!';
            return;
        }

        timerDisplay.innerHTML = `
            <div>Time Over: ${formatTime(timeRemaining)}</div>
            <div>Time Remaining: ${formatTime(remainingTime)}</div>
            <div>Next Break Time: ${formatTime(nextBreak)}</div>
        `;
    }

    function startTimer() {
        const studyHours = parseInt(document.getElementById('study-hours').value) || 0;
        let breakMinutes = parseInt(document.getElementById('break-minutes').value) || 30;
        // If break duration is 0, set it to a default value (5 minutes)
        if (breakMinutes === 0) {
            breakMinutes = 5;
        }
        remainingTime = studyHours * 3600000; // Convert hours to milliseconds
        breakInterval = breakMinutes * 60000; // Convert minutes to milliseconds
        nextBreakTime = Date.now() + breakInterval;

        clearInterval(studyTimer);
        clearInterval(breakTimer);

        studyTimer = setInterval(updateTimerDisplay, 1000);
        breakTimer = setInterval(() => {
            addMessage('Cat', "Time for a break! Remember to rest and recharge.");
            meowSound.play();
            nextBreakTime = Date.now() + breakInterval;
        }, breakInterval);

        isPaused = false;
    }

    function pauseTimer() {
        if (!isPaused) {
            clearInterval(studyTimer);
            clearInterval(breakTimer);
            isPaused = true;
            pauseTimerButton.innerText = 'Resume';
        } else {
            nextBreakTime = Date.now() + (nextBreakTime - Date.now());
            startTimer();
            pauseTimerButton.innerText = 'Pause';
        }
    }

    startTimerButton.addEventListener('click', startTimer);
    pauseTimerButton.addEventListener('click', pauseTimer);

    // Initial greeting from the cat
    setTimeout(() => {
        addMessage('Cat', "Hello! Hi, I am your study partner. Let's study hard and achieve our goals!");
    }, 1000);

    setInterval(randomCatMessage, 120000); // 2 minutes in milliseconds
});

function showSuggestions() {
    const suggestionsContainer = document.getElementById('suggestions-container');
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    const keys = Object.keys(predefinedResponses);

    keys.forEach(key => {
        const suggestion = document.createElement('div');
        suggestion.classList.add('suggestion');
        suggestion.innerText = key;
        suggestionsContainer.appendChild(suggestion);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Other code...

    // Initial display of suggestions
    showSuggestions();

    // Refresh suggestions every 5 minutes
    setInterval(showSuggestions, 5 * 60 * 1000); // 5 minutes in milliseconds
});


// Show the pop-up messages below the chat box
showRandomPopUpMessages();

function showSuggestions() {
    const suggestionsContainer = document.getElementById('suggestions-container');
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    const keys = Object.keys(predefinedResponses);
    const randomKeys = keys.sort(() => 0.5 - Math.random()).slice(0, 7);

    randomKeys.forEach(key => {
        const suggestion = document.createElement('div');
        suggestion.classList.add('suggestion');
        suggestion.innerText = key;
        suggestionsContainer.appendChild(suggestion);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Other code...

    // Initial display of suggestions
    showSuggestions();

    // Refresh suggestions every 5 minutes
    setInterval(showSuggestions, 5 * 60 * 1000); // 5 minutes in milliseconds
});

function showSuggestions() {
    const suggestionsContainer = document.getElementById('suggestions-container');
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    const keys = Object.keys(predefinedResponses);

    keys.forEach(key => {
        const suggestion = document.createElement('div');
        suggestion.classList.add('suggestion');
        suggestion.innerText = key;
        suggestionsContainer.appendChild(suggestion);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Other code...

    // Initial display of suggestions
    showSuggestions();

    // Refresh suggestions every 5 minutes
    setInterval(showSuggestions, 5 * 60 * 1000); // 5 minutes in milliseconds
});

