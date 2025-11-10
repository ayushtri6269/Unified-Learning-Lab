import React, { useState } from 'react';
import aiService, { AI_PROVIDERS } from '../services/aiService';
import './Settings.css';

function Settings({ onClose }) {
  const [provider, setProvider] = useState(aiService.getProvider());
  const [apiKey, setApiKey] = useState(aiService.getApiKey());
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    aiService.setProvider(provider);
    aiService.setApiKey(apiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      if (onClose) onClose();
    }, 2000);
  };

  const handleClear = () => {
    setApiKey('');
    aiService.setApiKey('');
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>⚙️ Chatbot Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          <div className="setting-group">
            <label htmlFor="provider">AI Provider</label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="setting-input"
            >
              <option value={AI_PROVIDERS.BACKEND}>Backend AI (Default - No API Key Required)</option>
              <option value={AI_PROVIDERS.OPENAI}>OpenAI (GPT-3.5/4)</option>
              <option value={AI_PROVIDERS.GEMINI}>Google Gemini</option>
              <option value={AI_PROVIDERS.ANTHROPIC}>Anthropic (Claude)</option>
              <option value={AI_PROVIDERS.HUGGINGFACE}>HuggingFace</option>
            </select>
            <small className="help-text">
              Backend AI is our built-in assistant - no setup required!
            </small>
          </div>

          <div className="setting-group">
            <label htmlFor="apiKey">API Key {provider !== AI_PROVIDERS.BACKEND && <span className="required">*</span>}</label>
            <div className="api-key-input-group">
              <input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={provider === AI_PROVIDERS.BACKEND ? 'Not required for Backend AI' : 'Enter your API key'}
                className="setting-input"
                disabled={provider === AI_PROVIDERS.BACKEND}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="toggle-visibility-btn"
                disabled={provider === AI_PROVIDERS.BACKEND}
              >
                {showApiKey ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <small className="help-text">
              {provider === AI_PROVIDERS.BACKEND
                ? 'Backend AI uses our server - no API key needed!'
                : 'Your API key is stored locally and never sent to our servers.'
              }
            </small>
          </div>

          <div className="api-info">
            <h3>How to get API keys:</h3>
            <ul>
              <li>
                <strong>OpenAI:</strong> <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com/api-keys</a>
              </li>
              <li>
                <strong>Google Gemini:</strong> <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">makersuite.google.com/app/apikey</a>
              </li>
              <li>
                <strong>Anthropic:</strong> <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">console.anthropic.com/settings/keys</a>
              </li>
              <li>
                <strong>HuggingFace:</strong> <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">huggingface.co/settings/tokens</a>
              </li>
            </ul>
          </div>

          <div className="settings-actions">
            <button onClick={handleClear} className="clear-btn">
              Clear API Key
            </button>
            <button onClick={handleSave} className="save-btn">
              {saved ? '✓ Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
