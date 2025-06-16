import {HeroSection} from "./components/HeroSection.tsx";
import {BackgroundDots} from "./components/Background.tsx";

function App() {
    return (
        <div className="app-container min-h-screen relative">
            <BackgroundDots numberOfDots={100} />
            <HeroSection />
        </div>
    );
}

export default App;