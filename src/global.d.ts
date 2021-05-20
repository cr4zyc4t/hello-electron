interface Window {
  preloadAPI: {
    send: (channel: string, ...args: any[]) => void;
    invoke: (channel: string, ...args: any[]) => Promise<any>;
    on: (
      channel: string,
      listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => void;
    off: (event: string | symbol, listener: (...args: any[]) => void) => void;
  };
}

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
