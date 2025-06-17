import {HeroSection} from "./components/HeroSection.tsx";
import {BackgroundDots} from "./components/Background.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Survey from "./components/Survey.tsx";

function App() {
    return (
        <BrowserRouter>
            <div className="app-container min-h-screen relative">
                <BackgroundDots numberOfDots={100} />
                <Routes>
                    <Route path="/" element={<HeroSection />} />
                    <Route path="/survey" element={<Survey />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;