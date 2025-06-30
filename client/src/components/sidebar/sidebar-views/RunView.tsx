import { useRunCode } from "@/context/RunCodeContext"
import useResponsive from "@/hooks/useResponsive"
import { ChangeEvent } from "react"
import toast from "react-hot-toast"
import { LuCopy, LuPlay, LuLoader } from "react-icons/lu"
import { PiCaretDownBold } from "react-icons/pi"
import { motion } from "framer-motion"

function RunView() {
    const { viewHeight } = useResponsive()
    const {
        setInput,
        output,
        isRunning,
        supportedLanguages,
        selectedLanguage,
        setSelectedLanguage,
        runCode,
    } = useRunCode()

    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const lang = JSON.parse(e.target.value)
        setSelectedLanguage(lang)
    }

    const copyOutput = () => {
        navigator.clipboard.writeText(output)
        toast.success("Output copied to clipboard")
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4 p-6 bg-gradient-to-br from-slate-900 to-slate-950"
            style={{ height: viewHeight }}
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <LuPlay className="w-5 h-5 text-purple-400" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Run Code
                </h1>
            </div>

            <div className="flex h-full flex-col gap-4">
                {/* Language Selector */}
                <div className="relative group">
                    <select
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white 
                                 backdrop-blur-sm transition-all duration-200 outline-none
                                 focus:border-purple-500/50 focus:bg-slate-800/70 focus:shadow-lg 
                                 focus:shadow-purple-500/10 appearance-none cursor-pointer
                                 hover:bg-slate-800/60 hover:border-slate-600/50"
                        value={JSON.stringify(selectedLanguage)}
                        onChange={handleLanguageChange}
                    >
                        {supportedLanguages
                            .sort((a, b) => (a.language > b.language ? 1 : -1))
                            .map((lang, i) => (
                                <option key={i} value={JSON.stringify(lang)} className="bg-slate-800">
                                    {lang.language + (lang.version ? ` (${lang.version})` : "")}
                                </option>
                            ))}
                    </select>
                    <PiCaretDownBold className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none 
                                               group-hover:text-purple-400 transition-colors duration-200" />
                </div>

                {/* Input Area */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Input</label>
                    <textarea
                        className="min-h-[120px] w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl 
                                 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 
                                 resize-none outline-none focus:border-purple-500/50 focus:bg-slate-800/70 
                                 focus:shadow-lg focus:shadow-purple-500/10 hover:bg-slate-800/60"
                        placeholder="Write your input here..."
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                {/* Run Button */}
                <motion.button
                    // whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 w-full py-3 px-6 
                             bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500
                             text-white font-semibold rounded-xl transition-all duration-200 
                             disabled:opacity-50 disabled:cursor-not-allowed
                             shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                    onClick={runCode}
                    disabled={isRunning}
                >
                    {isRunning ? (
                        <>
                            <LuLoader className="w-5 h-5 animate-spin" />
                            Running...
                        </>
                    ) : (
                        <>
                            <LuPlay className="w-5 h-5" />
                            Run Code
                        </>
                    )}
                </motion.button>

                {/* Output Section */}
                <div className="flex flex-col gap-2 flex-grow max-h-[calc(100%-300px)]">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-300">Output</label>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={copyOutput}
                            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50
                                     hover:border-purple-500/50 transition-all duration-200 group"
                            title="Copy Output"
                        >
                            <LuCopy className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                        </motion.button>
                    </div>
                    <div className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl 
                                  overflow-y-auto backdrop-blur-sm custom-scrollbar min-h-[270px] max-h-[300px]">
                        <code>
                            <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                                {output || "Output will appear here..."}
                            </pre>
                        </code>
                    </div>
                </div>
            </div>
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
                `}</style>
        </motion.div>
    )
}

export default RunView