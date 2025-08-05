# Poker Range Trainer - Project Plan

## Overview
A web-based poker range trainer that helps players practice and memorize hand ranges for different positions and situations. The application will be minimal, fast, and deployable on GitHub Pages.

## Core Features (Phase 1 - Range Presentation)
1. **Range Visualization** - Display hand ranges in a grid format (similar to PokerStars)
2. **Position Selection** - Choose from different positions (UTG, MP, CO, BTN, SB, BB)
3. **Action Selection** - Different actions (fold, call, raise, 3-bet, etc.)
4. **Easy Range Management** - Simple JSON files organized by position for easy addition of new ranges

## Future Features (Roadmap)
5. **Range Practice** - Quiz mode to test knowledge of ranges
6. **Range Builder** - Custom range creation and editing
7. **Statistics** - Track progress and accuracy

## Technical Requirements
- **Static Site** - Must work on GitHub Pages (no server-side code)
- **Vanilla JavaScript** - No frameworks to keep it minimal
- **CSS Grid/Flexbox** - For responsive range display
- **Local Storage** - Save user progress and custom ranges
- **Mobile Responsive** - Work on phones and tablets

## Project Structure
```
html-ranges/
├── index.html              # Main application page
├── css/
│   ├── style.css          # Main stylesheet
│   └── ranges.css         # Range grid specific styles
├── js/
│   ├── app.js             # Main application logic
│   ├── ranges.js          # Range data and logic
│   └── storage.js         # Local storage utilities
├── data/
│   └── hands.json         # All 169 hands in ranking order
├── ranges/                # Range data organized by position
│   ├── UTG/
│   │   ├── UTG_open.json
│   │   └── UTG_vs_3bet.json
│   ├── MP/
│   │   ├── MP_open.json
│   │   └── MP_vs_3bet.json
│   ├── CO/
│   │   ├── CO_open.json
│   │   └── CO_vs_3bet.json
│   ├── BTN/
│   │   ├── BTN_open.json
│   │   ├── BTN_vs_BB.json
│   │   └── BTN_vs_3bet.json
│   ├── SB/
│   │   ├── SB_open.json
│   │   ├── SB_vs_BB.json
│   │   └── SB_vs_3bet.json
│   └── BB/
│       ├── BB_vs_UTG.json
│       ├── BB_vs_MP.json
│       ├── BB_vs_CO.json
│       ├── BB_vs_BTN.json
│       └── BB_vs_SB.json
├── assets/
│   └── icons/             # UI icons (if needed)
├── README.md              # Project documentation
└── plan.md               # This planning document
```

## Range Data Structure
Each range file (e.g., `ranges/BTN/BTN_open.json`) will contain only the essential information:
```json
{
  "position": "BTN",
  "action": "open",
  "description": "Button opening range",
  "percentage": 25.3
}
```

## Simplified Range Data Structure
Each range file will contain just the essential information:
```json
{
  "position": "BTN",
  "action": "open",
  "description": "Button opening range",
  "percentage": 25.3
}
```

The app will calculate the range automatically based on the percentage. This approach:
- **Ultra simple** - Just specify the percentage
- **Automatic calculation** - App determines which hands to include
- **Easy to add** - Just set the percentage you want
- **Minimal data** - Each range file is just a few lines
- **Flexible** - Can easily adjust percentages for different situations

## Hand Rankings (data/hands.json)
The app will use a predefined hand ranking file that contains all 169 possible hands in order from strongest to weakest:
```json
[
  "AA", "AKs", "AKo", "AQs", "AQo", "AJs", "AJo", "ATs", "ATo", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
  "KK", "KQs", "KQo", "KJs", "KJo", "KTs", "KTo", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s",
  "QQ", "QJs", "QJo", "QTs", "QTo", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s",
  "JJ", "JTs", "JTo", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s",
  "TT", "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s",
  "99", "98s", "97s", "96s", "95s", "94s", "93s", "92s",
  "88", "87s", "86s", "85s", "84s", "83s", "82s",
  "77", "76s", "75s", "74s", "73s", "72s",
  "66", "65s", "64s", "63s", "62s",
  "55", "54s", "53s", "52s",
  "44", "43s", "42s",
  "33", "32s",
  "22"
]
```

When a range specifies 25.3%, the app will include the top 25.3% of hands from this ranking (approximately the first 43 hands).

## Adding New Ranges
To add a new range, simply create a new JSON file in the appropriate position folder:
- File naming: `{POSITION}_{ACTION}.json` (e.g., `BTN_open.json`, `BB_vs_BTN.json`)
- Copy the simplified structure above
- Set the percentage you want (e.g., 25.3 for 25.3% of hands)
- The app will automatically calculate and display the range

## UI Components (Phase 1)
1. **Position Selector** - Buttons for position selection (UTG, MP, CO, BTN, SB, BB)
2. **Action Selector** - Buttons for different actions (open, vs_3bet, vs_4bet, etc.)
3. **Range Grid** - 13x13 grid showing all possible hands with color coding
4. **Percentage Display** - Shows current range percentage and hand count
5. **Range Info Panel** - Shows selected range description and details
6. **Hand Details** - Shows selected hand details when clicked

## UI Layout
```
┌─────────────────────────────────────────────────────────┐
│ Position: [UTG] [MP] [CO] [BTN] [SB] [BB]            │
│ Action:   [open] [vs_3bet] [vs_4bet] [fold]          │
├─────────────────────────────────────────────────────────┤
│ Range: 25.3% (43 hands) | Description: Button opening │
├─────────────────────────────────────────────────────────┤
│                    Range Grid                          │
│  A  K  Q  J  T  9  8  7  6  5  4  3  2              │
│A ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●              │
│K ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●              │
│Q ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●              │
│J ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●              │
│T ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●              │
│9 ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●              │
│8 ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●              │
│7 ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●              │
│6 ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●              │
│5 ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●              │
│4 ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●              │
│3 ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●              │
│2 ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●  ●              │
├─────────────────────────────────────────────────────────┤
│ Selected: AKs | Details: Ace-King suited              │
└─────────────────────────────────────────────────────────┘
```

## Color Coding
- **Green** - Hands in the range (raise/call)
- **Red** - Hands not in the range (fold)
- **Blue** - Selected hand (when clicked)
- **Gray** - Unselected hands

## Development Phases
1. **Phase 1** - Basic range display and navigation (Current Focus)
   - Create range grid visualization
   - Implement position/action selectors
   - Load and display ranges from JSON files
   - Basic hand selection and highlighting
2. **Phase 2** - Quiz functionality
3. **Phase 3** - Custom range builder
4. **Phase 4** - Statistics and progress tracking
5. **Phase 5** - Polish and optimization

## Next Steps (Phase 1)
- Set up project structure and create folders
- Create basic HTML layout with range grid
- Implement range grid display (13x13 grid)
- Add position/action selectors
- Create sample range JSON files
- Implement range loading and display logic 