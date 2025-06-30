import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Toast from "./components/toast/Toast"
import EditorPage from "./pages/EditorPage"
import HomePage from "./pages/HomePage"
import JoinPage from "./pages/JoinPage";
import { Tooltip } from 'react-tooltip';
import { tooltipStyles } from "./components/sidebar/tooltipStyles";

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/join" element={<JoinPage />} />
                    <Route path="/editor/:roomId" element={<EditorPage />} />
                </Routes>
            </Router>
            <Toast />

            <Tooltip 
                id="actions-tooltip" 
                place="right" 
                offset={15}
                style={{
                    ...tooltipStyles,
                    zIndex: 9999
                }} 
            />

            <Tooltip 
                id="sidebar-tooltip"
                place="right" 
                offset={15}
                style={{
                    ...tooltipStyles,
                    zIndex: 9999
                }} 
            />
        </>
    )
}

export default App
