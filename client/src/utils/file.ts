import { FileSystemItem, Id } from "@/types/file"
import { v4 as uuidv4 } from "uuid"

const initialCode = `function sayHi() {
  console.log("👋 Hello world");
}

sayHi()`

export const initialFileStructure: FileSystemItem = {
    name: "root",
    id: uuidv4(),
    type: "directory",
    children: [
        {
            id: uuidv4(),
            type: "file",
            name: "index.js",
            content: initialCode,
        },
    ],
}

export const findParentDirectory = (
    directory: FileSystemItem,
    parentDirId: Id,
): FileSystemItem | null => {
    // Checking the current directory matches the parentDirName
    if (directory.id === parentDirId && directory.type === "directory") {
        return directory
    }

    // Recursively searching children if it's a directory
    if (directory.type === "directory" && directory.children) {
        for (const child of directory.children) {
            const found = findParentDirectory(child, parentDirId)
            if (found) {
                return found
            }
        }
    }

    // Return null if not found
    return null
}

export const isFileExist = (parentDir: FileSystemItem, name: string) => {
    if (!parentDir.children) return false
    return parentDir.children.some((file) => file.name === name)
}

export const getFileById = (
    fileStructure: FileSystemItem,
    fileId: Id,
): FileSystemItem | null => {
    const findFile = (directory: FileSystemItem): FileSystemItem | null => {
        if (directory.id === fileId) {
            return directory
        } else if (directory.children) {
            for (const child of directory.children) {
                const found = findFile(child)
                if (found) {
                    return found
                }
            }
        }
        return null
    }

    return findFile(fileStructure)
}

export const sortFileSystemItem = (item: FileSystemItem): FileSystemItem => {
    // Return early if item is null or undefined
    if (!item) {
        return item
    }

    // Recursively sort children if it's a directory
    if (item.type === "directory" && item.children) {
        // Filter out any null/undefined items and ensure all items have names
        const validChildren = item.children.filter(
            (child): child is FileSystemItem => 
                child !== null && 
                child !== undefined && 
                typeof child.name === 'string'
        )

        // Separate directories and files
        let directories = validChildren.filter(
            (child) => child.type === "directory",
        )
        const files = validChildren.filter((child) => child.type === "file")

        // Sort directories by name (A-Z)
        directories.sort((a, b) => a.name.localeCompare(b.name))

        // Recursively sort nested directories
        directories = directories.map((dir) => sortFileSystemItem(dir))

        // Sort files by name (A-Z)
        files.sort((a, b) => a.name.localeCompare(b.name))

        // Combine sorted directories and files
        item.children = [
            ...directories.filter((dir) => dir.name.startsWith(".")),
            ...directories.filter((dir) => !dir.name.startsWith(".")),
            ...files.filter((file) => file.name.startsWith(".")),
            ...files.filter((file) => !file.name.startsWith(".")),
        ]
    }

    return item
}