# Dog Tap Game - Telegram Mini App

Ever wanted your own virtual dog companion? This Telegram Mini App lets you adopt a cute digital dog that you can tap to earn coins, dress up with fun accessories, and take care of through daily missions. It's surprisingly addictive!

Built with React and TypeScript, featuring smooth canvas animations that make your dog feel alive and responsive.

## What makes it fun?

**The Tap Game**: Just tap your dog and watch the coins roll in! Each tap gives you haptic feedback (if you're on mobile), making it feel really satisfying. Your dog bounces and reacts to every tap with cute animations.

**Customize Your Pup**: Your dog doesn't have to look boring! Pick from different body types - maybe you want a fluffy poodle-style dog, or a sleek slim one? Then dress them up with hats (caps, crowns, bows) and choose their color. You can drag and drop accessories or just tap to apply them.

**Daily Missions**: Keep things interesting with daily challenges. Log in for bonus coins, reach tap milestones, or customize your dog for extra rewards. There's always something to work towards.

**Smooth Animations**: This isn't just static images - your dog is animated with smooth 60fps canvas rendering. It bounces, wags its tail, and even sticks its tongue out when excited. The animations adapt to your screen size too.

## How it's built

The app is pretty straightforward - here's how I organized everything:

```
src/
├── components/           # All the React components
│   ├── CanvasDogAnimation.tsx   # The main dog with animations
│   ├── TapToEarn.tsx           # Game screen with stats
│   ├── DogCustomization.tsx    # Dress up your dog
│   ├── MissionPanel.tsx        # Daily challenges
│   ├── Navigation.tsx          # Bottom tabs
│   └── DogSvg.tsx             # Static dog for previews
├── services/
│   └── api.ts          # Handles missions (with fallback data)
├── types/
│   └── index.ts        # TypeScript interfaces
├── utils/
│   ├── constants.ts    # Game settings and dog configurations
│   └── telegram.ts     # Telegram integration
└── App.tsx             # Main app component
```

### Tech choices

I went with **React + TypeScript** because it's reliable and makes development much smoother. The game state is pretty simple - just React hooks with localStorage to save your progress. Everything resets daily except your total coins and customizations.

For the **animations**, I used Konva.js which gives smooth 60fps canvas rendering. The dog has different animation frames that cycle through, and when you tap, it triggers bounce effects and ripples. I had to be careful about cleaning up animations to avoid memory leaks.

**Telegram integration** was interesting - I used their WebApp SDK for haptic feedback (those little vibrations when you tap), and made sure it works across different Telegram versions. Some older versions don't support all features, so there's fallback handling.

The **game state** looks like this:

```typescript
interface GameState {
  coins: number; // Your total coins
  tapsCount: number; // Lifetime taps
  dogCustomization: DogCustomization; // How your dog looks
  dailyTapsCount: number; // Today's taps (resets daily)
  hasCustomizedToday: boolean; // For daily missions
  lastLoginDate: string; // To know when to reset
  rewardedMissions: string[]; // Which missions you've claimed
}
```

## Running it locally

Want to try it out or make changes? Here's how to get it running:

**What you need:**

- Node.js 18 or newer
- npm (comes with Node.js)

**Getting started:**

```bash
# Get the code
git clone <repository-url>
cd telegram-mini-app

# Install everything
npm install

# Start the dev server
npm run dev
```

The app will open at `http://localhost:5173`. It works in any browser, but for the full Telegram experience (haptic feedback, etc.), you'll need to set it up as a Telegram Mini App.

**For production:**

```bash
npm run build
```

**API setup** (optional):
If you want to connect to a real API for missions, create a `.env` file:

```env
VITE_API_BASE_URL=https://your-api-endpoint.com
```

Otherwise, it'll just use mock data, which works fine for development.

## 🔧 Configuration

### Game Configuration

Modify `src/utils/constants.ts` to adjust game parameters:

```typescript
export const GAME_CONFIG = {
  COINS_PER_TAP: 1, // Coins earned per tap
  MILESTONE_TAPS: 50, // Haptic feedback interval
} as const;

export const ANIMATION_CONFIG = {
  FRAME_DURATION: 200, // Animation frame duration (ms)
  TAP_EFFECT_DURATION: 200, // Tap effect duration (ms)
} as const;
```

### Dog Customization Options

Add new customization options in the `CUSTOMIZATION_OPTIONS` array:

```typescript
{
  id: "new-option",
  name: "New Option",
  preview: "🎭",
  category: "hat" | "body" | "color"
}
```

## 🎨 Customization & Extension

### Adding New Dog Body Types

1. Define SVG constants in `constants.ts`
2. Add body type to `DogCustomization` interface
3. Update rendering logic in `CanvasDogAnimation.tsx`
4. Add option to `CUSTOMIZATION_OPTIONS`

### Creating New Mission Types

1. Add mission type to the `Mission` interface
2. Implement progress tracking in `MissionPanel.tsx`
3. Update mock data in `api.ts`

### Extending Animation System

The animation system supports:

- Custom frame configurations
- Dynamic property tweening
- Interactive effects
- Performance-optimized cleanup

## 🔄 API Integration

### Mission API

The app expects a REST API endpoint at `/getMissions` returning:

```typescript
interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  imageUrl?: string;
  type: "tap_count" | "customization" | "daily_login" | "manual";
  target?: number;
  progress?: number;
  rewarded?: boolean;
}
```

### Mock Data Fallback

If the API is unavailable, the app automatically falls back to mock data, ensuring uninterrupted development and testing.

## Problems I ran into (and how I solved them)

**Getting smooth 60fps animations was tricky.** The dog needs to animate constantly, plus handle tap effects, all while staying responsive. I ended up using Konva.js for hardware acceleration and being really careful about cleaning up animation intervals. The key was separating the animation logic from React's render cycle.

**Telegram WebApp compatibility is... interesting.** Different Telegram versions support different features, so I had to build in version detection. Older versions don't have haptic feedback or header customization, so the app gracefully falls back to just working without those features.

**Daily resets while keeping long-term progress** was a fun puzzle. I wanted missions to reset daily but keep your total coins and customizations. The solution was checking the date on app load and resetting only the daily stuff if it's a new day.

**Making it work on all screen sizes** took some CSS wrestling. Mobile screens vary wildly, so I used CSS Grid and Flexbox with responsive breakpoints. Everything scales properly from tiny phones to tablets.

**Converting SVG designs to canvas animations** was probably the most complex part. I had to break down the dog SVG into individual Konva elements (circles, ellipses, paths) and make them configurable for different body types and colors. Each animation frame tweaks different properties.

## Deploying it

**Setting up the Telegram bot:**

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot and get your token
3. Set up the Mini App URL in your bot settings
4. If you're using a real API, configure webhook endpoints

**Where to host it:**

- **Vercel** - My favorite, zero-config with automatic HTTPS
- **Netlify** - Also great, just drag and drop your build folder
- **GitHub Pages** - Free and works fine for static sites
- **Your own server** - If you need more control

**Before going live:**

- [ ] Set up environment variables
- [ ] Make sure your API is secure (if using one)
- [ ] HTTPS is enabled (required for Telegram Mini Apps)
- [ ] Test it in Telegram
- [ ] Maybe add some error tracking

## 🛠️ Development Tools

### Code Quality

- **ESLint**: Code linting with React-specific rules
- **TypeScript**: Type safety and better development experience
- **Prettier**: Code formatting (recommended)

### Build Tools

- **Vite**: Fast development server and optimized builds
- **React Plugin**: Hot module replacement and JSX support
- **TypeScript Plugin**: Type checking during build

### Testing (Recommended Additions)

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Cypress**: End-to-end testing

## 📱 Browser Compatibility

- **Telegram WebApp**: All supported Telegram versions
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Browsers**: iOS Safari 14+, Android Chrome 90+

## Want to contribute?

Found a bug or have a cool idea? Feel free to:

1. Fork it
2. Make your changes in a new branch
3. Test it out
4. Send a pull request

Just try to keep the code clean and add TypeScript types for new stuff.

## License

MIT License - basically do whatever you want with it.

## Thanks

- **Telegram** for the Mini App platform
- **Konva.js** for making canvas animations actually fun to work with
- **React team** for the solid framework
- **Vite** for the super fast dev server

---

Hope you enjoy playing with your virtual dog! 🐕
