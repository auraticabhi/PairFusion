import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { SyntheticEvent, useEffect, useRef, useCallback } from "react"

function ChatList() {
    const {
        messages,
        isNewMessage,
        setIsNewMessage,
        setLastScrollHeight,
    } = useChatRoom()
    const { currentUser } = useAppContext()
    const messagesContainerRef = useRef<HTMLDivElement | null>(null)

    const handleScroll = (e: SyntheticEvent) => {
        const container = e.target as HTMLDivElement
        setLastScrollHeight(container.scrollTop)
    }

    const scrollToBottom = useCallback(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }, [])

    useEffect(() => {
        if (isNewMessage && messages.length > 0) {
            setTimeout(() => {
                scrollToBottom()
                setIsNewMessage(false)
            }, 10) // Small delay to ensure the new message is rendered before scrolling
        }
    }, [isNewMessage, messages.length, scrollToBottom, setIsNewMessage])

    // Initial scroll to bottom when component mounts and has messages
    useEffect(() => {
        if (messages.length > 0 && messagesContainerRef.current) {
            scrollToBottom()
        }
    }, []) // Only run on mount

    return (
        <div
            className="flex-grow h-full max-h-full overflow-y-auto p-4 space-y-3 bg-slate-900/50 backdrop-blur-sm rounded-md custom-scrollbar"
            ref={messagesContainerRef}
            onScroll={handleScroll}
        >
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse" />
                    </div>
                    <p className="text-slate-400 text-sm">
                        No messages yet. Start the conversation!
                    </p>
                </div>
            ) : (
                messages.map((message, index) => {
                    const isCurrentUser = message.username === currentUser.username
                    const isLastMessage = index === messages.length - 1
                    
                    return (
                        <div
                            key={`${message.username}-${message.timestamp}-${index}`}
                            className={`
                                flex ${isCurrentUser ? 'justify-end' : 'justify-start'}
                                ${isLastMessage ? 'animate-fadeInUp' : ''}
                            `}
                        >
                            <div
                                className={`
                                    max-w-[85%] break-words rounded-lg px-4 py-3 relative
                                    transition-all duration-200 hover:scale-[1.02]
                                    ${isCurrentUser
                                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                                        : 'bg-slate-800/80 text-white border border-slate-700/50'
                                    }
                                `}
                            >
                                {/* Message header */}
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`
                                        text-xs font-medium mr-2
                                        ${isCurrentUser 
                                            ? 'text-purple-100' 
                                            : 'text-purple-300'
                                        }
                                    `}>
                                        {message.username}
                                    </span>
                                    <span className={`
                                        text-xs
                                        ${isCurrentUser 
                                            ? 'text-pink-100' 
                                            : 'text-slate-400'
                                        }
                                    `}>
                                        {message.timestamp}
                                    </span>
                                </div>
                                
                                {/* Message content */}
                                <p className="text-sm font-semibold leading-relaxed">
                                    {message.message}
                                </p>

                                {/* Message tail */}
                                <div className={`
                                    absolute top-3 w-3 h-3 transform rotate-45
                                    ${isCurrentUser
                                        ? '-right-1 bg-gradient-to-br from-purple-600 to-pink-600'
                                        : '-left-1 bg-slate-800/80 border-l border-b border-slate-700/50'
                                    }
                                `} />
                            </div>
                        </div>
                    )
                })
            )}
            <style>{`
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(100, 116, 139, 0.5) transparent;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(100, 116, 139, 0.5);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(139, 92, 246, 0.7);
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}

export default ChatList