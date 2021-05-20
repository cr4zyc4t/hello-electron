import type { IpcRendererEvent } from "electron";
import React, { useCallback, useEffect, useState } from "react";
import "./App.scss";
import Counter from "./Counter";
import LogViewer from "./LogViewer";

export default function App() {
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState("");
  const [processing, setProcessing] = useState(false);

  const onButtonClicked = useCallback(() => {
    if (running) {
      setProcessing(true);
      return window.preloadAPI.send("stop-proc");
    }
    setProcessing(true);
    window.preloadAPI
      .invoke("execute")
      .then((response) => {
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
      setProcessing(false);
    };
    window.preloadAPI.on("stdout", handleStdout);
    window.preloadAPI.on("proc-exit", handleExit);

    return () => {
      window.preloadAPI.off("stdout", handleStdout);
      window.preloadAPI.off("proc-exit", handleExit);
    };
  }, [appendLog, running]);

  useEffect(() => {
    window.preloadAPI.send("stop-proc");
  }, []);

  return (
    <div className="container">
      <button className="start-btn" disabled={processing} onClick={onButtonClicked}>
        {running ? "Stop" : "Run"}
      </button>
      <Counter />

      <LogViewer log={log} />
    </div>
  );
}
