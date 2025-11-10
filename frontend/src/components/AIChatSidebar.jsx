import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import aiService from '../services/aiService';
import { useToast } from './Toast';
import './AIChatSidebar.css';

const getInitialSidebarTheme = () => {
  if (typeof window === 'undefined') {
    return 'white';
  }

  const storedTheme = window.localStorage.getItem('aiSidebarColorTheme');
  return storedTheme === 'black' ? 'black' : 'white';
};

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const { showSuccess } = useToast();
  const match = /language-(\w+)/.exec(className || '');

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    showSuccess('Copied to clipboard!');
  };

  return !inline && match ? (
    <div className="code-block">
      <div className="code-block-header">
        <span>{match[1]}</span>
        <button onClick={handleCopy} className="copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Copy</span>
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const DEFAULT_SIDEBAR_WIDTH = 380;
const MIN_SIDEBAR_WIDTH = 280;
const MAX_SIDEBAR_WIDTH = 640;

const getInitialSidebarWidth = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_SIDEBAR_WIDTH;
  }

  const storedWidth = window.localStorage.getItem('aiSidebarWidth');
  const parsedWidth = storedWidth ? parseInt(storedWidth, 10) : Number.NaN;

  if (Number.isFinite(parsedWidth)) {
    return Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, parsedWidth));
  }

  return DEFAULT_SIDEBAR_WIDTH;
};

const getPointerClientX = (event) => {
  if (event.touches && event.touches.length) {
    return event.touches[0].clientX;
  }

  if (event.changedTouches && event.changedTouches.length) {
    return event.changedTouches[0].clientX;
  }

  return event.clientX;
};

