import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("preloadAPI", {
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
    ipcRenderer.on(channel, listener),
  off: (event: string | symbol, listener: (...args: any[]) => void) =>
    ipcRenderer.off(event, listener),
});
