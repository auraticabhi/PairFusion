import Select from "@/components/common/Select"
import { useSettings } from "@/context/SettingContext"
import useResponsive from "@/hooks/useResponsive"
import { editorFonts } from "@/resources/Fonts"
import { editorThemes } from "@/resources/Themes"
import { langNames } from "@uiw/codemirror-extensions-langs"
import { ChangeEvent, useEffect } from "react"
import { motion } from "framer-motion"
import { LuSettings, LuRefreshCw, LuType, LuPalette, LuCode } from "react-icons/lu"

function SettingsView() {
    const {
        theme,
        setTheme,
        language,
        setLanguage,
        fontSize,
        setFontSize,
        fontFamily,
        setFontFamily,
        resetSettings,
    } = useSettings()
    const { viewHeight } = useResponsive()

    const handleFontFamilyChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setFontFamily(e.target.value)
    const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setTheme(e.target.value)
    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setLanguage(e.target.value)
    const handleFontSizeChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setFontSize(parseInt(e.target.value))

    useEffect(() => {
        const editor = document.querySelector(".cm-editor > .cm-scroller") as HTMLElement
        if (editor !== null) {
            editor.style.fontFamily = `${fontFamily}, monospace`
        }
    }, [fontFamily])

    const settingsItems = [
        {
            icon: <LuType className="w-5 h-5" />,
            title: "Font Family",
            component: (
                <div className="flex gap-3 items-center justify-center">
                    <div className="flex-grow">
                        <Select
                            onChange={handleFontFamilyChange}
                            value={fontFamily}
                            options={editorFonts}
                            className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white
             backdrop-blur-sm transition-all duration-200 outline-none
             focus:border-purple-500/50 focus:bg-slate-800/70 hover:bg-slate-800/60"
                        />
                    </div>
                    <select
                        value={fontSize}
                        onChange={handleFontSizeChange}
                        className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white
                                 backdrop-blur-sm transition-all duration-200 outline-none
                                 focus:border-purple-500/50 focus:bg-slate-800/70 hover:bg-slate-800/60"
                        title="Font Size"
                    >
                        {[...Array(13).keys()].map((size) => (
                            <option key={size} value={size + 12} className="bg-slate-800 text-white">
                                {size + 12}px
                            </option>
                        ))}
                    </select>
                </div>
            )
        },
        {
            icon: <LuPalette className="w-5 h-5" />,
            title: "Theme",
            component: (
                <Select
                    onChange={handleThemeChange}
                    value={theme}
                    options={Object.keys(editorThemes)}
                    className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white
             backdrop-blur-sm transition-all duration-200 outline-none
             focus:border-purple-500/50 focus:bg-slate-800/70 hover:bg-slate-800/60"
                />
            )
        },
        {
            icon: <LuCode className="w-5 h-5" />,
            title: "Language",
            component: (
                <Select
                    onChange={handleLanguageChange}
                    value={language}
                    options={langNames}
                    className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white
             backdrop-blur-sm transition-all duration-200 outline-none
             focus:border-purple-500/50 focus:bg-slate-800/70 hover:bg-slate-800/60"
                />
            )
        }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6 p-6 bg-gradient-to-br from-slate-900 to-slate-950"
            style={{ height: viewHeight }}
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <LuSettings className="w-5 h-5 text-purple-400" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Settings
                </h1>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 to-transparent" />
            </div>

            {/* Settings Items */}
            <div className="flex flex-col gap-6 flex-grow overflow-y-auto">
                {settingsItems.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex flex-col gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl
                                 backdrop-blur-sm hover:bg-slate-800/40 transition-all duration-200"
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-purple-400">{item.icon}</div>
                            <h3 className="text-sm font-medium text-slate-300">{item.title}</h3>
                        </div>
                        {item.component}
                    </motion.div>
                ))}
            </div>

            {/* Reset Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 w-full py-3 px-6 mt-auto
                         bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500
                         text-white font-medium rounded-xl transition-all duration-200
                         border border-slate-600/50 hover:border-slate-500/50
                         shadow-lg hover:shadow-xl"
                onClick={resetSettings}
            >
                <LuRefreshCw className="w-5 h-5" />
                Reset to Default
            </motion.button>
        </motion.div>
    )
}

export default SettingsView