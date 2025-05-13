import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type MessageType = "user" | "bot" | "system";

export interface ChatMessageProps {
  /**
   * The content of the message
   */
  content: string;

  /**
   * The type of message (user, bot, or system)
   */
  type: MessageType;

  /**
   * The timestamp of the message
   */
  timestamp: Date;

  /**
   * Whether the message is being typed (animated)
   */
  isTyping?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ChatMessage component
 *
 * Displays a single message in the chat interface
 */
const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  type,
  timestamp,
  isTyping = false,
  className,
}) => {
  // Format time as HH:MM
  const formattedTime = timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  // Determine if the message is from the user or the bot
  const isUser = type === "user";
  const isSystem = type === "system";

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start",
        isSystem && "justify-center",
        className
      )}
    >
      {isSystem ? (
        <div className="bg-muted/50 text-muted-foreground text-xs py-1 px-3 rounded-full">
          {content}
        </div>
      ) : (
        <div className={cn(
          "flex items-start max-w-[80%]",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          {/* Avatar */}
          {!isUser && (
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/images/bot-avatar.svg" alt="Bot" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8"></path>
                  <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                  <path d="M2 14h2"></path>
                  <path d="M20 14h2"></path>
                  <path d="M15 13v2"></path>
                  <path d="M9 13v2"></path>
                </svg>
              </AvatarFallback>
            </Avatar>
          )}

          {/* Message Bubble */}
          <div className={cn(
            "flex flex-col",
            isUser ? "items-end" : "items-start"
          )}>
            <div className={cn(
              "py-2 px-3 rounded-lg",
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-none"
                : "bg-secondary text-secondary-foreground rounded-tl-none"
            )}>
              {isTyping ? (
                <div className="flex space-x-1 items-center h-5">
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{content}</div>
              )}
            </div>

            {/* Timestamp */}
            <span className="text-xs text-muted-foreground mt-1">
              {formattedTime}
            </span>
          </div>

          {/* User Avatar */}
          {isUser && (
            <Avatar className="h-8 w-8 ml-2">
              <AvatarImage src="/images/user-avatar.svg" alt="User" />
              <AvatarFallback className="bg-accent text-accent-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
