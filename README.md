# MacroZone

A lightweight mobile app for logging meals and tracking calories and macronutrients. Built with **Expo** and **React Native**, MacroZone runs from a single codebase on Android, iOS, and the web.

> All data stays on the device. No account or backend service is required.

## Features

- Log meals with their name, calories, protein, carbohydrates, and fat.
- View total calories and macros for saved meals on the home dashboard.
- Browse the five most recent meals or the complete meal history.
- Delete an individual meal with a long press, or clear all meals after confirmation.
- Copy a nutrition summary to the clipboard or share it through the device's native share sheet.
- Enable optional daily reminders to log lunch at 12:00 and dinner at 18:00.
- Receive haptic feedback after successfully adding or deleting a meal, or copying a summary.

## Tech Stack

| Area                  | Technology                            |
| --------------------- | ------------------------------------- |
| Application framework | Expo SDK 58 + React Native 0.88       |
| Language              | TypeScript                            |
| Navigation            | Expo Router (file-based routing)      |
| Local persistence     | AsyncStorage                          |
| Notifications         | expo-notifications                    |
| Clipboard and sharing | expo-clipboard and React Native Share |
| Icons and haptics     | Expo Vector Icons and expo-haptics    |

## Run Locally

### Prerequisites

- A recent Node.js LTS release
- npm
- Expo Go on a physical device, or an Android / iOS emulator

### Installation

```bash
git clone https://github.com/hamzaatef722/macrozone.git
cd macrozone
npm install
npx expo start
```

Once the development server is running, use one of the options shown in the terminal:

- Scan the QR code with **Expo Go** to run the app on a physical device.
- Press `a` to open Android.
- Press `i` to open iOS (macOS required).
- Press `w` to open the web build.

### Useful Commands

```bash
npm run android  # Start on Android
npm run ios      # Start on iOS
npm run web      # Start the web version
npm run lint     # Run Expo linting
npx tsc --noEmit # Type-check the project
```

## Project Structure

```text
src/
├── app/
│   ├── _layout.tsx          # Root application navigator
│   └── (tabs)/              # Tab screens
│       ├── Home.tsx         # Summary dashboard and recent meals
│       ├── AddMeals.tsx     # Meal-entry form
│       └── Meals.tsx        # Full meal history and bulk deletion
├── Components/              # Reusable UI components
├── storage/meals.ts         # Meal model and AsyncStorage operations
├── styles/global.ts         # Shared colors and styles
└── utils/notifications.ts   # Notification permissions and scheduling
assets/                      # Expo icons and image assets
```

## Data Model

Each meal is stored locally using the following structure:

```ts
type Meal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
};
```

## Storage and Privacy

- Meals are stored on-device in `AsyncStorage` under the `meals` key.
- The reminder preference is stored under the `remindersEnabled` key.
- The app does not send meal data to an external API or database.
- Deleting the app or clearing its data may permanently remove the locally stored history.

## Current Behavior and Limitations

- The dashboard totals include **all stored meals**. They are not currently filtered by date, even though the shared message refers to a daily summary.
- The displayed targets are fixed at 2,000 calories, 150 g protein, 250 g carbohydrates, and 65 g fat.
- Reminders follow the device's local time, run at 12:00 and 18:00, and require notification permission.

## Suggested Improvements

- Add true daily and date-based filtering.
- Allow users to configure their nutrition targets.
- Support editing meals and exporting the meal history.
- Add account-based backup and synchronization.
- Introduce unit and UI tests.

## License

This repository does not currently include a license file. Add an appropriate license, such as MIT, before redistributing or reusing the project.
