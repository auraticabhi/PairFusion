import { useAppContext } from "@/context/AppContext"
import { useFileSystem } from "@/context/FileContext"
import { useSettings } from "@/context/SettingContext"
import { useSocket } from "@/context/SocketContext"
import usePageEvents from "@/hooks/usePageEvents"
import { editorThemes } from "@/resources/Themes"
import { FileSystemItem } from "@/types/file"
import { SocketEvent } from "@/types/socket"
import { color } from "@uiw/codemirror-extensions-color"
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link"
import { LanguageName, loadLanguage } from "@uiw/codemirror-extensions-langs"
import CodeMirror, {
    Extension,
    ViewUpdate,
    scrollPastEnd,
} from "@uiw/react-codemirror"
import { useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { cursorTooltipBaseTheme, tooltipField } from "./tooltip"
import { EditorView } from "@codemirror/view";
import { editorInstance } from '@/lib/editorInstance';

// interface EditorProps {
//     setEditorView: (view: EditorView | null) => void;
// }

function Editor() {
    const { users, currentUser } = useAppContext()
    const { activeFile, setActiveFile } = useFileSystem()
    const { theme, language, fontSize } = useSettings()
    const { socket } = useSocket()
    //const { viewHeight } = useResponsive()
    const [timeOut, setTimeOut] = useState(setTimeout(() => {}, 0))
    const filteredUsers = useMemo(
        () => users.filter((u) => u.username !== currentUser.username),
        [users, currentUser],
    )
    const [extensions, setExtensions] = useState<Extension[]>([])
    const editorRef = useRef<EditorView | null>(null);
    const isUserScrolling = useRef(false);
    const scrollTimeout = useRef<NodeJS.Timeout>();

    const onCodeChange = (code: string, view: ViewUpdate) => {
        if (!activeFile) return

        //setEditorView(view.view);
        editorRef.current = view.view;

        const file: FileSystemItem = { ...activeFile, content: code }
        setActiveFile(file)
        const cursorPosition = view.state?.selection?.main?.head
        socket.emit(SocketEvent.TYPING_START, { cursorPosition })
        socket.emit(SocketEvent.FILE_UPDATED, {
            fileId: activeFile.id,
            newContent: code,
        })
        clearTimeout(timeOut)

        const newTimeOut = setTimeout(
            () => socket.emit(SocketEvent.TYPING_PAUSE),
            1000,
        )
        setTimeOut(newTimeOut)
    }

    useEffect(() => {
        if (!editorRef.current) return;

        const handleScroll = () => {
            isUserScrolling.current = true;
            clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                isUserScrolling.current = false;
            }, 100);
        };

        const scrollContainer = editorRef.current.scrollDOM;
        scrollContainer.addEventListener('scroll', handleScroll);

        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout.current);
        };
    }, []);

    useEffect(() => {
        if (!editorRef.current || isUserScrolling.current) return;

        // Get current scroll position
        const scrollDOM = editorRef.current.scrollDOM;
        const scrollTop = scrollDOM.scrollTop;
        const scrollLeft = scrollDOM.scrollLeft;

        // Restore scroll position after update
        requestAnimationFrame(() => {
            scrollDOM.scrollTop = scrollTop;
            scrollDOM.scrollLeft = scrollLeft;
        });
    }, [activeFile?.content]);
    usePageEvents()

    useEffect(() => {
        const extensions = [
            color,
            hyperLink,
            tooltipField(filteredUsers),
            cursorTooltipBaseTheme,
            scrollPastEnd(),
        ]
        const langExt = loadLanguage(language.toLowerCase() as LanguageName)
        if (langExt) {
            extensions.push(langExt)
        } else {
            toast.error(
                "Syntax highlighting is unavailable for this language. Please adjust the editor settings; it may be listed under a different name.",
                {
                    duration: 5000,
                },
            )
        }

        setExtensions(extensions)
    }, [filteredUsers, language])

    return (
        <CodeMirror
            theme={editorThemes[theme]}
            onChange={onCodeChange}
            value={activeFile?.content}
            extensions={extensions}
            onCreateEditor={(view) => {
                editorRef.current = view;
                editorInstance.current = view;
            }}
            height="100%"
            maxWidth="100vw"
            style={{
                fontSize: fontSize + "px",
                height: "100%",
                width: "100%",
            }}
        />
    )
}

export default Editor