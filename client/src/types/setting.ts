interface Settings {
    theme: string
    language: string
    fontSize: number
    fontFamily: string
}

interface SettingsContext extends Settings {
    setTheme: (theme: string) => void
    setLanguage: (language: string) => void
    setFontSize: (fontSize: number) => void
    setFontFamily: (fontFamily: string) => void
    resetSettings: () => void
}

export { Settings, SettingsContext }
