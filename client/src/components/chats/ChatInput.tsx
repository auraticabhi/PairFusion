import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { useSocket } from "@/context/SocketContext"
import { ChatMessage } from "@/types/chat"
import { SocketEvent } from "@/types/socket"
import { formatDate } from "@/utils/formateDate"
import { FormEvent, useRef, useState } from "react"
import { LuSendHorizontal } from "react-icons/lu"
import { v4 as uuidV4 } from "uuid"

function ChatInput() {
    const { currentUser } = useAppContext()
    const { socket } = useSocket()
    const { setMessages } = useChatRoom()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [isFocused, setIsFocused] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const inputVal = inputRef.current?.value.trim()

        if (inputVal && inputVal.length > 0) {
            const message: ChatMessage = {
                id: uuidV4(),
                message: inputVal,
                username: currentUser.username,
                timestamp: formatDate(new Date().toISOString()),
            }
            socket.emit(SocketEvent.SEND_MESSAGE, { message })
            setMessages((messages) => [...messages, message])

            if (inputRef.current) inputRef.current.value = ""
        }
    }

    return (
        <form
            onSubmit={handleSendMessage}
            className={`
                relative flex items-center rounded-lg border transition-all duration-300 ease-out
                ${isFocused 
                    ? 'border-purple-400/50 shadow-lg shadow-purple-500/25' 
                    : isHovered 
                        ? 'border-purple-500/30' 
                        : 'border-slate-600/50'
                }
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/80 via-slate-900/80 to-slate-800/80 rounded-lg" />
            
            {isFocused && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 animate-pulse" />
            )}

            <input
                type="text"
                className={`
                    relative z-10 w-full flex-grow rounded-l-lg border-none bg-transparent px-4 py-3 
                    text-white placeholder-slate-400 outline-none transition-all duration-200
                    ${isFocused ? 'placeholder-slate-300' : ''}
                `}
                placeholder="Type your message..."
                ref={inputRef}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            
            <button
                className={`
                    relative z-10 flex items-center justify-center rounded-r-lg px-4 py-3 
                    transition-all duration-300 ease-out group
                    ${isFocused || isHovered
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                    }
                `}
                type="submit"
            >
                <LuSendHorizontal 
                    size={20} 
                    className="transition-transform duration-200 group-hover:translate-x-0.5" 
                />
            </button>
        </form>
    )
}

export default ChatInput