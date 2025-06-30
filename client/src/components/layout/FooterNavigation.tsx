import React from 'react';
import { useViews } from '@/context/ViewContext';
import { VIEWS } from '@/types/view';
import classnames from 'classnames';

export const FooterNavigation: React.FC = () => {
    const { activeView, setActiveView } = useViews();

    const navItems = [
        { view: VIEWS.FILES, icon: '📄', label: 'Files' },
        { view: VIEWS.CHATS, icon: '💬', label: 'Chats' },
        { view: VIEWS.COPILOT, icon: '🤖', label: 'Copilot' },
        { view: VIEWS.CLIENTS, icon: '👥', label: 'Clients' },
    ];

    return (
        <footer className="flex justify-around items-center h-16 bg-slate-900 border-t border-slate-700/50 md:hidden">
            {navItems.map((item) => (
                <button
                    key={item.view}
                    onClick={() => setActiveView(item.view)}
                    className={classnames(
                        "flex flex-col items-center justify-center p-2 rounded-md transition-colors duration-200",
                        activeView === item.view ? "text-purple-400" : "text-slate-400 hover:text-white"
                    )}
                >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                </button>
            ))}
        </footer>
    );
};