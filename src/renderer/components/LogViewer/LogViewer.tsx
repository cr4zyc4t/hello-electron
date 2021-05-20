import React, { useEffect, useRef } from "react";
import "./LogViewer.scss";

export interface LogViewerProps {
  log: string;
}

export default function LogViewer({ log }: LogViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;
    container.scrollTop = container.scrollHeight;
  }, [log]);

  return (
    <div ref={containerRef} className="log-viewer">
      {log}
    </div>
  );
}
