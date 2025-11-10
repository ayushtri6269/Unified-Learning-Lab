import React from 'react';
import { FaRobot } from 'react-icons/fa';
import './AIAssistantButton.css';

const AIAssistantButton = ({ onClick }) => {
  return (
    <button className="ai-assistant-button" onClick={onClick} title="Open AI Assistant">
      <FaRobot />
    </button>
  );
};

export default AIAssistantButton;
