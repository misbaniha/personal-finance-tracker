# Personal Finance Tracker (React Native - Expo)

This is a small personal finance tracker built with React Native (Expo).  
Features implemented:
- Add expenses (amount, category, optional note)
- View expenses grouped by date
- Totals for Today, This Week, This Month
- Predefined categories + add new category (persisted)
- Filter by category, sort (latest first / highest amount), search by note
- Settings screen with "Clear All Data" confirmation
- Persistent storage via AsyncStorage
- Bottom tab navigation (Home, Add, Settings)

## Run locally

Requirements:
- Node.js (14+ recommended)
- Expo CLI (`npm install -g expo-cli`) or use `npx expo`
- Android/iOS simulator or Expo Go on device

Steps:
```bash
cd personal-finance-tracker
npm install
npm start
# then open in Expo Go or run on simulator with `npm run android` / `npm run ios`
```

Project structure:
```
/components
/screens
/storage
/utils
App.js
package.json
README.md
```

I created a zipped project at `/mnt/data/personal-finance-tracker.zip`. Download it and follow the steps above.
