import { RemoteUser } from "@/types/user"
import { StateField } from "@codemirror/state"
import { EditorView, showTooltip } from "@codemirror/view"

export function tooltipField(users: RemoteUser[]) {
    return StateField.define({
        create: () => getCursorTooltips(users),
        update(tooltips, tr) {
            if (!tr.docChanged && !tr.selection) return tooltips
            return getCursorTooltips(users)
        },
        provide: (f) => showTooltip.computeN([f], (state) => state.field(f)),
    })
}

export function getCursorTooltips(users: RemoteUser[]) {
    return users.map((user) => {
        if (!user.typing) {
            return null
        }
        let text = user.username
        const pos = user.cursorPosition
        if (user) {
            text = user.username
        }

        return {
            pos,
            above: false,
            strictSide: true,
            arrow: true,
            create: () => {
                const dom = document.createElement("div")
                dom.className = "cm-tooltip-cursor"
                dom.textContent = text
                return { dom }
            },
        }
    })
}

export const cursorTooltipBaseTheme = EditorView.baseTheme({
    ".cm-tooltip.cm-tooltip-cursor": {
        backgroundColor: "#66b",
        color: "white",
        border: "none",
        padding: "2px 7px",
        borderRadius: "4px",
        zIndex: "99999",
        "& .cm-tooltip-arrow:before": {
            borderTopColor: "#66b",
        },
        "& .cm-tooltip-arrow:after": {
            borderTopColor: "transparent",
        },
    },
})