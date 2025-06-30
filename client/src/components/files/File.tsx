import { useFileSystem } from "@/context/FileContext";
import { useViews } from "@/context/ViewContext";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { FileSystemItem, Id } from "@/types/file";
import { getIconClassName } from "@/utils/getIconClassName";
import { Icon } from "@iconify/react";
import { MouseEvent, useState } from "react";
import RenameView from "./RenameView";

interface FileProps {
    item: FileSystemItem;
    setSelectedDirId: (id: Id) => void;
}

export function File({ item, setSelectedDirId }: FileProps) {
    const [isEditing, setEditing] = useState(false);
    const { openFile } = useFileSystem();
    const { setIsSidebarOpen } = useViews();
    const { isMobile } = useWindowDimensions();

    const handleFileClick = (e: MouseEvent, fileId: string) => {
        e.stopPropagation();
        if (isEditing) return;
        setSelectedDirId(fileId);
        openFile(fileId);
        if (isMobile) setIsSidebarOpen(false);
    };
    
    return (
        <div className="flex w-full cursor-pointer items-center rounded-md px-2 py-1 hover:bg-darkHover" onClick={(e) => handleFileClick(e, item.id)}>
            <Icon icon={getIconClassName(item.name)} fontSize={22} className="mr-2 min-w-fit" />
            {isEditing ? (
                <RenameView id={item.id} preName={item.name} type="file" setEditing={setEditing} />
            ) : (
                <p className="flex-grow overflow-hidden truncate" title={item.name}>{item.name}</p>
            )}
        </div>
    );
}