import { NativeWindStyleSheet } from "nativewind";

// Configure NativeWind for both native and web
NativeWindStyleSheet.setOutput({
  default: "native",
  web: {
    purge: false
  }
});
