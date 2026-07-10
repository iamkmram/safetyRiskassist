import React, { useState } from "react";

export const UploadModal: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number>(0);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles(dropped);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  // Dummy upload simulation
  const startUpload = () => {
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) clearInterval(interval);
    }, 100);
  };

  return (
    <div
      className="border-dashed border-2 p-4"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <h2>Upload Document</h2>
      <input type="file" multiple onChange={handleInput} />
      <button onClick={startUpload}>Start Upload</button>
      {progress > 0 && <div>Progress: {progress}%</div>}
      <ul>
        {files.map((f) => (
          <li key={f.name}>{f.name}</li>
        ))}
      </ul>
    </div>
  );
};
