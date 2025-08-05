# Poker Range Trainer - Features Overview

## What is the Poker Range Trainer?

The Poker Range Trainer is a web application that helps poker players learn, practice, and visualize hand ranges for different positions and situations. It displays poker hands in a familiar 13x13 grid format, similar to what you'd see in poker software, with color-coded hands based on the recommended action.

## Core Features

### Range Visualization
- **13x13 Hand Grid**: View all 169 possible poker hands in a visual grid
- **Color-Coded Actions**: Hands are colored based on recommended action:
  - **Green**: Raise hands (strong hands to bet with)
  - **Orange**: Call hands (medium hands to call with)
  - **Red**: Fold hands (weak hands to fold)
  - **Gray**: Neutral (when no range is available)
- **Interactive Selection**: Click any hand to see detailed information including hand strength rank

### Position-Based Ranges
- **Multiple Positions**: Support for all standard poker positions:
  - **UTG** (Under the Gun) - First to act
  - **MP** (Middle Position) - Second to act
  - **CO** (Cutoff) - Third to act
  - **BTN** (Button) - Fourth to act
  - **SB** (Small Blind) - Fifth to act
  - **BB** (Big Blind) - Last to act
- **Dynamic Discovery**: Only shows positions that have available range data
- **Smart Defaults**: Automatically selects Button position when available

### Action-Based Scenarios
- **Opening Ranges**: What hands to raise when first to act
- **vs 3-bet Ranges**: How to respond when someone re-raises
- **vs 4-bet Ranges**: How to respond to aggressive re-raising
- **Dynamic Actions**: Action buttons update based on available data for each position

### Range Information Display
- **Percentage Display**: Shows the percentage of hands in the range
- **Hand Count**: Displays the exact number of hands included
- **Range Description**: Human-readable description of the scenario
- **Dual Percentage Support**: Shows both raise and call percentages when applicable

### Hand Details Panel
- **Hand Type**: Identifies if the hand is a pair, suited, or offsuit
- **Strength Ranking**: Shows the hand's position in the 169-hand strength hierarchy
- **Detailed Information**: Format like "AA - Pair (Rank: 1/169)" for the strongest hand

### URL-Based Navigation
- **Direct Links**: Share specific position/action combinations via URL
- **Bookmarkable**: Save favorite ranges as browser bookmarks
- **Browser History**: Back and forward buttons work correctly
- **Deep Linking**: Link directly to any position/action combination

### Responsive Design
- **Mobile Friendly**: Works on phones and tablets
- **Desktop Optimized**: Full-featured experience on larger screens
- **Touch Support**: Easy to use on touch devices
- **Flexible Layout**: Adapts to different screen sizes

## User Experience Features

### Easy Navigation
- **One-Click Position Changes**: Switch between positions instantly
- **Dynamic Action Updates**: Action options change based on selected position
- **Visual Feedback**: Active selections are clearly highlighted
- **Smooth Transitions**: Smooth animations when switching ranges

### Intuitive Interface
- **Familiar Grid Layout**: Standard poker hand grid format
- **Clear Color Coding**: Intuitive color system for actions
- **Hover Effects**: Visual feedback when hovering over hands
- **Click to Select**: Easy hand selection for detailed information

### Error Handling
- **Graceful Degradation**: Shows neutral grid when range data is missing
- **Helpful Messages**: Clear information about missing ranges
- **Fallback Options**: Maintains functionality even with missing data
- **URL Validation**: Handles invalid URLs gracefully

## Data Management

### Range Data Structure
- **Percentage-Based**: Ranges defined by percentage of hands (0-100%)
- **Raise Percentage**: Percentage of strongest hands to raise with
- **Call Percentage**: Optional percentage of hands to call with
- **Automatic Calculation**: App calculates which specific hands are included

### Hand Ranking System
- **169-Hand Scale**: All possible poker hands ranked from strongest to weakest
- **Standard Rankings**: Based on accepted poker hand strength
- **Consistent Ordering**: Same ranking used across all ranges
- **Visual Representation**: Grid shows hands in standard poker order

