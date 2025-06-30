import { useAppContext } from "@/context/AppContext"
import { RemoteUser, USER_CONNECTION_STATUS } from "@/types/user"
import Avatar from "react-avatar"
import { TbUsers, TbUserCheck, TbUserX, TbWifi, TbWifiOff } from "react-icons/tb"
import cn from "classnames"

function Users() {
    const { users } = useAppContext()
    const onlineUsers = users.filter(user => user.status === USER_CONNECTION_STATUS.ONLINE)
    const offlineUsers = users.filter(user => user.status !== USER_CONNECTION_STATUS.ONLINE)

    return (
        <div className="flex min-h-[200px] flex-grow flex-col overflow-hidden py-2 px-1">
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800/50">
                <TbUsers className="text-violet-400" size={20} />
                <h3 className="text-sm font-semibold text-slate-200">
                    Collaborators
                </h3>
                <div className="ml-auto flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-400">{onlineUsers.length}</span>
                </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto mt-2">
                <div className="space-y-4 py-2">
                    {/* Online Users */}
                    {onlineUsers.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 px-2">
                                <TbUserCheck className="text-green-400" size={16} />
                                <span className="text-xs font-medium text-green-400 uppercase tracking-wide">
                                    Online ({onlineUsers.length})
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {onlineUsers.map((user) => (
                                    <User key={user.socketId} user={user} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Offline Users */}
                    {offlineUsers.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 px-2">
                                <TbUserX className="text-slate-500" size={16} />
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Offline ({offlineUsers.length})
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {offlineUsers.map((user) => (
                                    <User key={user.socketId} user={user} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {users.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
                                <TbUsers className="text-slate-600" size={24} />
                            </div>
                            <p className="text-sm text-slate-400 mb-1">No collaborators yet</p>
                            <p className="text-xs text-slate-500">Share your session to invite others</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const User = ({ user }: { user: RemoteUser }) => {
    const { username, status } = user
    const isOnline = status === USER_CONNECTION_STATUS.ONLINE
    const title = `${username} - ${isOnline ? "online" : "offline"}`

    return (
        <div
            className={cn(
                "group relative flex flex-col items-center gap-2 p-3 rounded-xl",
                "bg-gradient-to-b from-slate-800/40 to-slate-800/60",
                "border border-slate-700/50",
                "transition-all duration-300 ease-out",
                "hover:from-slate-700/60 hover:to-slate-700/80",
                "hover:border-slate-600/70",
                "hover:shadow-lg",
                {
                    "hover:shadow-green-500/10 hover:border-green-500/30": isOnline,
                    "hover:shadow-slate-500/10": !isOnline,
                }
            )}
            title={title}
        >
            {/* Avatar Container */}
            <div className="relative">
                <div 
                    className={cn(
                        "rounded-xl overflow-hidden ring-2 transition-all duration-300",
                        {
                            "ring-green-400/50 group-hover:ring-green-400/80": isOnline,
                            "ring-slate-600/50 group-hover:ring-slate-500/80": !isOnline,
                        }
                    )}
                >
                    <Avatar 
                        name={username} 
                        size="44" 
                        round="12px" 
                        title={title}
                        className="transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
                
                {/* Status Indicator */}
                <div className="absolute -bottom-1 -right-1">
                    <div 
                        className={cn(
                            "relative w-4 h-4 rounded-full border-2 border-slate-800",
                            "flex items-center justify-center",
                            {
                                "bg-green-500": isOnline,
                                "bg-slate-600": !isOnline,
                            }
                        )}
                    >
                        {isOnline ? (
                            <TbWifi className="w-2 h-2 text-white" />
                        ) : (
                            <TbWifiOff className="w-2 h-2 text-slate-300" />
                        )}
                        
                        {/* Pulse animation for online users */}
                        {isOnline && (
                            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
                        )}
                    </div>
                </div>
            </div>

            {/* Username */}
            <div className="text-center w-full">
                <p className={cn(
                    "text-xs font-medium line-clamp-2 max-w-full text-ellipsis break-words",
                    "transition-colors duration-200",
                    {
                        "text-slate-200 group-hover:text-green-300": isOnline,
                        "text-slate-400 group-hover:text-slate-300": !isOnline,
                    }
                )}>
                    {username}
                </p>
                
                {/* Status Text */}
                <span className={cn(
                    "text-[10px] uppercase tracking-wide font-semibold",
                    "opacity-1 group-hover:opacity-100 transition-all duration-200",
                    {
                        "text-green-400": isOnline,
                        "text-slate-500": !isOnline,
                    }
                )}>
                    {isOnline ? "online" : "offline"}
                </span>
            </div>

            {/* Hover glow effect */}
            <div 
                className={cn(
                    "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-300 pointer-events-none",
                    "bg-gradient-to-r from-transparent via-white/5 to-transparent",
                    "-z-10"
                )}
            />
        </div>
    )
}

export default Users