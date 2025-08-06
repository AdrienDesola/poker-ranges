# Poker Range Trainer

A web application that helps poker players learn, practice, and visualize hand ranges for different positions and situations.

https://adriendesola.github.io/poker-ranges

## Features

- **13x13 Hand Grid**: View all 169 possible poker hands in a visual grid
- **Color-Coded Actions**: Hands are colored based on recommended action:
  - **Green**: Raise hands (strong hands to bet with)
  - **Orange**: Call hands (medium hands to call with)
  - **Red**: Fold hands (weak hands to fold)
  - **Gray**: Neutral (when no range is available)
- **Position-Based Ranges**: Support for all standard poker positions (UTG, MP, CO, BTN, SB, BB)
- **Action Scenarios**: Opening ranges, vs limp, and position-specific vs ranges (e.g., BB vs SB, BTN vs MP)
- **Interactive Selection**: Click any hand to see detailed information
- **URL-Based Navigation**: Share specific position/action combinations via URL
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. **Select Position**: Choose your poker position (UTG, MP, CO, BTN, SB, BB)
2. **Select Action**: Choose the action scenario (Open, vs Limp, or position-specific vs ranges like vs SB, vs MP, etc.)
3. **View Range**: The hand grid will show color-coded hands based on the selected range
4. **Click Hands**: Click on any hand to see detailed information including hand strength rank
5. **Share Links**: The URL updates automatically, so you can bookmark or share specific ranges

## Running the Application

Since this is a static web application, you can run it using any web server:

### Using Python (recommended)
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

## Data Structure

The application uses JSON files to store range data:

- `data/hands.json`: Contains all 169 poker hands with their strength rankings
- `ranges/[POSITION]/[POSITION]_[ACTION].json`: Range data for each position and action

### Range File Format
```json
{
  "position": "BTN",
  "action": "open",
  "description": "Button opening range",
  "raise": 25.3,
  "call": 35.0
}
```

- `position`: Poker position (UTG, MP, CO, BTN, SB, BB)
- `action`: Action scenario (open, vs_limp, vs_SB, vs_BB, vs_UTG, vs_UTG+1, vs_UTG+2, vs_HJ, vs_LJ, vs_CO, vs_BTN, vs_MP)
- `description`: Human-readable description
- `raise`: Percentage of hands to raise with (0-100)
- `call`: Optional percentage of hands to call with (0-100)

## Adding New Ranges

To add new range data:

1. Create a new JSON file in the appropriate position folder
2. Follow the format shown above
3. The application will automatically discover and load the new range

## Position-Specific vs Ranges

The application now supports position-specific "vs" ranges that are more meaningful than generic "vs 3-bet" ranges. These ranges show how one position should respond to actions from another specific position.

### Examples:
- `BB_vs_SB.json`: Big Blind responding to Small Blind action
- `BTN_vs_MP.json`: Button responding to Middle Position action
- `CO_vs_UTG.json`: Cutoff responding to UTG action
- `SB_vs_BTN.json`: Small Blind responding to Button action

### Naming Convention:
- `vs_SB`: vs Small Blind
- `vs_BB`: vs Big Blind
- `vs_UTG`: vs UTG
- `vs_UTG+1`: vs UTG+1
- `vs_UTG+2`: vs UTG+2
- `vs_HJ`: vs Hijack
- `vs_LJ`: vs Lojack
- `vs_CO`: vs Cutoff
- `vs_BTN`: vs Button
- `vs_MP`: vs Middle Position

# Range Overrides

The poker range trainer now supports hand-specific overrides in range files. This allows you to specify exact actions for individual hands, overriding the percentage-based calculations.

## How to Use Overrides

Add an `overrides` array to your range JSON files:

```json
{
  "position": "BB",
  "action": "open",
  "description": "BB opening range",
  "raise": 51.1,
  "overrides": [
    {
      "AK": "raise",
      "AQs": "raise",
      "AJs": "call",
      "KQs": "raise",
      "KJs": "call",
      "QJs": "call",
      "JTs": "call",
      "T9s": "fold",
      "98s": "fold",
      "87s": "fold",
      "76s": "fold",
      "65s": "fold",
      "54s": "fold",
      "43s": "fold",
      "32s": "fold"
    }
  ]
}
```

## Override Structure

- **overrides**: An array containing override objects
- Each override object maps hand names to actions
- Valid actions: `"raise"`, `"call"`, `"fold"`
- Hand names follow the standard format: `"AK"`, `"AQs"`, `"KJo"`, etc.

## How It Works

1. When determining a hand's action, the system first checks for overrides
2. If a hand has an override, that action is used
3. If no override exists, the percentage-based calculation is used
4. Overrides take precedence over the percentage-based system

## Visual Indicators

- Hands with overrides will show the override action in the grid
- When you click on a hand with an override, it will display "Override: ACTION" in red
- The range info will show the number of hand overrides

## Example Use Cases

- **Tight ranges**: Override specific hands to fold even if they fall within the raise percentage
- **Loose ranges**: Override weak hands to call when they would normally fold
- **Mixed strategies**: Use overrides to implement mixed strategies for specific hands
- **Position-specific adjustments**: Override hands differently based on position

## Hand Naming Convention

- **Pairs**: `"AA"`, `"KK"`, `"QQ"`, etc.
- **Suited**: `"AKs"`, `"AQs"`, `"AJs"`, etc.
- **Offsuit**: `"AKo"`, `"AQo"`, `"AJo"`, etc.

## Tips

- Use overrides sparingly for maximum flexibility
- Consider the overall range percentages when adding overrides
- Test your ranges to ensure they make sense strategically
- Overrides are particularly useful for fine-tuning ranges based on specific game conditions 

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid
- Fetch API

## Accessibility

The application includes:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Reduced motion support

## License

This project is open source and available under the MIT License. 