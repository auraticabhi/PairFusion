import { ChangeEvent } from "react"
import { PiCaretDownBold } from "react-icons/pi"
import cn from "classnames"

interface SelectProps {
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
    value: string
    options: string[]
    title?: string
    className?: string
}

function Select({ onChange, value, options, title, className }: SelectProps) {
    return (
        <div className="group relative w-full space-y-2">
            {/* Label */}
            <label className={cn(
                "block text-sm font-medium transition-colors duration-200",
                "text-slate-300 group-focus-within:text-violet-400"
            )}>
                {title}
            </label>

            {/* Select Container */}
            <div className="relative">
                <select
                    className={cn(
                        className,
                        "w-full appearance-none cursor-pointer rounded-xl px-4 py-3 pr-12",
                        "bg-gradient-to-r from-slate-800/60 to-slate-700/60",
                        "border border-slate-700/50",
                        "text-slate-200 placeholder-slate-400",
                        "transition-all duration-300 ease-out",
                        "hover:from-slate-700/70 hover:to-slate-600/70",
                        "hover:border-slate-600/70 hover:shadow-lg hover:shadow-slate-500/10",
                        "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50",
                        "focus:from-violet-950/30 focus:to-purple-950/30",
                        "focus:shadow-xl focus:shadow-violet-500/20",
                    )}
                    value={value}
                    onChange={onChange}
                >
                    {options.sort().map((option) => {
                        const optionValue = option
                        const optionName = option.charAt(0).toUpperCase() + option.slice(1)

                        return (
                            <option
                                key={optionName}
                                value={optionValue}
                                className="bg-slate-800 text-slate-200 hover:bg-slate-700"
                            >
                                {optionName}
                            </option>
                        )
                    })}
                </select>

                {/* Custom Dropdown Arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <div className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full",
                        "bg-gradient-to-br from-violet-500/20 to-purple-500/20",
                        "border border-violet-500/30",
                        "transition-all duration-300",
                        "group-focus-within:from-violet-500/40 group-focus-within:to-purple-500/40",
                        "group-focus-within:border-violet-400/50",
                        "group-focus-within:shadow-lg group-focus-within:shadow-violet-500/20"
                    )}>
                        <PiCaretDownBold
                            size={12}
                            className={cn(
                                "transition-all duration-300",
                                "text-violet-400 group-focus-within:text-violet-300",
                                "group-focus-within:rotate-180"
                            )}
                        />
                    </div>
                </div>

                {/* Hover glow effect */}
                <div className={cn(
                    "absolute inset-0 rounded-xl opacity-0 pointer-events-none",
                    "bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-pink-500/5",
                    "transition-opacity duration-300",
                    "group-hover:opacity-100"
                )} />
            </div>

            {/* Focus indicator */}
            <div className={cn(
                "h-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500",
                "scale-x-0 group-focus-within:scale-x-100",
                "transition-transform duration-300 origin-left",
                "rounded-full"
            )} />
        </div>
    )
}

export default Select