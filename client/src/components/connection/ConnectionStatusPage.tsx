import { useNavigate } from "react-router-dom"
import { TbAlertTriangle, TbRefresh, TbHome, TbWifiOff } from "react-icons/tb"
import cn from "classnames"

function ConnectionStatusPage() {
    return (
        <div className="flex h-screen min-h-screen flex-col items-center justify-center gap-8 px-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-violet-400/30 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Grid overlay */}
            <div 
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }}
            />
            
            <div className="relative z-10">
                <ConnectionError />
            </div>
        </div>
    )
}

const ConnectionError = () => {
    const navigate = useNavigate()
    
    const reloadPage = () => {
        window.location.reload()
    }

    const gotoHomePage = () => {
        navigate("/")
    }

    return (
        <div className="max-w-md mx-auto space-y-8">
            <div className="relative flex justify-center">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                        <TbWifiOff className="w-10 h-10 text-red-400" />
                    </div>
                    
                    <div className="absolute inset-0 rounded-full border-2 border-red-400/20 animate-ping" />
                    <div className="absolute inset-0 rounded-full border border-red-400/10 animate-pulse" />
                    
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-500/90 border-2 border-slate-900 flex items-center justify-center">
                        <TbAlertTriangle className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h1 className="text-2xl font-bold text-slate-200">
                    Connection Lost
                </h1>
                <p className="text-slate-400 leading-relaxed">
                    Oops! Something went wrong with your connection. 
                    <br />
                    Don't worry, we can fix this together.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                    className={cn(
                        "group w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl",
                        "bg-gradient-to-r from-violet-600 to-purple-600",
                        "hover:from-violet-500 hover:to-purple-500",
                        "border border-violet-500/50 hover:border-violet-400/70",
                        "text-white font-semibold",
                        "transition-all duration-300 ease-out",
                        "hover:scale-105 hover:-translate-y-1",
                        "hover:shadow-xl hover:shadow-violet-500/25",
                        "active:scale-100 active:translate-y-0"
                    )}
                    onClick={reloadPage}
                >
                    <TbRefresh className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Try Again</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
                    </div>
                </button>

                <button
                    className={cn(
                        "group w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl",
                        "bg-gradient-to-r from-slate-700 to-slate-600",
                        "hover:from-slate-600 hover:to-slate-500",
                        "border border-slate-600/50 hover:border-slate-500/70",
                        "text-slate-200 font-semibold",
                        "transition-all duration-300 ease-out",
                        "hover:scale-105 hover:-translate-y-1",
                        "hover:shadow-lg hover:shadow-slate-500/20",
                        "active:scale-100 active:translate-y-0"
                    )}
                    onClick={gotoHomePage}
                >
                    <TbHome className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Go to Homepage</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-slate-300/80 rounded-full animate-pulse" />
                    </div>
                </button>
            </div>

            {/* Help Text */}
            <div className="pt-4 border-t border-slate-800/50">
                <p className="text-xs text-slate-500">
                    Still having issues? Check your internet connection or try refreshing the page.
                </p>
            </div>
        </div>
    )
}

export default ConnectionStatusPage