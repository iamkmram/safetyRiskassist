import React from "react";
import { Document } from '../../types/api.types';

type Props = {
  doc: Document;
  onClick: () => void;
};

export const DocumentCard: React.FC<Props> = ({ doc, onClick }) => {
  // Simple thumbnail based on file type
  const thumbnail = doc.fileType === "PDF" ? "" : "";

  return (
    <div className="border p-2 cursor-pointer" onClick={onClick}>
      <div className="text-3xl">{thumbnail}</div>
      <h3 className="font-bold">{doc.title}</h3>
      <p>{doc.fileName}</p>
      <p>{doc.fileSize}  {new Date(doc.uploadDate).toLocaleDateString()}</p>
    </div>
  );
};
