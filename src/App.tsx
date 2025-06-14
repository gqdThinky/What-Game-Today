import {HeroSection} from "./components/HeroSection.tsx";
import {Header} from "./components/Header.tsx";
import {BackgroundDots} from "./components/Background.tsx";

function App() {

    return (
        <div>
            <BackgroundDots numberOfDots={100} />
            <Header />
            <HeroSection />
        </div>
    );
}

export default App;