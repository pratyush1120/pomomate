document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const timerDisplay = document.getElementById('timer-display');
    const timerButtons = document.querySelectorAll('.timer-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const themeButton = document.getElementById('theme-button');
    const notificationSound = document.getElementById('notification-sound');
    const streakCount = document.getElementById('streak-count');
    const motivationQuote = document.getElementById('motivation-quote');
    const mascot = document.getElementById('mascot');
    const mascotMessage = document.getElementById('mascot-message');
    const progressRing = document.querySelector('.progress-ring-circle');
    
    // Timer variables
    let countdown;
    let timeLeft = 0;
    let isTimerRunning = false;
    let isPaused = false;
    let selectedTime = 0;
    let progressCircumference = parseInt(getComputedStyle(progressRing).strokeDasharray);
    
    const mascotMessages = {
        start: [
            "Let's focus now!",
            "You can do this!",
            "Time to concentrate!",
            "I believe in you!",
            "Let's get started!"
        ],
        halfway: [
            "Halfway there!",
            "Keep going!",
            "You're doing great!",
            "Stay focused!",
            "Don't give up!"
        ],
        almostDone: [
            "Almost done!",
            "Final stretch!",
            "Just a bit more!",
            "You're almost there!",
            "Finish strong!"
        ],
        complete: [
            "Great job!",
            "You did it!",
            "Time for a break!",
            "Awesome work!",
            "Well done!"
        ],
        idle: [
            "Ready to focus?",
            "Need a productivity boost?",
            "Time to study?",
            "Let's be productive!",
            "Ready when you are!"
        ]
    };
    
    // Quotes for motivation
    const quotes = [
        "Small steps, big progress!",
        "Focus on what matters most.",
        "You've got this!",
        "One pomodoro at a time.",
        "Quality over quantity.",
        "Stay present, stay focused.",
        "Breathe and focus.",
        "Progress is progress, no matter how small.",
        "Consistency beats intensity.",
        "Your future self will thank you."
    ];
    
    let streak = localStorage.getItem('pomoMateStreak') ? 
        parseInt(localStorage.getItem('pomoMateStreak')) : 0;
    let lastCompletedDate = localStorage.getItem('lastCompletedDate') || '';
    
    streakCount.textContent = streak;

    function setRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        motivationQuote.textContent = `"${quotes[randomIndex]}"`;
    }

    function setMascotMessage(type) {
        const messages = mascotMessages[type];
        const randomIndex = Math.floor(Math.random() * messages.length);
        mascotMessage.textContent = messages[randomIndex];
    }
    
    setRandomQuote();
    setMascotMessage('idle');
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    function updateProgressRing(timeLeft, totalTime) {
        const progress = timeLeft / totalTime;
        const offset = progressCircumference * (1 - progress);
        progressRing.style.strokeDashoffset = offset;
    }
    

    function startTimer(minutes) {
        clearInterval(countdown);
        
        selectedTime = minutes * 60;
        timeLeft = selectedTime;
        timerDisplay.textContent = formatTime(timeLeft);
        
        // Enable control buttons
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
        timerDisplay.classList.add('timer-active');
        setMascotMessage('start');
        updateProgressRing(timeLeft, selectedTime);
        
        isTimerRunning = true;
        isPaused = false;
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        countdown = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdown);
                timerComplete();
                return;
            }
            
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);
            updateProgressRing(timeLeft, selectedTime);
            
            // Update mascot message at certain points
            const progress = timeLeft / selectedTime;
            if (progress === 0.5) {
                setMascotMessage('halfway');
            } else if (progress === 0.25) {
                setMascotMessage('almostDone');
            }
            
        }, 1000);
    }
    

    function togglePause() {
        if (!isTimerRunning) return;
        
        if (isPaused) {
            isPaused = false;
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            
            countdown = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                    timerComplete();
                    return;
                }
                
                timeLeft--;
                timerDisplay.textContent = formatTime(timeLeft);
                updateProgressRing(timeLeft, selectedTime);
                const progress = timeLeft / selectedTime;
                if (progress === 0.5) {
                    setMascotMessage('halfway');
                } else if (progress === 0.25) {
                    setMascotMessage('almostDone');
                }
            }, 1000);
        } else {
            isPaused = true;
            pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            clearInterval(countdown);
        }
    }
    
    // Reset timer
    function resetTimer() {
        clearInterval(countdown);
        timerDisplay.textContent = formatTime(selectedTime);
        timeLeft = selectedTime;
        updateProgressRing(timeLeft, selectedTime);
        
        if (isPaused) {
            isPaused = false;
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        if (!isTimerRunning) {
            pauseBtn.disabled = true;
            resetBtn.disabled = true;
            timerDisplay.classList.remove('timer-active');
        }
        
        setMascotMessage('idle');
    }
    
    function timerComplete() {
        isTimerRunning = false;
        timerDisplay.classList.remove('timer-active');
        timerDisplay.classList.add('timer-complete');
    
        notificationSound.play();
        createConfetti();
        setMascotMessage('complete');
        mascot.style.animation = 'celebrate 1s ease-in-out';
        setTimeout(() => {
            mascot.style.animation = '';
        }, 1000);
        updateStreak();
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
        timerDisplay.textContent = "Done!";
        setTimeout(() => {
            timerDisplay.textContent = formatTime(selectedTime);
            timerDisplay.classList.remove('timer-complete');
            setMascotMessage('idle');
        }, 3000);
    }
    
    // Create confetti effect
        function createConfetti() {
            const container = document.querySelector('.main-content');
            const colors = [
                '#ff8ba7', '#ffc6c7', '#c3f0ca', 
                '#a0e7e5', '#b4f8c8', '#fbe7c6'
            ];
            
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.classList.add('confetti');
                
                // Random position, color and delay
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 2 + 's';
                
                // Random size
                const size = Math.random() * 8 + 6;
                confetti.style.width = `${size}px`;
                confetti.style.height = `${size}px`;
                
                container.appendChild(confetti);
                
                // Remove confetti after animation
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }
        }
        
        function updateStreak() {
            const today = new Date().toLocaleDateString();
            if (lastCompletedDate !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayString = yesterday.toLocaleDateString();
                
                if (lastCompletedDate === yesterdayString || lastCompletedDate === '') {
                    streak++;
                } else {
                    streak = 1;
                }
                localStorage.setItem('pomoMateStreak', streak);
                localStorage.setItem('lastCompletedDate', today);
            
                streakCount.textContent = streak;
                streakCount.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    streakCount.style.animation = '';
                }, 500);
                
                setRandomQuote();
            }
        }
        
        // Toggle theme (dark/light mode)
        function toggleTheme() {
            const body = document.body;
            const icon = themeButton.querySelector('i');
            
            if (body.classList.contains('light-mode')) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('pomoMateTheme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('pomoMateTheme', 'light');
            }
        }

        function cycleMascotMessages() {
            if (!isTimerRunning) {
                setMascotMessage('idle');
                setTimeout(cycleMascotMessages, 10000); 
            }
        }
        setTimeout(cycleMascotMessages, 10000);
        
        // Event listeners
        timerButtons.forEach(button => {
            button.addEventListener('click', () => {
                const minutes = parseInt(button.dataset.time);
                startTimer(minutes);
                button.classList.add('active');
                setTimeout(() => {
                    button.classList.remove('active');
                }, 200);
            });
        });
        
        pauseBtn.addEventListener('click', togglePause);
        resetBtn.addEventListener('click', resetTimer);
        themeButton.addEventListener('click', toggleTheme);
        const savedTheme = localStorage.getItem('pomoMateTheme');
        if (savedTheme === 'dark') {
            toggleTheme();
        }
        
        // Add a little bounce animation to mascot on page load
        setTimeout(() => {
            mascot.style.animation = 'bounce 0.8s ease';
            setTimeout(() => {
                mascot.style.animation = '';
            }, 800);
        }, 300);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && isTimerRunning && !isPaused) {
                clearInterval(countdown);
                startTimer(Math.ceil(timeLeft / 60));
            }
        });
        window.addEventListener('resize', () => {
            progressCircumference = parseInt(getComputedStyle(progressRing).strokeDasharray);
            if (isTimerRunning) {
                updateProgressRing(timeLeft, selectedTime);
            }
        });
    });
    