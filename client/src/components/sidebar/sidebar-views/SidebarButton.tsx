import { useChatRoom } from "@/context/ChatContext"
import { useViews } from "@/context/ViewContext"
import { VIEWS } from "@/types/view"
import { useState } from "react"
import { motion } from "framer-motion"

interface ViewButtonProps {
    viewName: VIEWS
    icon: JSX.Element
    onClick?: () => void; 
    tooltipContent?: string; 
    hoverColorClass?: string; 
}

const ViewButton = ({ viewName, icon, onClick }: ViewButtonProps) => {
    const { activeView, setActiveView, isSidebarOpen, setIsSidebarOpen } = useViews()
    const { isNewMessage } = useChatRoom()
    const [showTooltip, setShowTooltip] = useState(true)

    const handleViewClick = (viewName: VIEWS) => {

        if (onClick) {
            onClick();
            return;
        }

        if (viewName === activeView) {
            setIsSidebarOpen(!isSidebarOpen)
        } else {
            setIsSidebarOpen(true)
            setActiveView(viewName)
        }
    }

    const isActive = activeView === viewName && isSidebarOpen

    return (
        <div className="relative flex flex-col items-center">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewClick(viewName)}
                onMouseEnter={() => setShowTooltip(true)}
                className={`relative p-2 rounded-xl transition-all duration-200 group
                           ${isActive 
                             ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-500/40 shadow-lg shadow-purple-500/20' 
                             : 'bg-slate-800/50 border-2 border-slate-700/30 hover:bg-slate-700/50 hover:border-slate-600/40'
                           }
                           backdrop-blur-sm hover:shadow-lg transition-all duration-200`}
                {...(showTooltip && {
                    "data-tooltip-id": "sidebar-tooltip",
                    "data-tooltip-content": viewName,
                })}
            >
                <div className={`flex items-center justify-center transition-colors duration-200
                               ${isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                    {icon}
                </div>

                {/* Message notification */}
                {viewName === VIEWS.CHATS && isNewMessage && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 
                                 bg-gradient-to-r from-pink-500 to-purple-500 
                                 rounded-full border-2 border-slate-900
                                 shadow-lg shadow-pink-500/50"
                    />
                )}
            </motion.button>
        </div>
    )
}

export default ViewButton