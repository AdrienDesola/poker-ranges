class PokerRangeTrainer {
    constructor() {
        this.currentPosition = 'BTN';
        this.currentAction = 'open';
        this.selectedHand = null;
        this.rangeGrid = document.getElementById('rangeGrid');
        this.handDetails = document.querySelector('.selected-hand');
        
        this.init();
    }

    async init() {
        await window.rangeManager.loadHandRankings();
        await this.discoverPositionsAndActions();
        this.setupEventListeners();
        this.loadAndDisplayRange();
    }

    async discoverPositionsAndActions() {
        try {
            // Discover positions by scanning the ranges directory
            const positions = await this.discoverPositions();
            this.generatePositionButtons(positions);
            
            // Set default position (first one or BTN if available)
            this.currentPosition = positions.includes('BTN') ? 'BTN' : positions[0];
            this.setActivePosition(document.querySelector(`[data-position="${this.currentPosition}"]`));
            
            // Discover actions for the selected position
            const actions = await this.discoverActions(this.currentPosition);
            this.generateActionButtons(actions);
            
            // Set default action (first one or 'open' if available)
            this.currentAction = actions.includes('open') ? 'open' : actions[0];
            this.setActiveAction(document.querySelector(`[data-action="${this.currentAction}"]`));
            
        } catch (error) {
            console.error('Error discovering positions and actions:', error);
            // Fallback to hardcoded defaults
            this.currentPosition = 'BTN';
            this.currentAction = 'open';
        }
    }

    async discoverPositions() {
        // For now, we'll use a simple approach by trying to fetch a list
        // In a real implementation, you might want to use a server-side endpoint
        // For GitHub Pages, we'll use a predefined list based on the directory structure
        const knownPositions = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'];
        const availablePositions = [];
        
        // Test each position by trying to load a range file
        for (const position of knownPositions) {
            try {
                const response = await fetch(`ranges/${position}/${position}_open.json`);
                if (response.ok) {
                    availablePositions.push(position);
                }
            } catch (error) {
                // Position not available
            }
        }
        
        return availablePositions;
    }

    async discoverActions(position) {
        const knownActions = ['open', 'vs_3bet', 'vs_4bet'];
        const availableActions = [];
        
        // Test each action by trying to load a range file
        for (const action of knownActions) {
            try {
                const response = await fetch(`ranges/${position}/${position}_${action}.json`);
                if (response.ok) {
                    availableActions.push(action);
                }
            } catch (error) {
                // Action not available
            }
        }
        
        return availableActions;
    }

    generatePositionButtons(positions) {
        const container = document.getElementById('positionButtons');
        container.innerHTML = '';
        
        positions.forEach((position, index) => {
            const button = document.createElement('button');
            button.className = 'position-btn';
            button.dataset.position = position;
            button.textContent = position;
            
            // Make first position active by default
            if (index === 0) {
                button.classList.add('active');
            }
            
            container.appendChild(button);
        });
    }

    generateActionButtons(actions) {
        const container = document.getElementById('actionButtons');
        container.innerHTML = '';
        
        actions.forEach((action, index) => {
            const button = document.createElement('button');
            button.className = 'action-btn';
            button.dataset.action = action;
            button.textContent = this.formatActionName(action);
            
            // Make first action active by default
            if (index === 0) {
                button.classList.add('active');
            }
            
            container.appendChild(button);
        });
    }

    formatActionName(action) {
        const actionNames = {
            'open': 'Open',
            'vs_3bet': 'vs 3-bet',
            'vs_4bet': 'vs 4-bet'
        };
        return actionNames[action] || action;
    }

    setupEventListeners() {
        // Use event delegation for dynamically generated buttons
        document.getElementById('positionButtons').addEventListener('click', (e) => {
            if (e.target.classList.contains('position-btn')) {
                this.setActivePosition(e.target);
                this.currentPosition = e.target.dataset.position;
                this.updateActionsForPosition();
                this.loadAndDisplayRange();
            }
        });

        document.getElementById('actionButtons').addEventListener('click', (e) => {
            if (e.target.classList.contains('action-btn')) {
                this.setActiveAction(e.target);
                this.currentAction = e.target.dataset.action;
                this.loadAndDisplayRange();
            }
        });
    }

    async updateActionsForPosition() {
        const actions = await this.discoverActions(this.currentPosition);
        this.generateActionButtons(actions);
        
        // Set default action for the new position
        this.currentAction = actions.includes('open') ? 'open' : actions[0];
        this.setActiveAction(document.querySelector(`[data-action="${this.currentAction}"]`));
    }

    setActivePosition(activeBtn) {
        document.querySelectorAll('.position-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    setActiveAction(activeBtn) {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    async loadAndDisplayRange() {
        const range = await window.rangeManager.loadRange(this.currentPosition, this.currentAction);
        if (range) {
            this.updateRangeInfo(range);
            this.displayRangeGrid(range);
        } else {
            // Show neutral grid when range file is missing
            this.updateRangeInfoForMissing();
            this.displayNeutralGrid();
        }
    }

    updateRangeInfo(range) {
        const percentageEl = document.querySelector('.percentage');
        const handCountEl = document.querySelector('.hand-count');
        const descriptionEl = document.querySelector('.range-description');

        if (range.callPercentage) {
            // Range has both raise and call percentages
            const ranges = window.rangeManager.calculateCallRangeHands(range.percentage, range.callPercentage);
            const totalHands = ranges.raise.length + ranges.call.length;
            
            percentageEl.textContent = `${range.percentage}% raise, ${range.callPercentage}% call`;
            handCountEl.textContent = `(${totalHands} hands)`;
            descriptionEl.textContent = range.description;
        } else {
            // Range has only raise percentage
            const handsInRange = window.rangeManager.calculateRangeHands(range.percentage);
            
            percentageEl.textContent = `${range.percentage}%`;
            handCountEl.textContent = `(${handsInRange.length} hands)`;
            descriptionEl.textContent = range.description;
        }
    }

    updateRangeInfoForMissing() {
        const percentageEl = document.querySelector('.percentage');
        const handCountEl = document.querySelector('.hand-count');
        const descriptionEl = document.querySelector('.range-description');
        
        percentageEl.textContent = 'No range';
        handCountEl.textContent = '(0 hands)';
        descriptionEl.textContent = `${this.currentPosition} ${this.currentAction} range not found`;
    }

    displayRangeGrid(range) {
        this.rangeGrid.innerHTML = '';
        
        let handsInRange, callHands;
        
        if (range.callPercentage) {
            // Range has both raise and call percentages
            const ranges = window.rangeManager.calculateCallRangeHands(range.percentage, range.callPercentage);
            handsInRange = ranges.raise;
            callHands = ranges.call;
        } else {
            // Range has only raise percentage
            handsInRange = window.rangeManager.calculateRangeHands(range.percentage);
            callHands = [];
        }
        
        const allHands = this.generateAllHands();
        
        allHands.forEach(hand => {
            const cell = document.createElement('div');
            cell.className = 'hand-cell';
            cell.textContent = hand;
            cell.dataset.hand = hand;
            
            // Add hand type class
            const handType = window.rangeManager.getHandType(hand);
            cell.classList.add(handType);
            
            // Add action class based on whether hand is in range
            if (window.rangeManager.isHandInRange(hand, handsInRange)) {
                cell.classList.add('raise');
            } else if (window.rangeManager.isHandInRange(hand, callHands)) {
                cell.classList.add('call');
            } else {
                cell.classList.add('fold');
            }
            
            // Add click handler
            cell.addEventListener('click', () => {
                this.selectHand(hand);
            });
            
            this.rangeGrid.appendChild(cell);
        });
    }

    displayNeutralGrid() {
        this.rangeGrid.innerHTML = '';
        
        const allHands = this.generateAllHands();
        
        allHands.forEach(hand => {
            const cell = document.createElement('div');
            cell.className = 'hand-cell neutral';
            cell.textContent = hand;
            cell.dataset.hand = hand;
            
            // Add hand type class
            const handType = window.rangeManager.getHandType(hand);
            cell.classList.add(handType);
            
            // Add click handler
            cell.addEventListener('click', () => {
                this.selectHand(hand);
            });
            
            this.rangeGrid.appendChild(cell);
        });
    }

    generateAllHands() {
        // Generate hands in the exact order for 13x13 grid
        const hands = [];
        const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        
        for (let i = 0; i < ranks.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                if (i === j) {
                    // Pairs on diagonal
                    hands.push(ranks[i] + ranks[j]);
                } else if (i < j) {
                    // Suited hands in upper triangle
                    hands.push(ranks[i] + ranks[j] + 's');
                } else {
                    // Offsuit hands in lower triangle
                    hands.push(ranks[j] + ranks[i] + 'o');
                }
            }
        }
        
        return hands;
    }

    selectHand(hand) {
        // Remove previous selection
        document.querySelectorAll('.hand-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        // Add selection to clicked hand
        const cell = document.querySelector(`[data-hand="${hand}"]`);
        if (cell) {
            cell.classList.add('selected');
        }
        
        // Update hand details
        this.selectedHand = hand;
        this.updateHandDetails(hand);
    }

    updateHandDetails(hand) {
        const handType = window.rangeManager.getHandType(hand);
        let details = '';
        
        if (handType === 'pair') {
            details = `${hand[0]}${hand[1]} - Pair`;
        } else if (handType === 'suited') {
            details = `${hand[0]}${hand[1]}s - ${hand[0]}${hand[1]} suited`;
        } else {
            details = `${hand[0]}${hand[1]}o - ${hand[0]}${hand[1]} offsuit`;
        }
        
        // Add rank information
        const handData = window.rangeManager.handRankings.find(h => h.name === hand);
        if (handData) {
            details += ` (Rank: ${handData.rank + 1}/${window.rangeManager.handRankings.length})`;
        }
        
        this.handDetails.textContent = details;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PokerRangeTrainer();
}); 