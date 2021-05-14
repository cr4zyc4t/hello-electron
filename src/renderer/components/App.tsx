import { ipcRenderer, IpcRendererEvent } from "electron";
import React, { useCallback, useEffect, useState } from "react";
import "./App.scss";
import LogViewer from "./LogViewer";

export default function App() {
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState("");
  const [processing, setProcessing] = useState(false);

  const onButtonClicked = useCallback(() => {
    if (running) {
      console.log("ToanVQ ~ file: App.tsx ~ line 13 ~ onButtonClicked ~ running", running);
      return ipcRenderer.send("stop-proc");
    }
    setProcessing(true);
    ipcRenderer
      .invoke("execute")
      .then((response) => {
        console.log("ToanVQ ~ file: App.tsx ~ line 11 ~ .then ~ response", response);
        setRunning(response.status);
      })
      .catch(console.log)
      .finally(() => setProcessing(false));
  }, [running]);

  const appendLog = useCallback((newLine) => {
    setLog((l) => l + newLine.replace(/^\n/, "").replace(/\n$/ + "\n", ""));
  }, []);

  useEffect(() => {
    const handleStdout = (event: IpcRendererEvent, logData: any) => {
      if (running) {
        appendLog(logData);
      }
    };
    const handleExit = (event: IpcRendererEvent) => {
      setRunning(false);
      setLog("");
    };
    ipcRenderer.on("stdout", handleStdout);
    ipcRenderer.on("proc-exit", handleExit);
    return () => {
      ipcRenderer.removeListener("stdout", handleStdout);
      ipcRenderer.removeListener("proc-exit", handleExit);
    };
  }, [appendLog, running]);

  useEffect(() => {
    ipcRenderer.send("stop-proc");
  }, []);

  return (
    <div className="container">
      <button className="start-btn" disabled={processing} onClick={onButtonClicked}>
        {running ? "Stop" : "Run"}
      </button>

      <LogViewer log={log} />
    </div>
  );
}
