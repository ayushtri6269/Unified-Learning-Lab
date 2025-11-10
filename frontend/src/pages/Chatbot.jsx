import React, { useState, useEffect } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from '../chatbot/config';
import MessageParser from '../chatbot/MessageParser';
import ActionProvider from '../chatbot/ActionProvider';
import aiService from '../services/aiService';
import { useToast } from '../components/Toast';
import './Chatbot.css';

// This is a custom component to render the input area with the model selector
const CustomInput = ({ models, selectedModel, onModelChange, actionProvider }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim()) {
      actionProvider.handleAIResponse(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-input-wrapper">
      <select
        value={selectedModel}
        onChange={onModelChange}
        className="inline-model-selector"
      >
        {models.map(model => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        className="react-chatbot-kit-chat-input"
        placeholder="Ask me anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <button className="react-chatbot-kit-chat-btn-send" onClick={handleSubmit}>
        Send
      </button>
    </div>
  );
};

function ChatbotPage() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(aiService.getModel());
  const { showInfo } = useToast();

  useEffect(() => {
    const loadModels = async () => {
      const availableModels = await aiService.fetchAvailableModels();
      setModels(availableModels);
      if (availableModels.length > 0 && !aiService.getModel()) {
        const defaultModel = availableModels[0].id;
        aiService.setModel(defaultModel);
        setSelectedModel(defaultModel);
      }
    };
    loadModels();
  }, []);

  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    aiService.setModel(newModel);
    const model = models.find(m => m.id === newModel);
    if (model) {
      showInfo(`Switched to ${model.name}`);
    }
  };

  // Update the config to use the custom input component
  const updatedConfig = {
    ...config,
    customComponents: {
      chatInput: (props) => (
        <CustomInput
          {...props}
          models={models}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
        />
      ),
    },
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-header">
        <div>
          <h1>Learning Assistant Chatbot</h1>
          <p>Ask me anything about programming, data structures, and algorithms!</p>
        </div>
      </div>

      <div className="chatbot-container">
        <Chatbot
          config={updatedConfig}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      </div>
    </div>
  );
}

export default ChatbotPage;
