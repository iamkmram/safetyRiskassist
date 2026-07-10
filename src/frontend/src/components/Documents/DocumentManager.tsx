import React, { useState } from "react";
import { DocumentCard } from "./DocumentCard";
import { UploadModal } from "./UploadModal";
import { FolderNavigation } from "./FolderNavigation";
import { mockDocuments } from "../../utils/mockData";

export const DocumentManager: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [filterFolder, setFilterFolder] = useState<string | null>(null);

  const filteredDocs = filterFolder
    ? mockDocuments.filter((d) => d.folder === filterFolder)
    : mockDocuments;

  return (
    <div className="p-4">
      <h1>Document Management</h1>
      <button onClick={() => setShowUpload(true)}>Upload Document</button>
      {showUpload && <UploadModal />}
      <FolderNavigation onSelectFolder={setFilterFolder} />
      <div className="grid grid-cols-3 gap-4 mt-4">
        {filteredDocs.map((doc: any) => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            onClick={() => console.log("open", doc.id)}
          />
        ))}
      </div>
    </div>
  );
};
