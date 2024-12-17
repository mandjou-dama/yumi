import Reactotron, {
  trackGlobalErrors,
  trackGlobalLogs,
  openInEditor,
} from "reactotron-react-native";

Reactotron.configure() // controls connection & communication settings
  .useReactNative({
    networking: {
      // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/,
    },
    editor: true, // there are more options to editor
    errors: { veto: (stackFrame) => false }, // or turn it off with false
    overlay: false, // just turning off overlay
  })
  .connect();
