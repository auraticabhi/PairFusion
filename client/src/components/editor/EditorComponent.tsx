import { useFileSystem } from "@/context/FileContext"
import Editor from "./Editor"
import FileTab from "./FileTab"
import { FileText, Sparkles } from "lucide-react"

function EditorComponent() {
    const { openFiles } = useFileSystem()
    //const { minHeightReached } = useResponsive()

    if (openFiles.length <= 0) {
        return (
            <div className="flex h-full w-full items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/5 to-pink-900/5"></div>
                
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
                
                {/* Main content */}
                <div className="relative z-10 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center border border-slate-700/50">
                                <FileText className="w-8 h-8 text-slate-400" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Welcome to PairFusion
                    </h2>
                    <p className="text-slate-400 text-lg mb-6">
                        Open a file to start collaborative coding
                    </p>
                    
                    <div className="text-sm text-slate-500 space-y-1">
                        <p>• Use the file explorer to browse your project</p>
                        <p>• Create new files or folders</p>
                        <p>• Start coding with real-time collaboration</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <main className="flex w-full flex-col h-full overflow-hidden bg-slate-900 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800/50 pointer-events-none"></div>
            
            <div className="flex-shrink-0 overflow-x-auto relative z-10 bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50">
                <FileTab />
            </div>
            
            <div className="flex-1 overflow-hidden relative z-10">
                <div className="h-full bg-slate-900/80 backdrop-blur-sm">
                    <Editor />
                </div>
            </div>
        </main>
    )
}

export default EditorComponent