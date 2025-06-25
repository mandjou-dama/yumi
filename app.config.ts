import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.mandjoudama.yumi.dev";
  }

  if (IS_PREVIEW) {
    return "com.mandjoudama.yumi.preview";
  }

  return "com.mandjoudama.yumi";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Yumi(Dev)";
  }

  if (IS_PREVIEW) {
    return "Yumi(Preview)";
  }

  return "Yumi";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "yumi",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "yumi",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  // splash: {
  //   image: "./assets/images/splash-icon.png",
  //   resizeMode: "contain",
  //   backgroundColor: "#F7ECC9",
  // },
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    icon: {
      light: "./assets/images/icon.png",
      dark: "./assets/images/icon.png",
      tinted: "./assets/images/icon.png",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
    },
    package: getUniqueIdentifier(),
    edgeToEdgeEnabled: true,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-sqlite",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 130,
        resizeMode: "contain",
        backgroundColor: "#F7ECC9",
      },
    ],
    "expo-font",
    "expo-web-browser",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "fb339bc5-04ec-4b5c-9a1f-514550c15e4e",
    },
  },
  updates: {
    url: "https://u.expo.dev/fb339bc5-04ec-4b5c-9a1f-514550c15e4e",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  owner: "mandjou",
});
