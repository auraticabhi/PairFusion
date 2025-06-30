// client/src/components/sidebar/Sidebar.tsx
import SidebarButton from "@/components/sidebar/sidebar-views/SidebarButton";
import { useAppContext } from "@/context/AppContext";
import { useViews } from "@/context/ViewContext";
import { VIEWS } from "@/types/view";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/context/SocketContext";
import { USER_STATUS } from "@/types/user";
import { ConfirmModal } from "../modal/Modals";
import toast from "react-hot-toast";

function Sidebar() {
    const { activeView, isSidebarOpen, viewComponents, viewIcons } = useViews();
    const { setStatus } = useAppContext();
    const { socket } = useSocket();
    const navigate = useNavigate();

    const copyURL = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Room link copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy link.");
        }
    };

    const leaveRoom = async () => {
        const confirmed = await ConfirmModal("Are you sure you want to leave the room?", { type: "danger" });
        if (confirmed) {
            socket.disconnect();
            setStatus(USER_STATUS.DISCONNECTED);
            navigate("/", { replace: true });
        }
    };

    return (
        <aside className="flex h-full w-auto bg-slate-900 border-r border-slate-700/50">
            {/* ACTIVITY BAR */}
            <div className={cn(
                "flex md:h-full w-[60px] min-w-[60px] flex-col bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/30 p-3"
            )}>
                {/* Primary Navigation Group (Top) */}
                <div className="flex flex-col gap-3">
                    <SidebarButton viewName={VIEWS.FILES} icon={viewIcons[VIEWS.FILES]} />
                    <SidebarButton viewName={VIEWS.CHATS} icon={viewIcons[VIEWS.CHATS]} />
                    <SidebarButton viewName={VIEWS.COPILOT} icon={viewIcons[VIEWS.COPILOT]} />
                    <SidebarButton viewName={VIEWS.CLIENTS} icon={viewIcons[VIEWS.CLIENTS]} />
                </div>

                {/* Spacer to push next group to bottom */}
                <div className="flex-grow"></div>

                {/* Secondary Action Group (Bottom) */}
                <div className="flex flex-col gap-3">
                    {/* Share Button */}
                    <SidebarButton
                        viewName={VIEWS.SHARE}
                        onClick={copyURL}
                        icon={viewIcons[VIEWS.SHARE]}
                        // tooltipContent="Copy Invite Link"
                    />

                    {/* Settings Button */}
                    <SidebarButton viewName={VIEWS.SETTINGS} icon={viewIcons[VIEWS.SETTINGS]} />

                    {/* Leave Room Button */}
                    <SidebarButton
                        viewName={VIEWS.LEAVE}
                        onClick={leaveRoom}
                        icon={viewIcons[VIEWS.LEAVE]}
                        // tooltipContent="Leave Room"
                        // hoverColorClass="hover:text-red-400"
                    />
                </div>
            </div>

            {/* SIDEBAR CONTENT PANEL */}
            <div
                className={cn(
                    "w-full bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/30 md:min-w-[300px] transition-all duration-300",
                    {
                        "shadow-2xl shadow-purple-500/5": isSidebarOpen
                    }
                )}
                style={
                  window.innerWidth >= 768 && !isSidebarOpen ? { display: "none" } : {}
                }
            >
                <div className="h-full relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/2 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 h-full">
                        {viewComponents[activeView]}
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;