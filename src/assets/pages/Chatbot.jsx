import React from 'react';
import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import "./Chatbot.css";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError 
      ? <div style={{color: 'red', padding: '20px'}}>Chatbot failed to load</div> 
      : this.props.children;
  }
}

const Chatbot = () => {
  const [isMinimized, setIsMinimized] = useState(false);  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [genAI, setGenAI] = useState(null);
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize API and model
  useEffect(() => {
    const apiKey = "AIzaSyBgA_v1XJTk2kK642QK_M0D0e-6INhVFmI"; // Replace with your actual API key
    
    try {
      const genAIClient = new GoogleGenerativeAI(apiKey);
      setGenAI(genAIClient);
      setModel(genAIClient.getGenerativeModel({ model: "gemini-1.5-flash" }));
      
      // Add welcome message
      setMessages([{
        sender: "bot",
        text: "Hello! I'm your safety assistant. How can I help you today?",
        timestamp: new Date(),
        isLoading: false
      }]);
    } catch (error) {
      console.error("Failed to initialize AI:", error);
      setMessages([{
        sender: "bot",
        text: "Failed to initialize chatbot. Please check console for errors.",
        timestamp: new Date(),
        isLoading: false
      }]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !model || isLoading) return;
    
    const userMessage = {
      sender: "user",
      text: inputMessage,
      timestamp: new Date(),
      isLoading: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const result = await model.generateContent({
        contents: [{ 
          role: "user",
          parts: [{ text: inputMessage }]
        }]
      });
      
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: text,
          timestamp: new Date(),
          isLoading: false
        }
      ]);
    } catch (error) {
      console.error("Error generating content:", error);
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
          isLoading: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
        <div className="chatbot-header">
          <h3>Safety Assistant</h3>
          <button onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? '↑' : '↓'}
          </button>
        </div>
        
        {!isMinimized && (
          <>
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.isLoading ? (
                    <div className="loading-dots">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </div>
                  ) : (
                    <>
                      <p>{msg.text}</p>
                      <small>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <div className="chatbot-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about safety or routes..."
                disabled={isLoading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
              >
                {isLoading ? '...' : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Chatbot;