import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Common/Layout";
import { mockDocuments } from "../../utils/mockData";

export const DocumentViewer: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const doc = mockDocuments.find((d) => d.id === documentId);

  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [annotations, setAnnotations] = useState<string[]>([]);

  if (!doc) return <div>Document not found</div>;

  const handleZoomIn = () => setZoom((z) => z + 0.1);
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const addAnnotation = (note: string) => setAnnotations((a) => [...a, note]);

  return (
    <Layout>
      <h2>{doc.title}</h2>
      {/* Simple viewer placeholder */}
      <div style={{ transform: `scale(${zoom})`, border: "1px solid #ccc", padding: "1rem" }}>
        <p>Viewing {doc.fileName} ({doc.fileType})</p>
      </div>

      {/* Controls */}
      <div className="mt-2">
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
        <input
          placeholder="Search in document"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => addAnnotation(`Note at ${new Date().toISOString()}`)}>
          Add Annotation
        </button>
      </div>

      {/* Annotations list */}
      <ul className="mt-2">
        {annotations.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </Layout>
  );
};
