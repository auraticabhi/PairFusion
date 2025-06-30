import { useCopilot } from "@/context/CopilotContext"
import { useFileSystem } from "@/context/FileContext"
import { useSocket } from "@/context/SocketContext"
import useResponsive from "@/hooks/useResponsive"
import { SocketEvent } from "@/types/socket"
import toast from "react-hot-toast"
import { LuClipboardPaste, LuCopy, LuRepeat, LuClipboardPenLine, LuSparkles } from "react-icons/lu"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"
import { editorInstance } from '@/lib/editorInstance'
import { useState } from "react"

function CopilotView() {
    const { socket } = useSocket()
    const { viewHeight } = useResponsive()
    const { generateCode, output, isRunning, setInput } = useCopilot()
    const { activeFile, updateFileContent, setActiveFile } = useFileSystem()
    const [inputFocused, setInputFocused] = useState(false)

    const copyOutput = async () => {
        try {
            const content = output.replace(/```[\w]*\n?/g, "").trim()
            await navigator.clipboard.writeText(content)
            toast.success("Output copied to clipboard")
        } catch (error) {
            toast.error("Unable to copy output to clipboard")
            console.log(error)
        }
    }

    const pasteCodeInFile = () => {
        if (activeFile) {
            const fileContent = activeFile.content
                ? `${activeFile.content}\n`
                : ""
            const content = `${fileContent}${output.replace(/```[\w]*\n?/g, "").trim()}`
            updateFileContent(activeFile.id, content)
            setActiveFile({ ...activeFile, content })
            toast.success("Code pasted successfully")
            socket.emit(SocketEvent.FILE_UPDATED, {
                fileId: activeFile.id,
                newContent: content,
            })
        }
    }

    const replaceCodeInFile = () => {
        if (activeFile) {
            const isConfirmed = confirm(
                `Are you sure you want to replace the code in the file?`,
            )
            if (!isConfirmed) return
            const content = output.replace(/```[\w]*\n?/g, "").trim()
            updateFileContent(activeFile.id, content)
            setActiveFile({ ...activeFile, content })
            toast.success("Code replaced successfully")
            socket.emit(SocketEvent.FILE_UPDATED, {
                fileId: activeFile.id,
                newContent: content,
            })
        }
    }

    const insertCodeAtCursor = () => {
        if (!output) return
        
        const editorView = editorInstance.current
        const codeToInsert = output.replace(/```[\w]*\n?/g, "").trim()

        if (editorView) {
            const { from, to } = editorView.state.selection.main
            editorView.dispatch({
                changes: { from: from, to: to, insert: codeToInsert }
            })
            editorView.focus()
            toast.success("Code inserted at cursor!")
        } else {
            pasteCodeInFile()
        }
    }

    return (
        <div
            className="flex max-h-full min-h-[400px] w-full flex-col gap-4 p-6 relative overflow-hidden"
            style={{ height: viewHeight }}
        >
            <div className="absolute bg-gradient-to-br from-slate-900 to-slate-950 pointer-events-none" />
            
            {/* Header */}
            <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                                    <LuSparkles className="w-5 h-5 text-purple-400" />
                                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                    AI Copilot
                </h1>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 to-transparent" />
            </div>

            {/* Input section */}
            <div className="relative z-10">
                <div className={`
                    relative rounded-lg border transition-all duration-300
                    ${inputFocused 
                        ? 'border-purple-400/50 shadow-lg shadow-purple-500/25' 
                        : 'border-slate-700/50'
                    }
                `}>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-lg" />
                    <textarea
                        className="relative z-10 min-h-[120px] w-full rounded-lg border-none bg-transparent p-4 text-white placeholder-slate-400 outline-none resize-none"
                        placeholder="Describe the code you want to generate..."
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                    />
                </div>
            </div>

            {/* Generate button */}
            <button
                className={`
                    relative overflow-hidden rounded-lg p-3 font-bold text-white transition-all duration-300
                    ${isRunning
                        ? 'bg-gradient-to-r from-slate-600 to-slate-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/25'
                    }
                `}
                onClick={generateCode}
                disabled={isRunning}
            >
                {isRunning && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-pink-600/50 animate-pulse" />
                )}
                <div className="relative z-10 flex items-center justify-center gap-2">
                    {isRunning ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <LuSparkles size={18} />
                            Generate Code
                        </>
                    )}
                </div>
            </button>

            {/* Action buttons */}
            {output && (
                <div className="flex justify-end gap-3 pt-2">
                    {[
                        { icon: LuClipboardPenLine, title: "Insert at cursor", action: insertCodeAtCursor },
                        { icon: LuCopy, title: "Copy output", action: copyOutput },
                        { icon: LuRepeat, title: "Replace code in file", action: replaceCodeInFile },
                        { icon: LuClipboardPaste, title: "Paste code in file", action: pasteCodeInFile },
                    ].map(({ icon: Icon, title, action }, index) => (
                        <button
                            key={index}
                            title={title}
                            onClick={action}
                            className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-gradient-to-br hover:from-purple-600/20 hover:to-pink-600/20 hover:border-purple-500/30 transition-all duration-200"
                        >
                            <Icon size={16} />
                        </button>
                    ))}
                </div>
            )}

            {/* Output section */}
            <div className="flex-1 rounded-lg border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5" />
                <div className="relative z-10 h-full overflow-auto p-4 custom-scrollbar">
                    {output ? (
                        <ReactMarkdown
                            components={{
                                code({ inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || "")
                                    const language = match ? match[1] : "javascript"

                                    return !inline ? (
                                        <SyntaxHighlighter
                                            style={dracula}
                                            language={language}
                                            PreTag="pre"
                                            className="!m-0 !rounded-lg !bg-slate-800/80 !p-4 !border !border-slate-700/50"
                                        >
                                            {String(children).replace(/\n$/, "")}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={`${className} bg-purple-500/20 px-1 py-0.5 rounded text-purple-200`} {...props}>
                                            {children}
                                        </code>
                                    )
                                },
                                pre({ children }) {
                                    return <pre className="">{children}</pre>
                                },
                            }}
                        >
                            {output}
                        </ReactMarkdown>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                                <LuSparkles size={24} className="text-purple-400" />
                            </div>
                            <p className="text-slate-400 text-sm">
                                AI-generated code will appear here
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CopilotView