function AIChatSidebar({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hi! I'm your AI learning assistant. Ask me anything about data structures, algorithms, or programming!" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(aiService.getModel());
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [colorTheme, setColorTheme] = useState(getInitialSidebarTheme);
  const [sidebarWidth, setSidebarWidth] = useState(getInitialSidebarWidth);
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef(null);
  const modelMenuRef = useRef(null);
  const sidebarRef = useRef(null);
  const resizeStartXRef = useRef(0);
  const resizeStartWidthRef = useRef(DEFAULT_SIDEBAR_WIDTH);
  const { showError, showInfo } = useToast();

  const modelDisplayName = useMemo(() => {
    const selected = models.find((model) => model.id === selectedModel);
    return selected
      ? `${selected.name}${selected.provider ? ` · ${selected.provider}` : ''}`
      : 'Select model';
  }, [models, selectedModel]);

  const selectedModelDescription = useMemo(() => {
    const selected = models.find((model) => model.id === selectedModel);
    return selected?.description || '';
  }, [models, selectedModel]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('aiSidebarColorTheme', colorTheme);
    }
  }, [colorTheme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('aiSidebarWidth', String(sidebarWidth));
    }
  }, [sidebarWidth]);

  useEffect(() => () => {
    document.body.classList.remove('ai-sidebar-resizing');
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      loadModels();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && isResizing) {
      setIsResizing(false);
    }
  }, [isOpen, isResizing]);

  useEffect(() => {
    if (!isResizing) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      const clientX = getPointerClientX(event);
      const delta = resizeStartXRef.current - clientX;
      const nextWidth = Math.min(
        MAX_SIDEBAR_WIDTH,
        Math.max(MIN_SIDEBAR_WIDTH, resizeStartWidthRef.current + delta)
      );

      setSidebarWidth(nextWidth);

      if (event.cancelable) {
        event.preventDefault();
      }
    };

    const stopResizing = () => {
      setIsResizing(false);
    };

    const touchMoveListenerOptions = { passive: false };

    document.body.classList.add('ai-sidebar-resizing');
    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseup', stopResizing);
    document.addEventListener('touchmove', handlePointerMove, touchMoveListenerOptions);
    document.addEventListener('touchend', stopResizing);
    document.addEventListener('touchcancel', stopResizing);

    return () => {
      document.body.classList.remove('ai-sidebar-resizing');
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseup', stopResizing);
      document.removeEventListener('touchmove', handlePointerMove, touchMoveListenerOptions);
      document.removeEventListener('touchend', stopResizing);
      document.removeEventListener('touchcancel', stopResizing);
    };
  }, [isResizing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target)) {
        setShowModelMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadModels = async () => {
    const availableModels = await aiService.fetchAvailableModels();
    const usableModels = availableModels.filter((model) => !model.comingSoon);
    setModels(usableModels);

    const storedModel = aiService.getModel();
    const isStoredModelAvailable = usableModels.some(
      (model) => model.id === storedModel && !model.comingSoon
    );

    let nextModel = storedModel;

    if (!isStoredModelAvailable) {
      const fallbackModel = usableModels.find((model) => !model.comingSoon);
      nextModel = fallbackModel ? fallbackModel.id : '';

      if (nextModel) {
        aiService.setModel(nextModel);
      }
    }

    setSelectedModel(nextModel);
  };

  const handleResizeStart = useCallback((event) => {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    const clientX = getPointerClientX(event);
    resizeStartXRef.current = clientX;
    resizeStartWidthRef.current = sidebarRef.current?.offsetWidth || sidebarWidth;
    setIsResizing(true);

    if (event.preventDefault) {
      event.preventDefault();
    }
  }, [sidebarWidth]);

  const handleResizeReset = useCallback(() => {
    setIsResizing(false);
    setSidebarWidth(DEFAULT_SIDEBAR_WIDTH);
  }, []);

  const handleModelSelect = (modelId) => {
    const selected = models.find((model) => model.id === modelId);

    if (!selected) {
      return;
    }

    if (selected.comingSoon) {
      const message = selected.description
        ? `${selected.name} - ${selected.description}`
        : `${selected.name} integration is coming soon.`;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'bot',
          text: `🚧 ${message}`
        }
      ]);
      showInfo(`${selected.name} is coming soon`);
      return;
    }

    setSelectedModel(modelId);
    aiService.setModel(modelId);
    setShowModelMenu(false);
    showInfo(`Switched to ${selected.name || modelId}`);
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiService.getResponse(inputMessage);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      showError(error.message);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: `⚠️ ${error.message}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      { id: 1, type: 'bot', text: "Chat cleared! How can I help you?" }
    ]);
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className={`ai-chat-sidebar ${isOpen ? 'open' : ''} ${colorTheme}`}
        style={{ '--ai-sidebar-width': `${sidebarWidth}px` }}
      >
        <div
          className="ai-sidebar-resize-handle"
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
          onDoubleClick={handleResizeReset}
          role="presentation"
          aria-hidden="true"
          title="Drag to resize sidebar. Double-click to reset."
        />
        <div className="ai-chat-header">
          <div className="ai-chat-title">
            <span className="ai-icon">🤖</span>
            <div>
              <h3>AI Assistant</h3>
            </div>
          </div>
          <div className="ai-chat-actions">
            <div className="ai-theme-toggle" role="group" aria-label="Sidebar color theme">
              <button
                type="button"
                className={`ai-theme-option ${colorTheme === 'white' ? 'active' : ''}`}
                onClick={() => setColorTheme('white')}
                aria-pressed={colorTheme === 'white'}
                title="Use white theme"
              >
                White
              </button>
              <button
                type="button"
                className={`ai-theme-option ${colorTheme === 'black' ? 'active' : ''}`}
                onClick={() => setColorTheme('black')}
                aria-pressed={colorTheme === 'black'}
                title="Use black theme"
              >
                Black
              </button>
            </div>
            <button
              className="ai-action-btn"
              onClick={handleClearChat}
              title="Clear chat"
            >
              🗑️
            </button>
            <button
              className="ai-action-btn ai-close-btn"
              onClick={onClose}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="ai-chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`ai-message ${msg.type}`}>
              <div className="ai-message-avatar">
                {msg.type === 'bot' ? '🤖' : '👤'}
              </div>
              <div className="ai-message-content">
                <div className="ai-message-text">
                  <ReactMarkdown
                    components={{
                      code: CodeBlock,
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message bot">
              <div className="ai-message-avatar">🤖</div>
              <div className="ai-message-content">
                <div className="ai-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-input-container">
          <div className="ai-chat-input-section">
            <div className="ai-chat-input-wrapper">
              <textarea
                className="ai-chat-input"
                placeholder="Ask me anything about CS..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                rows="1"
                disabled={isLoading}
              />
            </div>
            <div className="ai-chat-controls">
              <div className="ai-model-dropup" ref={modelMenuRef}>
                <button
                  type="button"
                  className="ai-model-toggle"
                  onClick={() => setShowModelMenu((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={showModelMenu}
                >
                  <div className="ai-model-label">
                    <span className="ai-model-name">{modelDisplayName}</span>
                    {selectedModelDescription && (
                      <span className="ai-model-description" title={selectedModelDescription}>
                        {selectedModelDescription}
                      </span>
                    )}
                  </div>
                  <span className="caret" aria-hidden="true">{showModelMenu ? '▴' : '▾'}</span>
                </button>
                {showModelMenu && (
                  <div className="ai-model-menu" role="listbox">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        className={`ai-model-menu-item ${selectedModel === model.id ? 'active' : ''}`}
                        onClick={() => handleModelSelect(model.id)}
                        role="option"
                        aria-selected={selectedModel === model.id}
                      >
                        <div className="ai-model-option-main">
                          <span className="ai-model-option-name">{model.name}</span>
                          {model.provider && <span className="ai-model-option-provider">{model.provider}</span>}
                        </div>
                        {model.description && (
                          <span className="ai-model-option-description">{model.description}</span>
                        )}
                        {model.comingSoon && <span className="badge">Coming soon</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="ai-send-btn"
                onClick={handleSend}
                disabled={!inputMessage.trim() || isLoading}
                title="Send message"
              >
                {isLoading ? (
                  <span className="ai-send-loading" aria-hidden="true">⏳</span>
                ) : (
                  <span className="ai-send-icon" aria-hidden="true">➤</span>
                )}
                <span className="sr-only">Send message</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AIChatSidebar;
