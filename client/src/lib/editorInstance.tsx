import { EditorView } from "@codemirror/view";

export const editorInstance: { current: EditorView | null } = {
    current: null,
};