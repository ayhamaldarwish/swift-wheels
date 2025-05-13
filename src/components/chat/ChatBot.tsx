import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, MessageSquare, Minimize2 } from "lucide-react";
import ChatMessage, { MessageType } from "./ChatMessage";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  chatbotGreeting, 
  chatbotQuestions, 
  findMatchingQuestion, 
  getFallbackResponse 
} from "@/data/chatbotData";

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

interface ChatBotProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ChatBot component
 * 
 * A simple help bot that can answer frequently asked questions
 */
const ChatBot: React.FC<ChatBotProps> = ({ className }) => {
  const { t, language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lang = language === "ar" ? "ar" : "en";
  
  // Initialize chat with greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          content: chatbotGreeting.greeting[lang],
          type: "bot",
          timestamp: new Date()
        },
        {
          id: "suggestions",
          content: t("chatbot.suggestions"),
          type: "system",
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length, t, lang]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);
  
  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };
  
  // Toggle chat minimized/maximized
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      type: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate bot thinking and typing
    setTimeout(() => {
      const matchingQuestion = findMatchingQuestion(inputValue, lang);
      
      let botResponse: string;
      if (matchingQuestion) {
        botResponse = matchingQuestion.answer[lang];
      } else {
        botResponse = getFallbackResponse(lang);
      }
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: botResponse,
        type: "bot",
        timestamp: new Date()
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (question: string) => {
    // Add user message with the suggestion
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: question,
      type: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Find the matching question and respond
    setTimeout(() => {
      const matchingQuestion = chatbotQuestions.find(
        q => q.question[lang] === question
      );
      
      let botResponse: string;
      if (matchingQuestion) {
        botResponse = matchingQuestion.answer[lang];
      } else {
        botResponse = getFallbackResponse(lang);
      }
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: botResponse,
        type: "bot",
        timestamp: new Date()
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };
  
  // Handle input keypress (send on Enter)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  
  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 p-0 flex items-center justify-center"
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>
      
      {/* Chat Window */}
      {isOpen && (
        <Card 
          className={`fixed bottom-24 right-6 w-80 sm:w-96 shadow-xl z-40 transition-all duration-300 ${
            isMinimized ? "h-16" : "h-[500px]"
          } ${className}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">
              {t("chatbot.title")}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={toggleMinimize}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <>
              <CardContent className="p-0 flex-grow">
                <ScrollArea className="h-[380px] p-4">
                  {/* Messages */}
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      content={message.content}
                      type={message.type}
                      timestamp={message.timestamp}
                    />
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <ChatMessage
                      content=""
                      type="bot"
                      timestamp={new Date()}
                      isTyping={true}
                    />
                  )}
                  
                  {/* Suggested questions */}
                  {messages.length <= 2 && (
                    <div className="mt-4 space-y-2">
                      {chatbotGreeting.suggestions[lang].map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="mr-2 mb-2 text-sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>
              
              <CardFooter className="p-3 border-t">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder={t("chatbot.input_placeholder")}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </>
  );
};

export default ChatBot;
