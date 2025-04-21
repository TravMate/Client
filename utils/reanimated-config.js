import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// Configure Reanimated to disable warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.error, // Only show errors, suppress warnings
  strict: false, // Disable strict mode
});

export default {};
