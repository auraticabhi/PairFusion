import RunView from '../sidebar/sidebar-views/RunView';

function BottomPanel() {

    return (
        <div className="flex h-full w-full flex-col bg-dark-light">
            {/* planned to add a tab header here later */}
            <div className="flex-grow overflow-auto">
                <RunView />
            </div>
        </div>
    );
}

export default BottomPanel;