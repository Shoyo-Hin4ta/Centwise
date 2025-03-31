# Centwise - Financial Tracking Application

Centwise is a React Native mobile application that helps users visualize and auto-categorize their spending. The app provides an intuitive and visually appealing interface for tracking expenses, viewing spending patterns, and managing budgets.

## Tech Stack

- **Framework**: React Native TypeScript with Expo & Expo Router
- **Styling**: NativeWind (Tailwind for React Native)
- **State Management**: Zustand
- **Backend/Authentication**: Supabase
- **Payments**: Stripe React Native

## Features Implemented

### Home Screen Simplification

- Removed the Expense Categories section from the home screen
- Improved spacing between UI elements
- Enhanced focus on transaction input and history
- More streamlined user interface with less visual clutter
- Optimized vertical spacing for better content hierarchy

## Project Structure

```
├── app/                     # Expo Router screens
├── assets/                  # Images, fonts, and other static assets
├── components/              # Reusable UI components
├── modules/                 # Feature modules
│   ├── expenses/            # Expenses module
│   │   ├── hooks.ts         # Custom React hooks
│   │   ├── index.ts         # Module exports
│   │   ├── store.ts         # Zustand store
│   │   └── types.ts         # TypeScript types
├── theme/                   # Theme configuration
│   └── colors.ts            # Color palette
└── utils/                   # Utility functions
```

## Architecture Principles

### Safe Area Handling

- Consistent background color throughout the application
- Centralized safe area handling with Expo Router layouts
- App-wide constants for color management
- Custom Layout component for consistent safe area insets

### Modular Design

- Each functional area is self-contained in its own module
- Modules have their own components, hooks, and state management
- Clear interfaces between modules to minimize cross-dependencies
- Module registry for dynamic module discovery

### Component Design

- Functional components with proper TypeScript interfaces
- Single responsibility principle
- Proper prop validation with default values
- Reusable components for repeated UI patterns

### State Management

- Zustand stores organized by domain
- Proper loading/error states
- Selectors to prevent unnecessary re-renders
- Store slices for different features

## Code Quality

This project uses ESLint for both linting and code formatting:

- Run `npm run lint` to check for code issues
- Run `npm run format` to automatically fix formatting and linting issues
- You can also run the included script `./fix_lint.sh` to fix all linting issues at once
- Consistent code style is enforced through ESLint rules in `.eslintrc.js`
- Editor-level formatting is supported through `.editorconfig`

## Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/centwise.git
   cd centwise
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Run on your device or emulator:
   ```
   npm run ios
   # or
   npm run android
   ```

## GitHub Push Instructions

To push the Expense Categories feature to GitHub:

1. Create a new branch:
   ```
   git checkout -b feature/expense-categories
   ```

2. Add all modified files:
   ```
   git add .
   ```

3. Commit your changes:
   ```
   git commit -m "Add expense categories visualization feature"
   ```

4. Push to GitHub:
   ```
   git push origin feature/expense-categories
   ```

5. Create a pull request on GitHub to merge your feature branch into the main branch.

## Next Steps

- Implement transaction details screen
- Add budget creation and tracking
- Integrate Supabase authentication
- Set up Stripe for payment processing
- Implement transaction auto-categorization using machine learning
