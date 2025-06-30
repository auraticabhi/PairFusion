import { useFileSystem } from "@/context/FileContext"
import { getIconClassName } from "@/utils/getIconClassName"
import { Icon } from "@iconify/react"
import { X } from "lucide-react"
import cn from "classnames"
import { useEffect, useRef } from "react"
import customMapping from "@/utils/customMapping"
import { useSettings } from "@/context/SettingContext"
import langMap from "lang-map"

function FileTab() {
    const {
        openFiles,
        closeFile,
        activeFile,
        updateFileContent,
        setActiveFile,
    } = useFileSystem()
    const fileTabRef = useRef<HTMLDivElement>(null)
    const { setLanguage } = useSettings()

    const changeActiveFile = (fileId: string) => {
        // If the file is already active, do nothing
        if (activeFile?.id === fileId) return

        updateFileContent(activeFile?.id || "", activeFile?.content || "")

        const file = openFiles.find((file) => file.id === fileId)
        if (file) {
            setActiveFile(file)
        }
    }

    const handleCloseFile = (e: React.MouseEvent, fileId: string) => {
        e.stopPropagation()
        closeFile(fileId)
    }

    useEffect(() => {
        const fileTabNode = fileTabRef.current
        if (!fileTabNode) return

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()
            if (e.deltaY > 0) {
                fileTabNode.scrollLeft += 100
            } else {
                fileTabNode.scrollLeft -= 100
            }
        }

        fileTabNode.addEventListener("wheel", handleWheel)

        return () => {
            fileTabNode.removeEventListener("wheel", handleWheel)
        }
    }, [])

    // Update the editor language when a file is opened
    useEffect(() => {
        if (activeFile?.name === undefined) return
        // Get file extension on file open and set language when file is opened
        const extension = activeFile.name.split(".").pop()
        if (!extension) return

        // Check if custom mapping exists
        if (customMapping[extension]) {
            setLanguage(customMapping[extension])
            return
        }

        const language = langMap.languages(extension)
        setLanguage(language[0])
    }, [activeFile?.name, setLanguage])

    return (
        <div
            className="flex h-[44px] w-full select-none gap-0 overflow-x-auto scrollbar-hide p-0"
            ref={fileTabRef}
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}
        >
            {openFiles.map((file, index) => {
                const isActive = file.id === activeFile?.id
                const isLast = index === openFiles.length - 1
                
                return (
                    <div
                        key={file.id}
                        className={cn(
                            "group relative flex min-w-fit max-w-[200px] cursor-pointer items-center border-r border-slate-700/30 px-3 py-2 transition-all duration-200",
                            {
                                "bg-slate-900 text-white shadow-inner": isActive,
                                "bg-slate-800/50 text-slate-300 hover:bg-slate-800/80 hover:text-white": !isActive,
                                "border-r-0": isLast
                            }
                        )}
                        onClick={() => changeActiveFile(file.id)}
                    >
                        {/* Active tab indicator */}
                        {isActive && (
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        )}
                        
                        {/* File icon */}
                        <Icon
                            icon={getIconClassName(file.name)}
                            fontSize={16}
                            className="mr-2 flex-shrink-0"
                        />
                        
                        {/* File name */}
                        <span
                            className="flex-1 truncate text-sm font-medium"
                            title={file.name}
                        >
                            {file.name}
                        </span>
                        
                        {/* Close button */}
                        <button
                            className={cn(
                                "ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm transition-all duration-200",
                                {
                                    "opacity-0 group-hover:opacity-100": !isActive,
                                    "opacity-60 hover:opacity-100": isActive,
                                }
                            )}
                            onClick={(e) => handleCloseFile(e, file.id)}
                        >
                            <X 
                                size={12} 
                                className="text-slate-400 hover:text-white transition-colors duration-200" 
                            />
                        </button>
                        
                        {/* Hover effect overlay */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 transition-opacity duration-200 pointer-events-none",
                            {
                                "group-hover:opacity-100": !isActive
                            }
                        )}>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default FileTab