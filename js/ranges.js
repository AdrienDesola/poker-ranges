class RangeManager {
    constructor() {
        this.hands = [];
        this.currentRange = null;
        this.handRankings = [];
    }

    async loadHandRankings() {
        try {
            const response = await fetch('data/hands.json');
            this.handRankings = await response.json();
        } catch (error) {
            console.error('Error loading hand rankings:', error);
        }
    }

    async loadRange(position, action) {
        try {
            const response = await fetch(`ranges/${position}/${position}_${action}.json`);
            if (!response.ok) {
                throw new Error(`Range not found: ${position}_${action}`);
            }
            this.currentRange = await response.json();
            return this.currentRange;
        } catch (error) {
            console.error('Error loading range:', error);
            return null;
        }
    }

    calculateRangeHands(percentage) {
        if (!this.handRankings.length) return [];
        
        // Filter hands by rank (0-169 scale)
        const maxRank = Math.round((percentage / 100) * 169);
        const handsInRange = this.handRankings
            .filter(hand => hand.rank <= maxRank)
            .map(hand => hand.name);
        
        return handsInRange;
    }

    getHandType(handName) {
        if (handName[0] === handName[1]) return 'pair';
        if (handName.endsWith('s')) return 'suited';
        return 'offsuit';
    }

    isHandInRange(hand, rangeHands) {
        return rangeHands.includes(hand);
    }
}

// Global instance
window.rangeManager = new RangeManager(); 