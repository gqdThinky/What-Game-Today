import {HeroSection} from "./components/HeroSection.tsx";
import {BackgroundDots} from "./components/Background.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Questions from "./components/Questions.tsx";

function App() {
    return (
        <BrowserRouter>
            <div className="app-container min-h-screen relative">
                <BackgroundDots numberOfDots={100} />
                <Routes>
                    <Route path="/" element={<HeroSection />} />
                    <Route path="/questionnaire" element={<Questions />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;