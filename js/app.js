// Poker Range Trainer - Main Application
class PokerRangeTrainer {
    constructor() {
        this.hands = [];
        this.positions = ['UTG', 'UTG+1', 'UTG+2', 'HJ', 'LJ', 'CO', 'BTN', 'SB', 'BB'];
        this.actions = ['open', 'vs_3bet', 'vs_limp'];
        this.currentPosition = null;
        this.currentAction = null;
        this.currentRange = null;
        this.selectedHand = null;
        
        this.init();
    }

    async init() {
        try {
            await this.loadHands();
            this.setupEventListeners();
            await this.loadRangeData();
            this.renderPositionButtons();
            this.handleURLNavigation();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load application data');
        }
    }

    async loadHands() {
        try {
            const response = await fetch('data/hands.json');
            this.hands = await response.json();
        } catch (error) {
            console.error('Failed to load hands:', error);
            throw error;
        }
    }

    async loadRangeData() {
        this.availableRanges = {};
        
        for (const position of this.positions) {
            this.availableRanges[position] = {};
            
            for (const action of this.actions) {
                try {
                    const response = await fetch(`ranges/${position}/${position}_${action}.json`);
                    if (response.ok) {
                        const rangeData = await response.json();
                        this.availableRanges[position][action] = rangeData;
                    }
                } catch (error) {
                    // Range file doesn't exist, skip it
                    console.log(`No range data for ${position} ${action}`);
                }
            }
        }
    }

    renderPositionButtons() {
        const positionContainer = document.querySelector('.position-buttons');
        positionContainer.innerHTML = '';
        
        this.positions.forEach(position => {
            const hasRanges = Object.keys(this.availableRanges[position] || {}).length > 0;
            
            if (hasRanges) {
                const button = document.createElement('button');
                button.textContent = position;
                button.setAttribute('data-position', position);
                button.addEventListener('click', () => this.selectPosition(position));
                
                positionContainer.appendChild(button);
            }
        });
    }

