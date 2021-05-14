import { app, BrowserWindow, ipcMain } from "electron";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import path from "path";
import treeKill from "tree-kill";
import ElectronLog from "electron-log";

Object.assign(console, ElectronLog.functions);

export default function appMain(mainWindow: BrowserWindow): void {
  // setInterval(() => {
  //   mainWindow.webContents.send("log", { time: Date.now() });
  // }, 1000);
  const sendLog = (log: string) => mainWindow.webContents.send("stdout", log);

  let proc: ChildProcessWithoutNullStreams;

  ipcMain.handle("execute", (event) => {
    if (proc && proc.pid) {
      console.log("ToanVQ ~ file: app-main.ts ~ line 16 ~ ipcMain.handle ~ proc.pid", proc.pid);
      treeKill(proc.pid, "SIGINT");
    }
    return new Promise<void>((resolve, reject) => {
      proc = spawn("node", [path.join(app.getAppPath(), "assets/complex_program.js")]);
      proc.stdout.on("data", (data) => {
        const textDecoder = new TextDecoder();
        sendLog(textDecoder.decode(data));
      });
      proc.stdout.on("error", (error) => {
        console.log("ToanVQ ~ file: app-main.ts ~ line 25 ~ proc.stdout.on ~ error", error);
        sendLog(error.stack);
      });
      proc.on("error", (error) => {
        console.log("ToanVQ ~ file: app-main.ts ~ line 33 ~ proc.on ~ error", error);
        reject(error);
      });
      proc.on("exit", (code, signal) => {
        sendLog(`Exit code ${code} ${signal}`);
        mainWindow.webContents.send("proc-exit");
      });
      resolve();
    })
      .then(() => {
        return { status: true };
      })
      .catch((error) => {
        console.log("ToanVQ ~ file: app-main.ts ~ line 45 ~ ipcMain.handle ~ error", error);
        sendLog(error.stack);
        mainWindow.webContents.send("proc-exit");
        return { status: false };
      });
  });
  ipcMain.on("stop-proc", (event) => {
    if (proc && proc.pid) {
      console.log(
        "ToanVQ ~ file: app-main.ts ~ line 47 ~ ipcMain.on ~ treeKill(proc.pid)",
        proc.pid,
        treeKill(proc.pid, "SIGINT")
      );
    }
  });
}
