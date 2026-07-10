import React from "react";

type Props = {
  onSelectFolder: (folder: string | null) => void;
};

const folders = ["Policies", "Procedures", "Country Guides", "Forms", "Templates"];

export const FolderNavigation: React.FC<Props> = ({ onSelectFolder }) => {
  return (
    <nav className="flex space-x-2 mt-2">
      <button onClick={() => onSelectFolder(null)}>All</button>
      {folders.map((f) => (
        <button key={f} onClick={() => onSelectFolder(f)}>
          {f}
        </button>
      ))}
    </nav>
  );
};