    selectPosition(position) {
        this.currentPosition = position;
        this.currentAction = null;
        this.currentRange = null;
        
        // Update active state
        document.querySelectorAll('.position-buttons button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-position="${position}"]`).classList.add('active');
        
        this.renderActionButtons();
        this.updateURL();
    }

    renderActionButtons() {
        const actionContainer = document.querySelector('.action-buttons');
        actionContainer.innerHTML = '';
        
        const availableActions = Object.keys(this.availableRanges[this.currentPosition] || {});
        
        availableActions.forEach(action => {
            const button = document.createElement('button');
            button.textContent = this.formatActionName(action);
            button.setAttribute('data-action', action);
            button.addEventListener('click', () => this.selectAction(action));
            
            actionContainer.appendChild(button);
        });
        
        // Auto-select first available action
        if (availableActions.length > 0) {
            this.selectAction(availableActions[0]);
        }
    }

    formatActionName(action) {
        const actionMap = {
            'open': 'Open',
            'vs_3bet': 'vs 3-bet',
            'vs_limp': 'vs Limp'
        };
        return actionMap[action] || action;
    }

    selectAction(action) {
        this.currentAction = action;
        this.currentRange = this.availableRanges[this.currentPosition][action];
        
        // Update active state
        document.querySelectorAll('.action-buttons button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-action="${action}"]`).classList.add('active');
        
        this.renderHandGrid();
        this.updateRangeInfo();
        this.updateURL();
    }

    renderHandGrid() {
        const gridContainer = document.querySelector('.hand-grid');
        gridContainer.innerHTML = '';
        
        // Create 13x13 grid
        const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        
        // Add rank labels
        const rankLabels = document.createElement('div');
        rankLabels.className = 'rank-labels';
        
        ranks.forEach(rank => {
            const label = document.createElement('div');
            label.textContent = rank;
            label.className = 'rank-label';
            rankLabels.appendChild(label);
        });
        
        gridContainer.appendChild(rankLabels);
        
        // Add column labels
        const colLabels = document.createElement('div');
        colLabels.className = 'col-labels';
        
        ranks.forEach(rank => {
            const label = document.createElement('div');
            label.textContent = rank;
            label.className = 'col-label';
            colLabels.appendChild(label);
        });
        
        gridContainer.appendChild(colLabels);
        
        // Create hand cells in a 13x13 grid
        ranks.forEach((rowRank, rowIndex) => {
            ranks.forEach((colRank, colIndex) => {
                const cell = document.createElement('button');
                cell.className = 'hand-cell';
                
                // Determine hand name based on poker grid convention
                let handName;
                if (rowIndex === colIndex) {
                    // Pair (diagonal)
                    handName = rowRank + rowRank;
                } else if (rowIndex < colIndex) {
                    // Suited (upper triangle)
                    handName = rowRank + colRank + 's';
                } else {
                    // Offsuit (lower triangle)
                    handName = colRank + rowRank + 'o';
                }
                
                cell.textContent = handName;
                cell.setAttribute('data-hand', handName);
                cell.setAttribute('aria-label', `Hand: ${handName}`);
                
                // Set action class based on range
                if (this.currentRange) {
                    const action = this.getHandAction(handName);
                    cell.classList.add(action);
                } else {
                    cell.classList.add('neutral');
                }
                
                cell.addEventListener('click', () => this.selectHand(handName));
                cell.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.selectHand(handName);
                    }
                });
                
                gridContainer.appendChild(cell);
            });
        });
    }

    getHandAction(handName) {
        if (!this.currentRange) return 'neutral';
        
        const handIndex = this.hands.findIndex(hand => hand.name === handName);
        if (handIndex === -1) return 'neutral';
        
        const totalHands = this.hands.length;
        const raisePercentage = this.currentRange.raise || 0;
        const callPercentage = this.currentRange.call || 0;
        
        const raiseCount = Math.floor((raisePercentage / 100) * totalHands);
        const callCount = Math.floor((callPercentage / 100) * totalHands);
        
        if (handIndex < raiseCount) {
            return 'raise';
        } else if (handIndex < raiseCount + callCount) {
            return 'call';
        } else {
            return 'fold';
        }
    }

    selectHand(handName) {
        this.selectedHand = handName;
        this.updateHandDetails();
        
        // Update visual selection
        document.querySelectorAll('.hand-cell').forEach(cell => {
            cell.style.border = 'none';
        });
        
        const selectedCell = document.querySelector(`[data-hand="${handName}"]`);
        if (selectedCell) {
            selectedCell.style.border = '3px solid #667eea';
        }
    }

    updateHandDetails() {
        const handInfo = document.querySelector('.hand-info');
        const hand = this.hands.find(h => h.name === this.selectedHand);
        
        if (hand) {
            const handType = this.getHandType(this.selectedHand);
            const rank = hand.rank + 1;
            
            handInfo.innerHTML = `
                <p class="hand-type">${this.selectedHand} - ${handType}</p>
                <p class="hand-rank">Rank: ${rank}/169</p>
                <p>Strength: ${this.getStrengthDescription(rank)}</p>
            `;
        } else {
            handInfo.innerHTML = '<p>Hand information not available</p>';
        }
    }

    getHandType(handName) {
        if (handName.length === 2) {
            return 'Pair';
        } else if (handName.endsWith('s')) {
            return 'Suited';
        } else {
            return 'Offsuit';
        }
    }

    getStrengthDescription(rank) {
        if (rank <= 10) return 'Very Strong';
        if (rank <= 30) return 'Strong';
        if (rank <= 60) return 'Medium';
        if (rank <= 100) return 'Weak';
        return 'Very Weak';
    }

    updateRangeInfo() {
        const descriptionEl = document.querySelector('.range-description');
        const percentageEl = document.querySelector('.range-percentage');
        const countEl = document.querySelector('.range-count');
        
        if (this.currentRange) {
            descriptionEl.textContent = this.currentRange.description;
            
            let percentageText = `Raise: ${this.currentRange.raise}%`;
            if (this.currentRange.call) {
                percentageText += ` | Call: ${this.currentRange.call}%`;
            }
            percentageEl.textContent = percentageText;
            
            const totalHands = this.hands.length;
            const raiseCount = Math.floor((this.currentRange.raise / 100) * totalHands);
            const callCount = this.currentRange.call ? Math.floor((this.currentRange.call / 100) * totalHands) : 0;
            
            countEl.textContent = `Hands: ${raiseCount} raise, ${callCount} call, ${totalHands - raiseCount - callCount} fold`;
        } else {
            descriptionEl.textContent = 'No range data available for this position and action';
            percentageEl.textContent = '';
            countEl.textContent = '';
        }
    }

    updateURL() {
        if (this.currentPosition && this.currentAction) {
            const url = new URL(window.location);
            url.searchParams.set('position', this.currentPosition);
            url.searchParams.set('action', this.currentAction);
            window.history.pushState({}, '', url);
        }
    }

    handleURLNavigation() {
        const urlParams = new URLSearchParams(window.location.search);
        const position = urlParams.get('position');
        const action = urlParams.get('action');
        
        if (position && this.availableRanges[position]) {
            this.selectPosition(position);
            
            if (action && this.availableRanges[position][action]) {
                this.selectAction(action);
            }
        } else {
            // No URL parameters, select default position (preferably BTN)
            const btnPosition = this.positions.find(pos => this.availableRanges[pos]);
            const firstPosition = this.positions.find(pos => this.availableRanges[pos]);
            const defaultPosition = btnPosition || firstPosition;
            
            if (defaultPosition) {
                this.selectPosition(defaultPosition);
            }
        }
    }

    setupEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleURLNavigation();
        });
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearHandSelection();
            }
        });
    }

    clearHandSelection() {
        this.selectedHand = null;
        document.querySelectorAll('.hand-cell').forEach(cell => {
            cell.style.border = 'none';
        });
        
        const handInfo = document.querySelector('.hand-info');
        handInfo.innerHTML = '<p>Click on any hand to see detailed information</p>';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PokerRangeTrainer();
}); 