
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ChatMessage, Topic, Avatar } from './types';
import { getAiResponse, streamAiResponse, validateApiKey } from './services/aiService';
import { ChatBubble } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';
import WelcomeModal from './components/WelcomeModal';
import { ApiKeyInputBubble } from './components/ApiKeyInputBubble';
import ApiKeyModal from './components/ApiKeyModal';


const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 017.743-5.743z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const SarthiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>;
const AalochakIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75v3.75m-3.75-3.75v3.75m-3.75-3.75v3.75m9.75-12.75h1.5a.75.75 0 000-1.5h-1.5v1.5zm-3.75 0h1.5a.75.75 0 000-1.5h-1.5v1.5zm-3.75 0h1.5a.75.75 0 000-1.5h-1.5v1.5zM15 3.75H9A2.25 2.25 0 006.75 6v12A2.25 2.25 0 009 20.25h6A2.25 2.25 0 0017.25 18V6A2.25 2.25 0 0015 3.75zm-3.75 6h.008v.008H11.25v-.008z" /></svg>;
const VidyasagarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const ChitrakarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
const ManthanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622 3.385m3.388 1.62a15.998 15.998 0 00-1.622-3.385m0 0a3 3 0 10-5.78-1.128 2.25 2.25 0 012.4-2.245 4.5 4.5 0 00-8.4 2.245c0 .399.078.78.22 1.128m8.18 2.245a15.998 15.998 0 01-3.388 1.62m5.043.025a15.998 15.998 0 00-1.622-3.385m-5.043-.025a15.998 15.998 0 01-1.622 3.385m-3.388-1.62a15.998 15.998 0 011.622-3.385" /></svg>;


type Theme = 'dark-purple' | 'light' | 'midnight-blue';

