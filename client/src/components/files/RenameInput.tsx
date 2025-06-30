import React, { useState, useEffect, useRef } from 'react';

interface RenameInputProps {
    initialName: string;
    onRename: (newName: string) => void;
    onCancel: () => void;
}

export const RenameInput: React.FC<RenameInputProps> = ({ initialName, onRename, onCancel }) => {
    const [name, setName] = useState(initialName);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
        
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onCancel]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (name.trim() && name.trim() !== initialName) {
            onRename(name.trim());
        } else {
            onCancel();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSubmit}
                className="w-full flex-grow rounded-sm bg-darkHover px-1 text-base text-white outline-none"
                onClick={(e) => e.stopPropagation()}
            />
        </form>
    );
};