### File Organization
- **Position-Based Folders**: Organized by poker position
- **Action-Based Files**: Files named by position and action
- **Easy to Add**: Simple JSON format for adding new ranges
- **Automatic Discovery**: App finds available ranges automatically

## Learning Features

### Range Practice
- **Visual Learning**: See exactly which hands to play in each situation
- **Position Understanding**: Learn how ranges change by position
- **Action Scenarios**: Understand different betting situations
- **Hand Strength**: Learn relative hand strength through ranking

### Reference Tool
- **Quick Lookup**: Find specific ranges for any position/action
- **Comparison Tool**: Easily compare ranges between positions
- **Study Aid**: Use for memorizing standard ranges
- **Training Tool**: Practice recognizing hand ranges

## Accessibility Features

### Keyboard Navigation
- **Tab Navigation**: Navigate through all interactive elements
- **Enter/Space**: Activate buttons and selections
- **Arrow Keys**: Navigate through hand grid (future feature)

### Screen Reader Support
- **Semantic HTML**: Proper heading and button structure
- **Alt Text**: Descriptive text for all interactive elements
- **ARIA Labels**: Accessible labels for complex interactions
- **Focus Indicators**: Clear focus states for keyboard users

## Future Features (Roadmap)

### Phase 2: Quiz Functionality
- **Hand Selection Quizzes**: Test knowledge of which hands to play
- **Position Recognition**: Practice identifying correct ranges by position
- **Action Scenarios**: Quiz on raise/call/fold decisions
- **Progress Tracking**: Monitor learning progress over time

### Phase 3: Custom Range Builder
- **Personal Ranges**: Create and save custom hand ranges
- **Range Editing**: Modify existing ranges to match your style
- **Range Comparison**: Compare custom ranges with standard ranges
- **Range Export**: Share custom ranges with others

### Phase 4: Statistics and Progress
- **Learning Analytics**: Track study time and progress
- **Performance Metrics**: Measure accuracy in range recognition
- **Study Reminders**: Set goals and track completion
- **Achievement System**: Gamify the learning process

### Phase 5: Advanced Features
- **Range Comparison**: Side-by-side range comparison
- **Hand Equity**: Show equity calculations for hands
- **Board Texture**: Consider board cards in range decisions
- **Multi-Table**: Support for different table sizes and formats

## Use Cases

### For Beginners
- **Learn Basic Ranges**: Start with simple opening ranges
- **Understand Position**: See how position affects hand selection
- **Visual Learning**: Use color coding to understand hand strength
- **Practice Recognition**: Click hands to learn their strength

### For Intermediate Players
- **Refine Ranges**: Study specific position/action combinations
- **Compare Scenarios**: See how ranges change in different situations
- **Practice Scenarios**: Use for pre-session range review
- **Reference Tool**: Quick lookup during study sessions

### For Advanced Players
- **Custom Ranges**: Build and save personal range adjustments
- **Scenario Practice**: Study complex multi-street scenarios
- **Range Analysis**: Deep dive into specific range components
- **Teaching Tool**: Use to explain ranges to others

## Benefits

### Learning Efficiency
- **Visual Learning**: Faster understanding through visual representation
- **Interactive Practice**: Active engagement improves retention
- **Immediate Feedback**: Instant validation of range knowledge
- **Progressive Learning**: Start simple, advance to complex scenarios

### Practical Application
- **Real-World Relevance**: Based on actual poker situations
- **Position Awareness**: Develop position-based thinking
- **Action Recognition**: Learn to identify correct actions quickly
- **Range Memorization**: Build muscle memory for common ranges

### Study Flexibility
- **Anytime Access**: Available 24/7 for practice
- **Mobile Friendly**: Study on any device
- **Bookmarkable**: Save specific scenarios for later review
- **Shareable**: Share specific ranges with study partners

This feature-focused overview describes what the Poker Range Trainer does and how it helps poker players improve their game, without getting into technical implementation details. 