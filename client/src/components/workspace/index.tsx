import Split from 'react-split';
import { useState } from 'react';
import EditorComponent from '../editor/EditorComponent';
import BottomPanel from '../bottom-panel/BottomPanel';

function WorkSpace() {
    const [panelSize, setPanelSize] = useState(11);

    const createVerticalGutter = () => {
        const gutter = document.createElement('div');
        gutter.className = 'w-full h-2 cursor-row-resize bg-slate-700/50 hover:bg-gradient-to-r hover:from-purple-500/50 hover:to-pink-500/50 transition-all duration-200 relative group';
        
        const handle = document.createElement('div');
        handle.className = 'absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200';
        handle.innerHTML = '<div class="w-8 h-0.5 bg-white/40 rounded-full"></div>';
        gutter.appendChild(handle);
        
        return gutter;
    };
    
    return (
        <div className="flex h-full w-full flex-col bg-slate-900 relative">
            {/* background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/5 pointer-events-none"></div>
            
            <Split
                direction="vertical"
                sizes={[100 - panelSize, panelSize]}
                minSize={[200, 70]}
                //maxSize={[600]}
                gutterSize={7}
                onDrag={newSizes => setPanelSize(newSizes[1])}
                gutter={createVerticalGutter}
                className="flex h-full flex-col relative z-10"
            >
                {/* Main Editor Area */}
                <div className="w-full overflow-hidden bg-slate-900/50 backdrop-blur-sm">
                    <EditorComponent />
                </div>
                
                {/* Bottom Panel */}
                <div className="w-full overflow-auto bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50">
                    {panelSize > 5 && (
                        <div className="h-full relative">
                            {/* Panel background effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-800/20 to-transparent pointer-events-none"></div>
                            <div className="relative z-10 h-full">
                                <BottomPanel />
                            </div>
                        </div>
                    )}
                </div>
            </Split>
        </div>
    );
}

export default WorkSpace;