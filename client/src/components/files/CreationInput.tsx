import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineFolder, AiOutlineFile } from 'react-icons/ai';

interface CreationInputProps {
    type: 'file' | 'directory';
    onCancel: () => void;
    onCreate: (name: string) => void;
}

export const CreationInput: React.FC<CreationInputProps> = ({ type, onCancel, onCreate }) => {
    const [name, setName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onCancel]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (name.trim()) {
            onCreate(name.trim());
        }
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-full items-center rounded-md py-1 pl-4">
            {type === 'directory' ? 
                <AiOutlineFolder size={24} className="mr-2 min-w-fit" /> : 
                <AiOutlineFile size={22} className="mr-2 min-w-fit" />
            }
            <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={onCancel} // Cancel if the user clicks away
                className="w-full flex-grow rounded-sm bg-dark px-2 text-base text-white outline-none"
                onClick={(e) => e.stopPropagation()}
                placeholder={`Enter ${type} name...`}
            />
        </form>
    );
};