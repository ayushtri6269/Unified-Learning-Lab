import React from 'react';

const SettingsPrompt = ({ actionProvider }) => {
  return (
    <div style={{
      padding: '10px',
      margin: '10px 0',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <p style={{ margin: '0 0 10px 0', color: '#495057' }}>
        <strong>💡 Tip:</strong> Use <strong>Backend AI (Default)</strong> for instant AI assistance without any API keys!
        Or configure an external AI provider (OpenAI, Gemini, etc.) in settings.
      </p>
      <button
        onClick={() => {
          // This will be handled by the parent component
          window.dispatchEvent(new CustomEvent('openSettings'));
        }}
        style={{
          padding: '8px 16px',
          backgroundColor: '#376B7E',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        ⚙️ Open Settings
      </button>
    </div>
  );
};

export default SettingsPrompt;
