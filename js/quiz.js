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
            { path: './ranges/UTG+1/UTG+1_open.json', position: 'UTG+1' },
            { path: './ranges/UTG+2/UTG+2_open.json', position: 'UTG+2' },
            { path: './ranges/LJ/LJ_open.json', position: 'LJ' },
            { path: './ranges/HJ/HJ_open.json', position: 'HJ' },
            { path: './ranges/CO/CO_open.json', position: 'CO' },
            { path: './ranges/BTN/BTN_open.json', position: 'BTN' },
            { path: './ranges/SB/SB_open.json', position: 'SB' },
            { path: './ranges/BB/BB_open.json', position: 'BB' }
        ];
        
        if (forcedRanges) {
            const requestedRanges = forcedRanges.split(',').map(r => r.trim().toUpperCase());
            filesToLoad = filesToLoad.filter(file => 
                requestedRanges.includes(file.position)
            );
        }
        
        let loadedFiles = 0;
        console.log(`[Quiz] Starting to load ${filesToLoad.length} range files...`);
        
        for (const file of filesToLoad) {
            try {
                console.log(`[Quiz] Loading file: ${file.path}`);
                const response = await fetch(file.path);
                console.log(`[Quiz] Response status for ${file.path}: ${response.status} ${response.statusText}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`[Quiz] Successfully loaded ${file.position}:`, data);
                    
                    // Transform the data to match our expected format
                    const overrides = data.overrides && data.overrides[0] ? data.overrides[0] : {};
                    this.rangeData[file.position] = {
                        raise_percentage: data.raise || 20,
                        hands: Object.keys(overrides).filter(hand => 
                            overrides[hand] === 'raise'
                        )
                    };
                    
                    // If no hands are specified in overrides, generate hands based on percentage
                    if (this.rangeData[file.position].hands.length === 0) {
                        this.rangeData[file.position].hands = this.generateHandsFromPercentage(data.raise || 20);
                    }
                    
                    console.log(`[Quiz] Processed ${file.position}: raise=${data.raise}%, hands=${this.rangeData[file.position].hands.length}`);
                    loadedFiles++;
                } else {
                    console.warn(`[Quiz] Failed to load ${file.path}: HTTP ${response.status}`);
                }
            } catch (error) {
                console.error(`[Quiz] Error loading ${file.path}:`, error);
            }
        }
        
        console.log(`[Quiz] Loaded ${loadedFiles}/${filesToLoad.length} files successfully`);
        console.log(`[Quiz] Available positions:`, Object.keys(this.rangeData));
        
        if (loadedFiles === 0) {
            throw new Error('No opening range data files could be loaded');
        }
    }

    generateRandomQuestion() {
        // Get all available positions
        const availablePositions = Object.keys(this.rangeData);
        console.log(`[Quiz] Generating question. Available positions:`, availablePositions);
        
        if (availablePositions.length === 0) {
            console.error(`[Quiz] No range data available for questions`);
            this.showError('No range data available for questions');
            return;
        }
        
        // Pick a random position
        const position = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        const data = this.rangeData[position];
        console.log(`[Quiz] Selected position: ${position}, data:`, data);
        
        // Track current position and question type
        this.currentPosition = position;
        
        // Decide question type (forced or random)
        let questionType = this.forcedType || (Math.random() < 0.5 ? 'percentage' : 'action');
        this.currentQuestionType = questionType;
        console.log(`[Quiz] Question type: ${questionType}`);
        
        switch (questionType) {
            case 'percentage':
                this.currentQuestion = {
                    type: 'percentage',
                    question: `What percentage of hands should you raise with from ${position}?`,
                    correctAnswer: `${data.raise_percentage}%`,
                    options: this.generatePercentageOptions(data.raise_percentage),
                    context: 'Deep stack cash game (100BB+)'
                };
                console.log(`[Quiz] Generated percentage question for ${position}: ${data.raise_percentage}%`);
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
                    console.log(`[Quiz] Generated action question for ${position} with ${hand}`);
                } else {
                    console.warn(`[Quiz] No hands available for action question at ${position}, falling back to percentage`);
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

    generateHandsFromPercentage(percentage) {
        // Generate a list of hands based on the raise percentage
        // This is a simplified approach - in reality, you'd want to use the actual hand rankings
        const allHands = [
            'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
            'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
            'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o',
            'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
            'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'K7o', 'K6o', 'K5o', 'K4o', 'K3o', 'K2o',
            'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s',
            'QJo', 'QTo', 'Q9o', 'Q8o', 'Q7o', 'Q6o', 'Q5o', 'Q4o', 'Q3o', 'Q2o',
            'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s',
            'JTo', 'J9o', 'J8o', 'J7o', 'J6o', 'J5o', 'J4o', 'J3o', 'J2o',
            'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s',
            'T9o', 'T8o', 'T7o', 'T6o', 'T5o', 'T4o', 'T3o', 'T2o',
            '98s', '97s', '96s', '95s', '94s', '93s', '92s',
            '98o', '97o', '96o', '95o', '94o', '93o', '92o',
            '87s', '86s', '85s', '84s', '83s', '82s',
            '87o', '86o', '85o', '84o', '83o', '82o',
            '76s', '75s', '74s', '73s', '72s',
            '76o', '75o', '74o', '73o', '72o',
            '65s', '64s', '63s', '62s',
            '65o', '64o', '63o', '62o',
            '54s', '53s', '52s',
            '54o', '53o', '52o',
            '43s', '42s',
            '43o', '42o',
            '32s', '32o'
        ];
        
        // Calculate how many hands to include based on percentage
        const numHands = Math.floor((percentage / 100) * allHands.length);
        
        // Take the top hands (assuming they're roughly in order of strength)
        const selectedHands = allHands.slice(0, numHands);
        
        console.log(`[Quiz] Generated ${selectedHands.length} hands for ${percentage}% range`);
        return selectedHands;
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
        if (this.selectedAnswer === null) {
            console.warn(`[Quiz] No answer selected`);
            return;
        }
        
        const selectedAnswer = this.currentQuestion.options[this.selectedAnswer];
        const isCorrect = selectedAnswer === this.currentQuestion.correctAnswer;
        
        console.log(`[Quiz] Answer checked: selected="${selectedAnswer}", correct="${this.currentQuestion.correctAnswer}", isCorrect=${isCorrect}`);
        
        // Show feedback
        this.showFeedback(isCorrect);
    }

    showFeedback(isCorrect) {
        const optionButtons = document.querySelectorAll('.option-btn');
        const selectedBtn = optionButtons[this.selectedAnswer];
        
        console.log(`[Quiz] Showing feedback: isCorrect=${isCorrect}`);
        
        if (isCorrect) {
            selectedBtn.classList.add('correct');
            document.getElementById('feedback-text').textContent = 'Correct! Well done.';
            console.log(`[Quiz] User answered correctly`);
        } else {
            selectedBtn.classList.add('incorrect');
            // Highlight correct answer
            optionButtons.forEach((btn, index) => {
                if (this.currentQuestion.options[index] === this.currentQuestion.correctAnswer) {
                    btn.classList.add('correct');
                }
            });
            document.getElementById('feedback-text').textContent = 'Incorrect. The correct answer is highlighted.';
            console.log(`[Quiz] User answered incorrectly. Correct answer was: ${this.currentQuestion.correctAnswer}`);
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
        console.log(`[Quiz] Generating new question...`);
        this.generateRandomQuestion();
    }

    setupEventListeners() {
        console.log(`[Quiz] Setting up event listeners...`);
        
        // Option buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                console.log(`[Quiz] Option button clicked: ${btn.dataset.option}`);
                this.selectAnswer(parseInt(btn.dataset.option));
            });
        });
        
        // Check button
        document.getElementById('check-btn').addEventListener('click', () => {
            console.log(`[Quiz] Check button clicked`);
            this.checkAnswer();
        });
        
        // New question button
        document.getElementById('new-question-btn').addEventListener('click', () => {
            console.log(`[Quiz] New question button clicked`);
            this.newQuestion();
        });
        
        // Next question button
        document.getElementById('next-question-btn').addEventListener('click', () => {
            console.log(`[Quiz] Next question button clicked`);
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
        console.error(`[Quiz] Error: ${message}`);
        
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