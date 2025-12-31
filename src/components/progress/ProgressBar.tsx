export function ProgressBar({ current, total }: { current: number; total: number }) {
    const progressWidth = (current / total) * 100;

    return (
        <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-2 bg-neutral0 rounded-full overflow-hidden border rounded-20 border-neutral900">
                <div
                    className="h-full bg-neutral900 transition-all duration-500 ease-out"
                    style={{ width: `${progressWidth}%` }}
                />
            </div>

            <span className="text-preset6 font-poppins text-neutral900 whitespace-nowrap">
                {current}/{total}
            </span>
        </div>
    );
}