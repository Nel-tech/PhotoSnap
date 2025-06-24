// types/onesignal.d.ts
interface OneSignalPushEvent {
  (callback: () => void): void;
}

interface OneSignalSDK {
  push: OneSignalPushEvent;
  init: (options: any) => void;
  sendTag?: (key: string, value: string) => void;
}

interface Window {
  OneSignal: OneSignalSDK;
}
