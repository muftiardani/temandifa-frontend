import React from "react";
import Toast from "react-native-toast-message";
import * as Sentry from "@sentry/react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootNavigator from "./src/navigation/RootNavigator";
import { Config } from "./src/config";

Sentry.init({
  dsn: Config.sentry.dsn,
  debug: __DEV__,
  integrations: [Sentry.reactNavigationIntegration()],
  tracesSampleRate: 1.0,
});

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNavigator />
      <Toast />
    </GestureHandlerRootView>
  );
};

export default Sentry.wrap(App);
