import { app, BrowserWindow, ipcMain } from "electron";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import path from "path";
import treeKill from "tree-kill";

export default function appMain(mainWindow: BrowserWindow): void {
  const sendMsg = (eventName: string, msg?: string) => {
    if (!mainWindow.webContents.isDestroyed()) {
      mainWindow.webContents.send(eventName, msg);
    }
  };

  let proc: ChildProcessWithoutNullStreams;

  ipcMain.handle("execute", (event) => {
    if (proc && proc.pid) {
      console.log("ToanVQ ~ file: app-main.ts ~ line 16 ~ ipcMain.handle ~ proc.pid", proc.pid);
      treeKill(proc.pid, "SIGTERM");
    }
    return new Promise<void>((resolve, reject) => {
      const exePath = app.isPackaged
        ? path.join(process.resourcesPath, "assets/complex_program.js")
        : path.join(app.getAppPath(), "assets/complex_program.js");
      console.log("defaultfunctionappMain -> exePath", exePath);
      proc = spawn("node", [exePath]);
      proc.stdout.on("data", (data) => {
        const textDecoder = new TextDecoder();
        sendMsg("stdout", textDecoder.decode(data));
      });
      proc.stdout.on("error", (error) => {
        console.log("ToanVQ ~ file: app-main.ts ~ line 25 ~ proc.stdout.on ~ error", error);
        sendMsg("stdout", error.stack);
      });
      proc.on("error", (error) => {
        console.log("ToanVQ ~ file: app-main.ts ~ line 33 ~ proc.on ~ error", error);
        reject(error);
      });
      proc.on("exit", (code, signal) => {
        if (signal === "SIGINT") {
          return;
        }
        sendMsg("stdout", `Exit code ${code} ${signal}`);
        sendMsg("proc-exit");
      });
      resolve();
    })
      .then(() => {
        return { status: true };
      })
      .catch((error: Error) => {
        sendMsg("stdout", error.stack);
        sendMsg("proc-exit");
        return { status: false };
      });
  });
  ipcMain.on("stop-proc", (event) => {
    if (proc && proc.pid) {
      console.log(
        "ToanVQ ~ file: app-main.ts ~ line 47 ~ ipcMain.on ~ treeKill(proc.pid)",
        proc.pid,
        treeKill(proc.pid, "SIGTERM")
      );
    }
  });

  mainWindow.on("close", () => {
    if (proc && proc.pid) {
      console.log("defaultfunctionappMain -> proc && proc.pid", proc && proc.pid);
      treeKill(proc.pid, "SIGINT");
    }
    ipcMain.removeHandler("execute");
    ipcMain.removeHandler("stop-proc");
  });
}
