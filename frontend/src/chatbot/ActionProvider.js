import { createChatBotMessage } from 'react-chatbot-kit';
import aiService from '../services/aiService';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  // Handle AI-powered responses
  handleAIResponse = async (userMessage) => {
    try {
      // Show typing indicator
      const typingMessage = this.createChatBotMessage("Thinking...");
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, typingMessage],
      }));

      // Get conversation history for context
      const conversationHistory = this.getConversationHistory();

      // Get AI response
      const aiResponse = await aiService.getResponse(userMessage, conversationHistory);

      // Remove typing indicator and add AI response
      this.setState((prev) => {
        const messagesWithoutTyping = prev.messages.slice(0, -1);
        const responseMessage = this.createChatBotMessage(aiResponse);
        return {
          ...prev,
          messages: [...messagesWithoutTyping, responseMessage],
        };
      });
    } catch (error) {
      // Remove typing indicator
      this.setState((prev) => ({
        ...prev,
        messages: prev.messages.slice(0, -1),
      }));

      // Show user-friendly error message
      let errorMsg = 'Sorry, I encountered an error. Please try again.';

      if (error.message?.includes('login')) {
        errorMsg = 'Please login to use the AI assistant. Click on your profile in the top-right corner to login.';
      } else if (error.message?.includes('session') || error.message?.includes('expired')) {
        errorMsg = 'Your session has expired. Please logout and login again to continue.';
      } else if (error.message?.includes('backend') || error.message?.includes('server')) {
        errorMsg = 'Cannot connect to server. Please make sure the backend is running on port 5001.';
      } else if (error.message) {
        errorMsg = error.message;
      }

      const errorMessage = this.createChatBotMessage(errorMsg);
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    }
  };

  getConversationHistory = () => {
    // This would be implemented to extract conversation history from state
    // For now, return empty array
    return [];
  };

  handleHello = () => {
    const message = this.createChatBotMessage("Hello! Nice to meet you. What would you like to learn about today?");
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleDataStructures = () => {
    const message = this.createChatBotMessage(
      "Data structures are fundamental concepts in computer science. Common ones include arrays, linked lists, stacks, queues, trees, graphs, and hash tables. Which one interests you?"
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleAlgorithms = () => {
    const message = this.createChatBotMessage(
      "Algorithms are step-by-step procedures for calculations. We have sorting algorithms (like quicksort, mergesort), searching algorithms (like binary search), and many more. What type are you curious about?"
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleBinaryTree = () => {
    const message = this.createChatBotMessage(
      "A binary tree is a tree data structure where each node has at most two children. It's used for efficient searching and sorting. Check out our Binary Tree visualizer to see it in action!"
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleStack = () => {
    const message = this.createChatBotMessage(
      "A stack is a linear data structure that follows the Last In First Out (LIFO) principle. Operations include push (add) and pop (remove). Great for undo functionality!"
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleQueue = () => {
    const message = this.createChatBotMessage(
      "A queue is a linear data structure that follows the First In First Out (FIFO) principle. Operations include enqueue (add) and dequeue (remove). Used in scheduling and breadth-first search."
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleLinkedList = () => {
    const message = this.createChatBotMessage(
      "A linked list is a linear data structure where elements are stored in nodes, each pointing to the next. Good for dynamic memory allocation and insertions/deletions."
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleHashTable = () => {
    const message = this.createChatBotMessage(
      "A hash table (or hash map) uses a hash function to map keys to values for efficient lookups. Average O(1) time complexity for search, insert, and delete operations."
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleSorting = () => {
    const message = this.createChatBotMessage(
      "Sorting algorithms arrange elements in a specific order. Common ones: Bubble Sort (O(n²)), Quick Sort (O(n log n)), Merge Sort (O(n log n)). Try our Sorting Visualizer!"
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleSearching = () => {
    const message = this.createChatBotMessage(
      "Searching algorithms find elements in data structures. Linear Search (O(n)) checks each element, Binary Search (O(log n)) works on sorted arrays. Check our Searching Visualizer!"
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleDefault = () => {
    const message = this.createChatBotMessage(
      "I'm here to help with data structures and algorithms! Try asking about stacks, queues, trees, sorting, searching, or any other CS concepts."
    );
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };
}

export default ActionProvider;
