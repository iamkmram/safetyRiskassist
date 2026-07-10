import React from "react";
import { useNavigate } from "react-router-dom";
import { quickActions } from "../../utils/mockData";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = (query: string) => {
    navigate("/chat", { state: { prefilledQuery: query } });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {quickActions.map((action: any, idx: number) => (
        <button
          key={idx}
          className="p-4 bg-blue-50 rounded hover:bg-blue-100 text-left"
          onClick={() => handleClick(action.query)}
        >
          <h4 className="font-medium">{action.title}</h4>
          <p className="text-sm text-gray-600">{action.description}</p>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
