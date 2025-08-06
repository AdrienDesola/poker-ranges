// Simple Quiz - One Random Question
class SimpleQuiz {
    constructor() {
        this.currentQuestion = null;
        this.selectedAnswer = null;
        this.rangeData = {};
        this.currentPosition = null;
        this.currentQuestionType = null;
        
        this.init();
    }

    async init() {
        try {
            await this.loadRangeData();
            this.generateRandomQuestion();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize quiz:', error);
            this.showError('Failed to load quiz data: ' + error.message);
        }
    }

    async loadRangeData() {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const forcedType = urlParams.get('type'); // 'percentage' or 'action'
        const forcedRanges = urlParams.get('ranges'); // comma-separated list like 'UTG,BTN'
        
        // Set forced type if specified
        if (forcedType && ['percentage', 'action'].includes(forcedType)) {
            this.forcedType = forcedType;
        }
        
        // Determine which ranges to load
        let filesToLoad = [
            { path: './ranges/UTG/UTG_open.json', position: 'UTG' },
            { path: './ranges/BTN/BTN_open.json', position: 'BTN' }
        ];
        
        if (forcedRanges) {
            const requestedRanges = forcedRanges.split(',').map(r => r.trim().toUpperCase());
            filesToLoad = filesToLoad.filter(file => 
                requestedRanges.includes(file.position)
            );
        }
        
        let loadedFiles = 0;
        
        for (const file of filesToLoad) {
            try {
                const response = await fetch(file.path);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Transform the data to match our expected format
                    const overrides = data.overrides && data.overrides[0] ? data.overrides[0] : {};
                    this.rangeData[file.position] = {
                        raise_percentage: data.raise || 20,
                        hands: Object.keys(overrides).filter(hand => 
                            overrides[hand] === 'raise'
                        )
                    };
                    
                    loadedFiles++;
                }
            } catch (error) {
                // Silent fail for missing files
            }
        }
        
