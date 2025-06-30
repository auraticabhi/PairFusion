import Users from "@/components/common/Users";
import { useAppContext } from "@/context/AppContext";
import { useSocket } from "@/context/SocketContext";
import { USER_STATUS } from "@/types/user";
import toast from "react-hot-toast";
import { GoSignOut } from "react-icons/go";
import { IoShareOutline } from "react-icons/io5";
import { LuCopy, LuUsers } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "@/components/modal/Modals";
import { motion } from "framer-motion";

function UsersView() {
    const navigate = useNavigate();
    const { setStatus } = useAppContext();
    const { socket } = useSocket();

    const copyURL = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Room link copied to clipboard!");
        } catch (error) {
            toast.error("Could not copy link.");
            console.error("Failed to copy URL:", error);
        }
    };

    const shareURL = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Join my Pair Fusion session!",
                    text: "Let's code together in real-time.",
                    url: window.location.href,
                });
            } catch (error) {
                console.error("Sharing failed:", error);
            }
        } else {
            copyURL();
            toast("Sharing not supported, link copied instead!", { icon: "ⓘ" });
        }
    };

    const leaveRoom = async () => {
        const confirmed = await ConfirmModal(
            "Are you sure you want to leave the room?",
            {
                title: "Leave Room",
                confirmText: "Leave",
                type: "danger",
            }
        );

        if (confirmed) {
            socket.disconnect();
            setStatus(USER_STATUS.DISCONNECTED);
            navigate("/", { replace: true });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-full flex-col gap-6 p-6 bg-gradient-to-br from-slate-900 to-slate-950"
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <LuUsers className="w-5 h-5 text-purple-400" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Users
                </h1>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 to-transparent" />
            </div>

            {/* Users List */}
            <div className="flex-grow overflow-y-auto">
                <Users />
            </div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex flex-col gap-3 pt-4 border-t border-slate-700/50"
            >
                {/* Share Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 w-full py-3 px-4
                             bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/25
                             text-white font-medium rounded-xl transition-all duration-200
                             shadow-lg"
                    onClick={shareURL}
                >
                    <IoShareOutline className="w-5 h-5" />
                    Share Invite
                </motion.button>

                {/* Copy & Leave Buttons */}
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 flex-grow py-3 px-4
                                 bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium rounded-xl
                                 border border-slate-600/50 hover:border-slate-500/50
                                 transition-all duration-200 backdrop-blur-sm"
                        onClick={copyURL}
                    >
                        <LuCopy className="w-4 h-4" />
                        Copy
                    </motion.button>
                    
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 flex-grow py-3 px-4
                                 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500
                                 text-white font-medium rounded-xl transition-all duration-200
                                 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
                        onClick={leaveRoom}
                    >
                        <GoSignOut className="w-4 h-4" />
                        Leave
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default UsersView;