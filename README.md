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
- **Action Scenarios**: Opening ranges, vs 3-bet, vs 4-bet
- **Interactive Selection**: Click any hand to see detailed information
- **URL-Based Navigation**: Share specific position/action combinations via URL
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. **Select Position**: Choose your poker position (UTG, MP, CO, BTN, SB, BB)
2. **Select Action**: Choose the action scenario (Open, vs 3-bet, vs 4-bet)
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
- `action`: Action scenario (open, vs_3bet, vs_4bet)
- `description`: Human-readable description
- `raise`: Percentage of hands to raise with (0-100)
- `call`: Optional percentage of hands to call with (0-100)

## Adding New Ranges

To add new range data:

1. Create a new JSON file in the appropriate position folder
2. Follow the format shown above
3. The application will automatically discover and load the new range

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