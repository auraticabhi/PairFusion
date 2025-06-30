const SkeletonItem = () => (
    <div className="flex items-center p-1">
        <div className="h-5 w-5 rounded bg-gray-700 animate-pulse mr-2"></div>
        <div className="h-4 w-32 rounded bg-gray-700 animate-pulse"></div>
    </div>
);

export const SkeletonFileTree = () => {
    return (
        <div className="space-y-2">
            <SkeletonItem />
            <div className="pl-4 space-y-2">
                <SkeletonItem />
                <SkeletonItem />
            </div>
            <SkeletonItem />
            <SkeletonItem />
            <div className="pl-4 space-y-2">
                <SkeletonItem />
            </div>
        </div>
    );
};