import { MainMenu } from "./components/MainMenu.tsx";
import { BackgroundDots } from "./components/Background.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Survey from "./components/Survey.tsx";
import backgroundPng from "./assets/background.png";
import { AnimatePresence } from "framer-motion";
import Results from "./components/Results.tsx";

function App() {
    return (
        <BrowserRouter>
            <div className="app-container min-h-screen relative">
                <BackgroundDots numberOfDots={100} backgroundImage={backgroundPng} />
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<MainMenu />} />
                        <Route path="/survey" element={<Survey />} />
                        <Route path="/results" element={<Results />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </BrowserRouter>
    );
}

export default App;