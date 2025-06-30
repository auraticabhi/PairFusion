import { useSettings } from "@/context/SettingContext"
import { useEffect } from "react"

function usePageEvents() {
    const { fontSize, setFontSize } = useSettings()

    useEffect(() => {
        // Prevent user from leaving the page
        const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            return (e.returnValue = "Changes you made may not be saved");
        };

        window.addEventListener("beforeunload", beforeUnloadHandler)

        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler)
        }
    }, [])

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            // We only care about events where the Ctrl key (or Cmd on Mac) is pressed.
            if (e.ctrlKey) {
                // We must call preventDefault() to stop the browser's native zoom.
                e.preventDefault();

                // Check if the event originated inside the CodeMirror editor.
                // This prevents zooming when scrolling over other parts of the UI.
                if ((e.target as HTMLElement).closest(".cm-editor")) {
                    // Calculate the new font size, clamping it between 12 and 24.
                    const newSize = e.deltaY > 0 ? Math.max(fontSize - 1, 12) : Math.min(fontSize + 1, 24);
                    setFontSize(newSize);
                }
            }
        };

        // We add the listener with the `{ passive: false }` option.
        // This tells the browser our listener is "active" and might call preventDefault().
        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, [fontSize, setFontSize]);
}

export default usePageEvents
