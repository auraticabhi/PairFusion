import ChatInput from "@/components/chats/ChatInput"
import ChatList from "@/components/chats/ChatList"
import useResponsive from "@/hooks/useResponsive"

const ChatsView = () => {
    const { viewHeight } = useResponsive()

    return (
        <div
            className="flex max-h-full min-h-[400px] w-full flex-col gap-4 p-6 relative overflow-hidden"
            style={{ height: viewHeight }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 pointer-events-none" />
            
            {/* Header */}
            <div className="relative z-10 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full animate-pulse" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                    Group Chat
                </h1>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 to-transparent" />
            </div>

            {/* Chat list */}
            <div className="flex-1 relative z-10 rounded-lg border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10" />
                <div className="relative z-10 h-full">
                    <ChatList />
                </div>
            </div>

            {/* Chat input */}
            <div className="relative z-10">
                <ChatInput />
            </div>
        </div>
    )
}

export default ChatsView