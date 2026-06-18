# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## iOS native builds

This app uses a **development build** (`expo-dev-client`) with native modules such as `expo-camera`. The `ios/` directory is generated locally and is gitignored.

### Precompiled Expo modules (`EXPO_USE_PRECOMPILED_MODULES`)

In `ios/Podfile.properties.json` we set:

```json
"EXPO_USE_PRECOMPILED_MODULES": "false"
```

**Why:** Prebuilt Expo XCFrameworks can get out of sync across packages (for example, `ExpoCamera` expecting a symbol that an older prebuilt `ExpoModulesCore` does not export). That causes an immediate launch crash (`dyld: Symbol missing`) before JavaScript runs. Building Expo modules from source keeps native dependencies on the same SDK version.

**Trade-off:** iOS builds are **slower** (especially the first build after `pod install`), but linking is reliable.

**After regenerating native projects**, re-apply this flag if it is removed:

```bash
npx expo prebuild --clean
# Then ensure ios/Podfile.properties.json contains "EXPO_USE_PRECOMPILED_MODULES": "false"
cd ios && pod install
npm run ios
```

You can try removing the flag later once all Expo packages are on the same SDK patch level and a clean rebuild launches without dyld errors. Default Expo behavior is precompiled modules enabled (`true`).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
