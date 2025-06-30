import { FileSystemItem, Id } from "@/types/file";
import { MouseEvent, useState } from "react";
import cn from "classnames";
import { AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai";
import { useFileSystem } from "@/context/FileContext";
import RenameView from "./RenameView";
import { File } from "./File";
import { CreationInput } from "./CreationInput";

type CreatingState = { type: 'file' | 'directory', parentId: Id } | null;

interface DirectoryProps {
    item: FileSystemItem;
    setSelectedDirId: (id: Id) => void;
    isCreating: CreatingState;
    setIsCreating: (state: CreatingState) => void;
    handleCreate: (name: string) => void;
}

export function Directory({ item, setSelectedDirId, isCreating, setIsCreating, handleCreate }: DirectoryProps) {
    const [isEditing, setEditing] = useState(false);
    const { toggleDirectory } = useFileSystem();

    const handleDirClick = (e: MouseEvent, dirId: string) => {
        e.stopPropagation();
        if (isEditing) return;
        setSelectedDirId(dirId);
        toggleDirectory(dirId);
    };

    if (item.type === "file") {
        return <File item={item} setSelectedDirId={setSelectedDirId} />;
    }

    return (
        <div className="overflow-x-auto">
            <div
                className="flex w-full cursor-pointer items-center rounded-md px-2 py-1 hover:bg-darkHover"
                onClick={(e) => handleDirClick(e, item.id)}
            >
                {item.isOpen ? <AiOutlineFolderOpen size={24} className="mr-2 min-w-fit" /> : <AiOutlineFolder size={24} className="mr-2 min-w-fit" />}
                {isEditing ? (
                    <RenameView id={item.id} preName={item.name} type="directory" setEditing={setEditing} />
                ) : (
                    <p className="flex-grow overflow-hidden truncate" title={item.name}>{item.name}</p>
                )}
            </div>
            <div className={cn({ "hidden": !item.isOpen }, { "block": item.isOpen }, { "pl-4": item.name !== "root" })}>
                {item.children?.map((childItem) => (
                    <Directory key={childItem.id} item={childItem} setSelectedDirId={setSelectedDirId} isCreating={isCreating} setIsCreating={setIsCreating} handleCreate={handleCreate} />
                ))}
                {isCreating && isCreating.parentId === item.id && (
                    <CreationInput type={isCreating.type} onCancel={() => setIsCreating(null)} onCreate={handleCreate} />
                )}
            </div>
        </div>
    );
}