const App: React.FC = () => {
    const topics: Topic[] = [
      { id: 'sarthi', name: 'सारथी (Sarthi)', description: 'The general router for all your queries', icon: <SarthiIcon /> },
      { id: 'aalochak', name: 'आलोचक (Aalochak)', description: 'Entertainment expert for movies & music', icon: <AalochakIcon /> },
      { id: 'vidyasagar', name: 'विद्यासागर (Vidyasagar)', description: 'Learning assistant for any subject', icon: <VidyasagarIcon /> },
      { id: 'chitrakar', name: 'चित्रकार (Chitrakar)', description: 'Analyze an image with your prompt', icon: <ChitrakarIcon /> },
      { id: 'manthan', name: 'मंथन (Manthan)', description: 'Deep thinking for complex problems', icon: <ManthanIcon /> },
    ];
  
    const avatars: Avatar[] = [
      { id: 'classic', name: 'Classic', url: null },
      { id: 'goli-master', name: 'Goli Master', url: 'https://nmgstudio.github.io/Rozgar/assets/images/Avatar1.png' },
      { id: 'alpha-wolf', name: 'Alpha Wolf', url: 'https://nmgstudio.github.io/Rozgar/assets/images/Avatar2.png' },
      { id: 'sakura-dreams', name: 'Sakura Dreams', url: 'https://nmgstudio.github.io/Rozgar/assets/images/Avatar8.jpg' },
      { id: 'twilight-bloom', name: 'Twilight Bloom', url: 'https://nmgstudio.github.io/Rozgar/assets/images/Avatar9.jpg' },
      { id: 'red-steel', name: 'Red Steel', url: 'https://nmgstudio.github.io/Rozgar/assets/images/Avatar3.png' },
      { id: 'emberdrake', name: 'Emberdrake', url: 'https://nmgstudio.github.io/Rozgar/assets/images/Avatar4.png' },
      { id: 'urban-voyager', name: 'Urban Voyager', url: 'https://nmgstudio.github.io/Rozgar/assets/images/Avatar5.png' },
      { id: 'synthwave-rider', name: 'Synthwave Rider', url: 'https://nmgstudio.github.io/Rozgar/assets/images/Avatar6.jpg' },
      { id: 'holi-spirit', name: 'Holi Spirit', url: 'https://nmgstudio.github.io/Rozgar/assets/images/Avatar7.jpg' },
      { id: 'glitch-gem', name: 'Glitch Gem', url: 'https://nmgstudio.github.io/Rozgar/assets/images/AvatarX.png' },
    ];

    const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('userApiKey'));
    const [apiProvider, setApiProvider] = useState<string | null>(() => localStorage.getItem('userApiProvider'));
    const [selectedTopic, setSelectedTopic] = useState<string>(() => localStorage.getItem('selectedTopic') || 'sarthi');
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const savedKey = localStorage.getItem('userApiKey');
        if (!savedKey) {
            return [{
                id: 'api-key-prompt',
                author: 'model',
                type: 'api-key-request',
                text: "To get started, please provide your Google Gemini API key. Bodh will use your key to answer questions. Your key is stored locally in your browser and is never sent to our servers."
            }];
        }

        try {
            const savedMessages = localStorage.getItem('chatHistory');
            if (savedMessages) {
                const parsedMessages = JSON.parse(savedMessages);
                if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
                    return parsedMessages;
                }
            }
        } catch (error) {
            console.error("Failed to load or parse chat history from localStorage", error);
            localStorage.removeItem('chatHistory');
        }

        const currentTopic = topics.find(t => t.id === (localStorage.getItem('selectedTopic') || 'sarthi'));
        return [{
            id: 'initial-greeting',
            author: 'model',
            text: `Hello! You are now in ${currentTopic?.name} mode. How can I assist you today?`,
            suggestions: [
                "What are the IAVM Awards?",
                "Suggest a good sci-fi movie",
                "How do I learn about black holes?",
                "Who won the 2025 Filmfare award for best film?"
            ]
        }];
    });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('chatTheme') as Theme) || 'light');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(() => localStorage.getItem('selectedAvatarId') || 'classic');
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const modelMenuContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!apiKey) {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeMessage');
      if (!hasSeenWelcome) {
          setShowWelcome(true);
      }
    }
  }, [apiKey]);

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
    localStorage.setItem('chatTheme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('selectedAvatarId', selectedAvatarId);
  }, [selectedAvatarId]);

  useEffect(() => {
    try {
      if (apiKey) {
        localStorage.setItem('chatHistory', JSON.stringify(messages.map(m => ({ ...m, isStreaming: false }))));
        localStorage.setItem('selectedTopic', selectedTopic);
      }
    } catch (error) {
      console.error("Failed to save chat history to localStorage:", error);
    }
  }, [messages, selectedTopic, apiKey]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
            setConfirmingClear(false);
        }
        if (modelMenuContainerRef.current && !modelMenuContainerRef.current.contains(event.target as Node)) {
            setIsModelMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleApiKeySubmit = async (submittedKey: string, submittedProvider: string) => {
      setIsLoading(true);
      setError(null);
      
      setMessages(prev => prev.filter(m => m.type !== 'api-key-request'));
      
      const isValid = await validateApiKey(submittedKey);
      setIsLoading(false);

      if (isValid) {
          setApiKey(submittedKey);
          setApiProvider(submittedProvider);
          localStorage.setItem('userApiKey', submittedKey);
          localStorage.setItem('userApiProvider', submittedProvider);
          
          const currentTopic = topics.find(t => t.id === selectedTopic);
          setMessages([{
              id: 'initial-greeting',
              author: 'model',
              text: `API key verified successfully! You are now in ${currentTopic?.name} mode. How can I assist you today?`
          }]);
      } else {
          const errorPrompt: ChatMessage = {
              id: 'api-key-prompt-error',
              author: 'model',
              type: 'api-key-request',
              text: "The provided API key appears to be invalid for Google Gemini. Please check your key and try again. For other providers, functionality is coming soon."
          };
          setMessages([errorPrompt]);
      }
  };

  const handleSendMessage = async (userMessage: string, image?: { data: string; mimeType: string; }) => {
    if (!apiKey) {
        setError("Please provide a valid API key to begin.");
        return;
    }
    setError(null);
    const newUserMessage: ChatMessage = { 
        id: `user-${Date.now()}`, 
        author: 'user', 
        text: userMessage,
        image,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    
    setIsLoading(true);

    const streamingTopics = ['sarthi', 'manthan', 'chitrakar'];
    if (streamingTopics.includes(selectedTopic)) {
        const modelMessageId = `model-${Date.now()}`;
        const placeholder: ChatMessage = { id: modelMessageId, author: 'model', text: '', isStreaming: true };
        setMessages(prev => [...prev, placeholder]);

        try {
            const stream = streamAiResponse(userMessage, selectedTopic, apiKey, image);
            let accumulatedText = '';
            for await (const chunk of stream) {
                accumulatedText = chunk;
                setMessages(prev => prev.map(msg => 
                    msg.id === modelMessageId ? { ...msg, text: accumulatedText } : msg
                ));
            }
        } catch (err) {
            console.error("An error occurred while streaming a message:", err);
            setMessages(prev => prev.filter(msg => msg.id !== modelMessageId));

            let userFriendlyMessage = "An unexpected error occurred. Please try again later.";
            let bannerMessage = "An error occurred.";

            if (err instanceof Error) {
                const lowerCaseMessage = err.message.toLowerCase();
                 if (lowerCaseMessage.includes('network') || lowerCaseMessage.includes('failed to fetch')) {
                    bannerMessage = "Network error. Please check your connection.";
                    userFriendlyMessage = "I'm having trouble reaching the network. Please check your internet connection and try again.";
                } else if (lowerCaseMessage.includes('429')) {
                    bannerMessage = "Service is busy. Please try again shortly.";
                    userFriendlyMessage = "The AI service is experiencing high traffic right now. Please wait a moment before sending another message.";
                } else if (lowerCaseMessage.includes('api key')) {
                    bannerMessage = "API Key Error";
                    userFriendlyMessage = "The provided API key seems to be invalid or has insufficient permissions. Please verify your key.";
                } else {
                    bannerMessage = "An unexpected error occurred.";
                    userFriendlyMessage = err.message;
                }
            }
            
            setError(bannerMessage);
            const errorModelMessage: ChatMessage = { id: `error-${Date.now()}`, author: 'model', text: userFriendlyMessage };
            setMessages((prevMessages) => [...prevMessages, errorModelMessage]);
        } finally {
            setIsLoading(false);
            setMessages(prev => prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, isStreaming: false } : msg
            ));
        }

    } else { // Non-streaming topics
        try {
            const response = await getAiResponse(userMessage, selectedTopic, apiKey, image);
            const { text: modelResponseText, sources, movies, songs, list } = response;
            const newModelMessage: ChatMessage = {
                id: `model-${Date.now()}`,
                author: 'model',
                text: modelResponseText,
                sources: sources && sources.length > 0 ? sources : undefined,
                movies: movies && movies.length > 0 ? movies : undefined,
                songs: songs && songs.length > 0 ? songs : undefined,
                list: list && list.items.length > 0 ? list : undefined,
            };
            setMessages((prevMessages) => [...prevMessages, newModelMessage]);

        } catch (err) {
            console.error("An error occurred while sending a message:", err);
            let userFriendlyMessage = "An unexpected error occurred. Please try again later. If the issue persists, feel free to contact support via the main website.";
            let bannerMessage = "An unexpected error occurred.";
            if (err instanceof Error) {
                const lowerCaseMessage = err.message.toLowerCase();
                 if (lowerCaseMessage.includes('network') || lowerCaseMessage.includes('failed to fetch')) {
                    bannerMessage = "Network error. Please check your connection.";
                    userFriendlyMessage = "I'm having trouble reaching the network. Please check your internet connection and try again.";
                } else if (lowerCaseMessage.includes('api key')) {
                    bannerMessage = "API Key Error";
                    userFriendlyMessage = "The provided API key seems to be invalid or has insufficient permissions. Please verify your key.";
                } else {
                    bannerMessage = "An unexpected error occurred.";
                    userFriendlyMessage = err.message;
                }
            }
            setError(bannerMessage);
            const errorModelMessage: ChatMessage = { id: `error-${Date.now()}`, author: 'model', text: userFriendlyMessage };
            setMessages((prevMessages) => [...prevMessages, errorModelMessage]);
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.id === messageId) {
          const newFeedback = msg.feedback === feedback ? null : feedback;
          return { ...msg, feedback: newFeedback };
        }
        return msg;
      })
    );
  };

  const handleSuggestionSubmit = (messageId: string, suggestion: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.id === messageId) {
          return { ...msg, suggestion };
        }
        return msg;
      })
    );
  };
  
    const handleSuggestionClick = (suggestionText: string, messageId: string) => {
        setMessages(prev => prev.map(msg => 
            msg.id === messageId ? { ...msg, suggestions: undefined } : msg
        ));
        handleSendMessage(suggestionText);
    };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the entire chat history? This action cannot be undone.")) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setCurrentlyPlayingId(null);
        const currentTopic = topics.find(t => t.id === selectedTopic);
        const initialMessage: ChatMessage = { 
            id: 'initial-greeting', 
            author: 'model', 
            text: `Hello! You are now in ${currentTopic?.name} mode. How can I assist you today?` 
        };
        setMessages([initialMessage]);
        localStorage.removeItem('chatHistory');
        setIsMenuOpen(false);
    }
  };
  
  const handleModelChange = (newTopicId: string) => {
    if (newTopicId === selectedTopic) {
        setIsModelMenuOpen(false);
        return;
    }

    const isChatStarted = messages.some(msg => msg.author === 'user' || (messages.length > 1 && msg.id !== 'api-key-prompt'));
    
    if (isChatStarted && !window.confirm("Switching models will start a new chat and clear your current conversation. Are you sure?")) {
        setIsModelMenuOpen(false);
        return;
    }
    
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    setCurrentlyPlayingId(null);

    setSelectedTopic(newTopicId);
    const newTopic = topics.find(t => t.id === newTopicId);
    setMessages([{
        id: `initial-greeting-${newTopicId}`,
        author: 'model',
        text: `Hello! You are now in ${newTopic?.name} mode. How can I assist you today?`,
    }]);
    setIsModelMenuOpen(false);
  };

  const handleShareChat = async () => {
    const chatText = messages.map(msg => `${msg.author === 'user' ? 'You' : 'Bodh'}: ${msg.text}`).join('\n\n');
    const shareData = {
      title: 'Chat with Bodh AI',
      text: chatText,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(chatText);
        alert('Chat copied to clipboard!');
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.log('Share action was cancelled by the user.');
      } else {
        console.error('Error sharing chat:', err);
        try {
          await navigator.clipboard.writeText(chatText);
          alert('Sharing failed. Chat copied to clipboard instead.');
        } catch (copyErr) {
          console.error('Failed to copy chat to clipboard as fallback:', copyErr);
          alert('Sharing failed and could not copy to clipboard.');
        }
      }
    }
    setIsMenuOpen(false);
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsMenuOpen(false);
  };
  
  const handleSetAvatar = (avatarId: string) => {
    setSelectedAvatarId(avatarId);
    setIsMenuOpen(false);
  };

  const handleManageApiKeyClick = () => {
    setConfirmingClear(true);
  };

  const handleCancelClear = () => {
      setConfirmingClear(false);
  };

  const handleConfirmClear = () => {
      setApiKey(null);
      setApiProvider(null);
      localStorage.removeItem('userApiKey');
      localStorage.removeItem('userApiProvider');
      localStorage.removeItem('chatHistory');
      
      setMessages([{
          id: 'api-key-prompt-reset',
          author: 'model',
          type: 'api-key-request',
          text: "Your API key has been cleared. Please provide a new key to continue."
      }]);
      setConfirmingClear(false);
      setIsMenuOpen(false);
  };
  
  const handleToggleTTS = (messageId: string, text: string) => {
      if (!('speechSynthesis' in window)) {
          alert("Sorry, your browser doesn't support text-to-speech.");
          return;
      }
      const synth = window.speechSynthesis;
      if (synth.speaking && currentlyPlayingId === messageId) {
          synth.cancel();
          setCurrentlyPlayingId(null);
          return;
      }
      if (synth.speaking) {
          synth.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onend = () => {
          setCurrentlyPlayingId(null);
      };
      utterance.onerror = (event) => {
          console.error("SpeechSynthesisUtterance.onerror", event);
          setCurrentlyPlayingId(null);
      };
      setCurrentlyPlayingId(messageId);
      synth.speak(utterance);
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcomeMessage', 'true');
  };

  const themes: { id: Theme, name: string, color: string, ring?: string }[] = [
      { id: 'dark-purple', name: 'Dark Purple', color: '#7C3AED' },
      { id: 'light', name: 'Light', color: '#E5E7EB', ring: 'ring-1 ring-gray-400' },
      { id: 'midnight-blue', name: 'Midnight Blue', color: '#238636' },
  ];

  const currentTopic = topics.find(t => t.id === selectedTopic);
  const selectedAvatar = avatars.find(a => a.id === selectedAvatarId) || avatars[0];

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}
      <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
      <header className="p-4 bg-[var(--header-bg)] backdrop-blur-sm border-b border-[var(--border-color)] shadow-lg flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <img src="https://nondescriptmg.github.io/calculate/bodh/logo.png" alt="Bodh AI Logo" className="w-[55px] h-[55px] relative bottom-0.5" />
            <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Bodh</h1>
                <p className="text-xs text-[var(--text-secondary)]">AI for Indus Audio Visual Media</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative" ref={modelMenuContainerRef}>
                <button 
                    onClick={() => setIsModelMenuOpen(prev => !prev)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:ring-offset-1 focus:ring-offset-[var(--bg-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-accent-hover)]"
                    aria-label="Select Model"
                    aria-haspopup="true"
                    aria-expanded={isModelMenuOpen}
                    disabled={!apiKey}
                >
                    {currentTopic?.icon}
                    <span>{currentTopic?.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div
                    className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[var(--menu-bg)] ring-1 ring-black ring-opacity-5 focus:outline-none z-20 transition-all duration-150 ease-out ${isModelMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                    role="menu" aria-orientation="vertical"
                >
                    <div className="py-1" role="none">
                        <div className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Select Model</div>
                        {topics.map(topic => (
                            <button 
                                key={topic.id} 
                                onClick={() => handleModelChange(topic.id)} 
                                className="w-full text-left flex items-center justify-between gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--menu-item-hover-bg)]" 
                                role="menuitem"
                            >
                               <div className="flex items-center gap-3">
                                 {topic.icon}
                                 <span>{topic.name}</span>
                               </div>
                               {selectedTopic === topic.id && <CheckIcon />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative" ref={menuContainerRef}>
                <button 
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className="p-2 rounded-md text-[var(--icon-color)] hover:text-[var(--icon-color-hover)] hover:bg-[var(--bg-accent-hover)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--ring-color)]" 
                    aria-label="Open menu"
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div
                    className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[var(--menu-bg)] ring-1 ring-black ring-opacity-5 focus:outline-none z-20 transition-all duration-150 ease-out ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                    role="menu" aria-orientation="vertical" aria-labelledby="menu-button"
                >
                    <div className="py-1" role="none">
                        <div className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Actions</div>
                        <button onClick={handleShareChat} disabled={!apiKey} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--menu-item-hover-bg)] disabled:opacity-50" role="menuitem">
                            <ShareIcon /><span>Share Chat</span>
                        </button>
                        <button onClick={handleClearChat} disabled={!apiKey} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--menu-item-hover-bg)] disabled:opacity-50" role="menuitem">
                            <TrashIcon /><span>Clear Chat</span>
                        </button>
                        <div className="border-t border-[var(--border-color)] my-1"></div>
                        <div className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Account</div>
                        {!confirmingClear ? (
                            <button onClick={handleManageApiKeyClick} disabled={!apiKey} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--menu-item-hover-bg)] disabled:opacity-50" role="menuitem">
                                <KeyIcon /><span>Manage API Key</span>
                            </button>
                        ) : (
                            <div className="px-2 py-1">
                                <p className="text-xs text-center text-[var(--text-secondary)] mb-2">Are you sure? This will clear your key and chat history.</p>
                                <div className="flex gap-2">
                                    <button onClick={handleCancelClear} className="w-full text-center px-2 py-1 text-sm rounded-md bg-[var(--bg-accent-hover)] text-[var(--text-primary)] hover:opacity-80">
                                        Cancel
                                    </button>
                                    <button onClick={handleConfirmClear} className="w-full text-center px-2 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700">
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="border-t border-[var(--border-color)] my-1"></div>
                        <a href="https://iavma.in" target="_blank" rel="noopener noreferrer" className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--menu-item-hover-bg)]" role="menuitem">
                            <ExternalLinkIcon/> <span>IAVMA Website</span>
                        </a>
                        <a href="https://www.youtube.com/@nmgindus" target="_blank" rel="noopener noreferrer" className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--menu-item-hover-bg)]" role="menuitem">
                            <ExternalLinkIcon/> <span>NMG Indus YouTube</span>
                        </a>
                        <div className="border-t border-[var(--border-color)] my-1"></div>
                        <div className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Theme</div>
                         {themes.map(t => (
                            <button key={t.id} onClick={() => handleSetTheme(t.id)} className="w-full text-left flex items-center justify-between gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--menu-item-hover-bg)]" role="menuitem">
                               <div className="flex items-center gap-3">
                                 <span className={`w-4 h-4 rounded-full ${t.ring || ''}`} style={{ backgroundColor: t.color }}></span>
                                 <span>{t.name}</span>
                               </div>
                               {theme === t.id && <CheckIcon />}
                            </button>
                         ))}
                        <div className="border-t border-[var(--border-color)] my-1"></div>
                        <div className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Avatar</div>
                        <div className="max-h-48 overflow-y-auto">
                            {avatars.map(avatar => (
                                <button
                                    key={avatar.id}
                                    onClick={() => handleSetAvatar(avatar.id)}
                                    className="w-full text-left flex items-center justify-between gap-3 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--menu-item-hover-bg)]"
                                    role="menuitem"
                                >
                                    <div className="flex items-center gap-3">
                                        {avatar.url ? (
                                            <img src={avatar.url} alt={avatar.name} className="w-6 h-6 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-[var(--bg-disabled)] flex items-center justify-center text-[var(--user-bubble-text)] flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            </div>
                                        )}
                                        <span>{avatar.name}</span>
                                    </div>
                                    {selectedAvatarId === avatar.id && <CheckIcon />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) =>
            msg.type === 'api-key-request' ? (
                <ApiKeyInputBubble 
                    key={msg.id} 
                    message={msg} 
                    onSubmit={handleApiKeySubmit}
                    onShowApiKeyInfo={() => setIsApiKeyModalOpen(true)}
                />
            ) : (
                <ChatBubble 
                  key={msg.id} 
                  message={msg} 
                  onFeedback={handleFeedback} 
                  onSuggestionSubmit={handleSuggestionSubmit}
                  onSuggestionClick={handleSuggestionClick}
                  currentlyPlayingId={currentlyPlayingId}
                  onToggleTTS={handleToggleTTS}
                  userAvatarUrl={selectedAvatar.url}
                />
            )
          )
        )}
        {isLoading && !messages.some(m => m.isStreaming) && (
            <div className="flex items-start gap-4 p-4">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <img src="https://nondescriptmg.github.io/calculate/bodh/logo.png" alt="Bodh AI Logo" className="w-full h-full object-contain" />
                </div>
                <div className="max-w-xl px-5 py-3 rounded-2xl shadow-md bg-[var(--model-bubble-bg)] text-[var(--model-bubble-text)] rounded-tl-none flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 bg-[var(--text-secondary)] rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2.5 h-2.5 bg-[var(--text-secondary)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2.5 h-2.5 bg-[var(--text-secondary)] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {error && (
        <div className="p-3 mx-4 mb-2 text-sm text-[var(--error-text)] bg-[var(--error-bg)] rounded-lg flex items-center justify-between gap-4">
            <span className="break-words">{error}</span>
            <button onClick={() => setError(null)} aria-label="Dismiss error" className="p-1 rounded-full hover:bg-black/20 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
      )}

      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading || !apiKey} 
        selectedTopic={selectedTopic}
        selectedTopicName={currentTopic?.name || 'General'}
      />
    </div>
  );
};

export default App;