        if (loadedFiles === 0) {
            throw new Error('No opening range data files could be loaded');
        }
    }

    generateRandomQuestion() {
        // Get all available positions
        const availablePositions = Object.keys(this.rangeData);
        if (availablePositions.length === 0) {
            this.showError('No range data available for questions');
            return;
        }
        
        // Pick a random position
        const position = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        const data = this.rangeData[position];
        
        // Track current position and question type
        this.currentPosition = position;
        
        // Decide question type (forced or random)
        let questionType = this.forcedType || (Math.random() < 0.5 ? 'percentage' : 'action');
        this.currentQuestionType = questionType;
        
        switch (questionType) {
            case 'percentage':
                this.currentQuestion = {
                    type: 'percentage',
                    question: `What percentage of hands should you raise with from ${position}?`,
                    correctAnswer: `${data.raise_percentage}%`,
                    options: this.generatePercentageOptions(data.raise_percentage),
                    context: 'Deep stack cash game (100BB+)'
                };
                break;
                
            case 'action':
                if (data.hands.length > 0) {
                    // Pick a random hand from the available hands
                    const randomIndex = Math.floor(Math.random() * data.hands.length);
                    const hand = data.hands[randomIndex];
                    this.currentQuestion = {
                        type: 'action',
                        question: `You are at ${position} with ${hand}. What would you do?`,
                        correctAnswer: 'Raise',
                        options: ['Raise', 'Check', 'Fold'],
                        context: 'Deep stack cash game (100BB+)'
                    };
                } else {
                    // No hands available, fallback to default
                    questionType = 'default';
                }
                break;
                
            default:
                // Fallback to percentage question
                this.currentQuestion = {
                    type: 'percentage',
                    question: `What percentage of hands should you raise with from ${position}?`,
                    correctAnswer: `${data.raise_percentage}%`,
                    options: this.generatePercentageOptions(data.raise_percentage),
                    context: 'Deep stack cash game (100BB+)'
                };
                break;
        }
        
        this.displayQuestion();
    }

    generatePercentageOptions(correctPercentage) {
        const options = [correctPercentage];
        
        // Generate 3 wrong options
        while (options.length < 4) {
            const wrongOption = Math.round(correctPercentage + (Math.random() - 0.5) * 20);
            if (wrongOption > 0 && wrongOption <= 100 && !options.includes(wrongOption)) {
                options.push(wrongOption);
            }
        }
        
        return this.shuffleArray(options).map(p => `${p}%`);
    }

    formatAction(action) {
        const actionMap = {
            'open': 'raise with',
            'vs_limp': 'raise vs limp with',
            'vs_SB': 'raise vs SB with',
            'vs_BB': 'raise vs BB with',
            'vs_UTG': 'raise vs UTG with',
            'vs_UTG+1': 'raise vs UTG+1 with',
            'vs_UTG+2': 'raise vs UTG+2 with',
            'vs_HJ': 'raise vs HJ with',
            'vs_LJ': 'raise vs LJ with',
            'vs_CO': 'raise vs CO with',
            'vs_BTN': 'raise vs BTN with',
            'vs_MP': 'raise vs MP with'
        };
        return actionMap[action] || action;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    displayQuestion() {
        if (!this.currentQuestion) return;
        
        document.getElementById('question-progress').textContent = 'Random Question';
        document.getElementById('question-text').textContent = this.currentQuestion.question;
        
        // Update options
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach((btn, index) => {
            btn.querySelector('.option-text').textContent = this.currentQuestion.options[index];
            btn.classList.remove('selected', 'correct', 'incorrect');
            btn.disabled = false;
        });
        
        // Reset state
        this.selectedAnswer = null;
        document.getElementById('check-btn').disabled = true;
        document.getElementById('feedback').classList.add('hidden');
        document.getElementById('suggestions').classList.add('hidden');
    }

    selectAnswer(optionIndex) {
        // Remove previous selection
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Select new answer
        const selectedBtn = document.querySelector(`[data-option="${optionIndex}"]`);
        selectedBtn.classList.add('selected');
        
        this.selectedAnswer = optionIndex;
        document.getElementById('check-btn').disabled = false;
    }

    checkAnswer() {
        if (this.selectedAnswer === null) return;
        
        const selectedAnswer = this.currentQuestion.options[this.selectedAnswer];
        const isCorrect = selectedAnswer === this.currentQuestion.correctAnswer;
        
        // Show feedback
        this.showFeedback(isCorrect);
    }

    showFeedback(isCorrect) {
        const optionButtons = document.querySelectorAll('.option-btn');
        const selectedBtn = optionButtons[this.selectedAnswer];
        
        if (isCorrect) {
            selectedBtn.classList.add('correct');
            document.getElementById('feedback-text').textContent = 'Correct! Well done.';
        } else {
            selectedBtn.classList.add('incorrect');
            // Highlight correct answer
            optionButtons.forEach((btn, index) => {
                if (this.currentQuestion.options[index] === this.currentQuestion.correctAnswer) {
                    btn.classList.add('correct');
                }
            });
            document.getElementById('feedback-text').textContent = 'Incorrect. The correct answer is highlighted.';
        }
        
        // Disable all buttons
        optionButtons.forEach(btn => btn.disabled = true);
        document.getElementById('check-btn').disabled = true;
        
        // Show feedback
        document.getElementById('feedback').classList.remove('hidden');
        
        // Show suggestions
        this.showSuggestions();
    }

    newQuestion() {
        this.generateRandomQuestion();
    }

    setupEventListeners() {
        // Option buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectAnswer(parseInt(btn.dataset.option));
            });
        });
        
        // Check button
        document.getElementById('check-btn').addEventListener('click', () => {
            this.checkAnswer();
        });
        
        // New question button
        document.getElementById('new-question-btn').addEventListener('click', () => {
            this.newQuestion();
        });
        
        // Next question button
        document.getElementById('next-question-btn').addEventListener('click', () => {
            this.newQuestion();
        });
    }

    showSuggestions() {
        const suggestionsDiv = document.getElementById('suggestions');
        const sameRangeLink = document.getElementById('same-range-link');
        const sameTypeLink = document.getElementById('same-type-link');
        
        // Generate same range link
        if (this.currentPosition) {
            const sameRangeUrl = `quiz.html?ranges=${this.currentPosition}`;
            sameRangeLink.href = sameRangeUrl;
        }
        
        // Generate same type link
        if (this.currentQuestionType) {
            const sameTypeUrl = `quiz.html?type=${this.currentQuestionType}`;
            sameTypeLink.href = sameTypeUrl;
        }
        
        // Show suggestions
        suggestionsDiv.classList.remove('hidden');
    }
    
    showError(message) {
        console.error(message);
        
        // Show a fallback question if loading fails
        this.currentQuestion = {
            type: 'fallback',
            question: 'What percentage of hands should you raise with from the button?',
            correctAnswer: '25%',
            options: ['15%', '25%', '35%', '45%'],
            context: 'Deep stack cash game (100BB+)'
        };
        
        this.displayQuestion();
        
        // Show error in console but don't break the quiz
        console.warn('Using fallback question due to:', message);
    }
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SimpleQuiz();
});