# 🐎 Texas Hold Your Horses

A real-time multiplayer web game that combines the excitement of Texas Hold'em poker with the thrill of horse racing betting. Players bet on hidden hands and watch as community cards are revealed across four thrilling rounds.

## 🎮 What is Texas Hold Your Horses?

**Texas Hold Your Horses** is a unique betting game where players place wagers on five different hands, including one mysterious "Dark Horse" hand that remains hidden until the final reveal. The game progresses through four distinct phases, each revealing more community cards and building anticipation.

### 🏇 Game Phases

1. **Out of the Gate** - Pre-flop betting round
2. **In the Running** - Post-flop with three community cards revealed
3. **Final Furlong** - Post-turn with four community cards
4. **Photo Finish** - Final reveal with all five community cards

### 🎯 How to Play

- **Select Hands**: Choose one or more hands to bet on (or skip betting entirely)
- **Place Bets**: Set your bet amount and confirm
- **Get Ready**: Mark yourself ready to advance the round
- **Watch & Win**: See community cards revealed and collect your winnings

## ✨ Features

- **Real-time Multiplayer**: Built for multiple players in the same room
- **Beautiful UI**: Modern, casino-inspired design with smooth animations
- **Flexible Betting**: Bet on multiple hands or skip betting entirely
- **Dark Horse Mystery**: One hand remains hidden until the final reveal
- **Responsive Design**: Works on desktop and mobile devices
- **State Management**: Centralized game state with Zustand
- **TypeScript**: Full type safety throughout the codebase

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/texas-hold-your-horses.git
   cd texas-hold-your-horses
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in your terminal)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run test suite

## 🏗️ Project Structure

```
src/
├── components/          # React UI components
│   ├── ui/             # Reusable UI components (buttons, sliders, etc.)
│   ├── BettingDashboard.tsx    # Betting controls and ready button
│   ├── CommunityBoard.tsx      # Community card display
│   ├── CommunityCardRail.tsx   # Hand selection and display
│   ├── GameHeader.tsx          # Game info and timer
│   └── PlayingCard.tsx         # Individual card component
├── store/              # State management
│   └── gameStore.ts    # Zustand store for game state
├── hooks/              # Custom React hooks
│   └── useGameTimer.ts # Game timer logic
├── types/              # TypeScript type definitions
│   └── game.ts         # Game interfaces and types
├── utils/              # Utility functions
│   └── gameLogic.ts    # Game mechanics and validation
└── guidelines/         # Game design documentation
    └── GAME_DESIGN.md  # Detailed game rules and flow
```

## 🎲 Game Rules

### Betting
- Players can bet on one or more hands
- Minimum bet: $10
- Players can skip betting entirely and just mark ready
- Betting is locked during the Photo Finish phase

### Hand Evaluation
- Each hand consists of 2 hole cards + 5 community cards
- Standard poker hand rankings apply
- Dark Horse hand is revealed only at the end

### Round Progression
- Rounds advance when all players are ready OR timer expires
- Each phase reveals additional community cards
- Final phase shows all cards and determines winners

## 🔧 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Build Tool**: Vite
- **UI Components**: Custom component library
- **Testing**: Jest (test files included)

## 🚧 Current Status

This is an **MVP (Minimum Viable Product)** with the following completed:

✅ **Phase 1 Complete**: Centralized game state management  
✅ **UI Components**: All game interface components built  
✅ **Game Logic**: Betting, hand selection, round progression  
✅ **Betting Lock**: Photo Finish stage prevents bet modifications  
✅ **Optional Betting**: Players can skip betting entirely  

### 🎯 Next Steps (Phase 2)

- [ ] WebSocket backend integration
- [ ] Multiplayer room management
- [ ] Real-time synchronization
- [ ] Player disconnection handling
- [ ] Production deployment

## 🤝 Contributing

This is a personal project, but if you're interested in contributing:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎮 Play the Game

Ready to try your luck? Start the development server and experience the thrill of Texas Hold Your Horses!

---

*Built with ❤️ and lots of 🐎 puns*  