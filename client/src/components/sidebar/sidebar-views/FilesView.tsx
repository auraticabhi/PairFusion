import { useState } from "react"
import FileStructureView from "@/components/files/FileStructureView"
import { useFileSystem } from "@/context/FileContext"
import useResponsive from "@/hooks/useResponsive"
import { FileSystemItem } from "@/types/file"
import cn from "classnames"
import { BiArchiveIn } from "react-icons/bi"
import { TbFileUpload, TbFolder, TbFiles } from "react-icons/tb"
import { v4 as uuidV4 } from "uuid"
import { toast } from "react-hot-toast"

function FilesView() {
    const { downloadFilesAndFolders, updateDirectory } = useFileSystem()
    const { viewHeight } = useResponsive()
    const { minHeightReached } = useResponsive()
    const [isLoading, setIsLoading] = useState(false)
    const [isDragOver, setIsDragOver] = useState(false)

    const handleOpenDirectory = async () => {
        try {
            setIsLoading(true)

            if ("showDirectoryPicker" in window) {
                const directoryHandle = await window.showDirectoryPicker()
                await processDirectoryHandle(directoryHandle)
                return
            }

            // Fallback for browsers without `showDirectoryPicker`
            if ("webkitdirectory" in HTMLInputElement.prototype) {
                const fileInput = document.createElement("input")
                fileInput.type = "file"
                fileInput.webkitdirectory = true

                fileInput.onchange = async (e) => {
                    const files = (e.target as HTMLInputElement).files
                    if (files) {
                        const structure = await readFileList(files)
                        updateDirectory("", structure)
                    }
                }

                fileInput.click()
                return
            }

            // Notify if neither API is supported
            toast.error("Your browser does not support directory selection.")
        } catch (error) {
            console.error("Error opening directory:", error)
            toast.error("Failed to open directory")
        } finally {
            setIsLoading(false)
        }
    }

    const processDirectoryHandle = async (
        directoryHandle: FileSystemDirectoryHandle
    ) => {
        try {
            toast.loading("Getting files and folders...")
            const structure = await readDirectory(directoryHandle)
            updateDirectory("", structure)
            toast.dismiss()
            toast.success("Directory loaded successfully")
        } catch (error) {
            console.error("Error processing directory:", error)
            toast.error("Failed to process directory")
        }
    }

    const readDirectory = async (
        directoryHandle: FileSystemDirectoryHandle
    ): Promise<FileSystemItem[]> => {
        const children: FileSystemItem[] = []
        const blackList = ["node_modules", ".git", ".vscode", ".next"]

        for await (const entry of directoryHandle.values()) {
            if (entry.kind === "file") {
                const file = await entry.getFile()
                const newFile: FileSystemItem = {
                    id: uuidV4(),
                    name: entry.name,
                    type: "file",
                    content: await readFileContent(file),
                }
                children.push(newFile)
            } else if (entry.kind === "directory") {
                if (blackList.includes(entry.name)) continue

                const newDirectory: FileSystemItem = {
                    id: uuidV4(),
                    name: entry.name,
                    type: "directory",
                    children: await readDirectory(entry),
                    isOpen: false,
                }
                children.push(newDirectory)
            }
        }
        return children
    }

    const readFileList = async (files: FileList): Promise<FileSystemItem[]> => {
        const children: FileSystemItem[] = []
        const blackList = ["node_modules", ".git", ".vscode", ".next"]

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const pathParts = file.webkitRelativePath.split("/")

            if (pathParts.some((part) => blackList.includes(part))) continue

            if (pathParts.length > 1) {
                const directoryPath = pathParts.slice(0, -1).join("/")
                const directoryIndex = children.findIndex(
                    (item) =>
                        item.name === directoryPath && item.type === "directory"
                )

                if (directoryIndex === -1) {
                    const newDirectory: FileSystemItem = {
                        id: uuidV4(),
                        name: directoryPath,
                        type: "directory",
                        children: [],
                        isOpen: false,
                    }
                    children.push(newDirectory)
                }

                const newFile: FileSystemItem = {
                    id: uuidV4(),
                    name: file.name,
                    type: "file",
                    content: await readFileContent(file),
                }

                const targetDirectory = children.find(
                    (item) =>
                        item.name === directoryPath && item.type === "directory"
                )
                if (targetDirectory && targetDirectory.children) {
                    targetDirectory.children.push(newFile)
                }
            } else {
                const newFile: FileSystemItem = {
                    id: uuidV4(),
                    name: file.name,
                    type: "file",
                    content: await readFileContent(file),
                }
                children.push(newFile)
            }
        }
        return children
    }

    const readFileContent = async (file: File): Promise<string> => {
        const MAX_FILE_SIZE = 1024 * 1024; // 1MB limit

        if (file.size > MAX_FILE_SIZE) {
            return `File too large: ${file.name} (${Math.round(
                file.size / 1024
            )}KB)`
        }

        try {
            return await file.text()
        } catch (error) {
            console.error(`Error reading file ${file.name}:`, error)
            return `Error reading file: ${file.name}`
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        console.log("Files dropped")
    }

    return (
        <div
            className={cn(
                "flex select-none flex-col gap-1 px-6 py-2 transition-all duration-200",
                "bg-gradient-to-br from-slate-900 to-slate-950",
                {
                    "bg-violet-950/20 border-violet-500/30": isDragOver,
                }
            )}
            style={{ height: viewHeight, maxHeight: viewHeight }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Header */}
            <div className="flex items-center my-4 gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                                <TbFiles className="w-5 h-5 text-purple-400" />
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Explorer
                            </h1>
                            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 to-transparent" />
                        </div>

            {/* File Structure */}
            <div className="flex-1 overflow-hidden">
                <FileStructureView />
            </div>

            {/* Actions */}
            <div
                className={cn(
                    "flex min-h-fit flex-col justify-end pt-3 border-t border-slate-800/50",
                    "space-y-2",
                    {
                        hidden: minHeightReached,
                    }
                )}
            >
                <button
                    className={cn(
                        "group flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2.5",
                        "bg-gradient-to-r from-slate-800/60 to-slate-700/60",
                        "border border-slate-700/50",
                        "text-slate-200 text-sm font-medium",
                        "transition-all duration-200 ease-out",
                        "hover:from-violet-600/20 hover:to-purple-600/20",
                        "hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10",
                        "hover:scale-[1.02] hover:-translate-y-0.5",
                        "active:scale-100 active:translate-y-0",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "disabled:hover:scale-100 disabled:hover:translate-y-0"
                    )}
                    onClick={handleOpenDirectory}
                    disabled={isLoading}
                >
                    <div className="relative">
                        <TbFileUpload 
                            className={cn(
                                "transition-all duration-200",
                                "group-hover:text-violet-400",
                                isLoading && "animate-bounce"
                            )} 
                            size={20} 
                        />
                        {isLoading && (
                            <div className="absolute inset-0 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
                        )}
                    </div>
                    <span className="group-hover:text-violet-300 transition-colors">
                        {isLoading ? "Loading..." : "Open File/Folder"}
                    </span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                    </div>
                </button>

                <button
                    className={cn(
                        "group flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2.5",
                        "bg-gradient-to-r from-slate-800/60 to-slate-700/60",
                        "border border-slate-700/50",
                        "text-slate-200 text-sm font-medium",
                        "transition-all duration-200 ease-out",
                        "hover:from-pink-600/20 hover:to-rose-600/20",
                        "hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10",
                        "hover:scale-[1.02] hover:-translate-y-0.5",
                        "active:scale-100 active:translate-y-0"
                    )}
                    onClick={downloadFilesAndFolders}
                >
                    <BiArchiveIn 
                        className="transition-all duration-200 group-hover:text-pink-400" 
                        size={20} 
                    />
                    <span className="group-hover:text-pink-300 transition-colors">
                        Download Code
                    </span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />
                    </div>
                </button>
            </div>

            {/* Drag overlay */}
            {isDragOver && (
                <div className="absolute inset-0 bg-violet-500/10 border-2 border-dashed border-violet-400 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <TbFolder className="mx-auto text-violet-400 mb-2" size={32} />
                        <p className="text-violet-300 font-medium">Drop files here</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FilesView